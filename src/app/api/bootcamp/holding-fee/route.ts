import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// POST - Create payment intent for holding fee
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { registrationId, email } = body;

    if (!registrationId || !email) {
      return NextResponse.json(
        { error: 'Registration ID and email are required' },
        { status: 400 }
      );
    }

    // Get registration details
    const registration = await pool.query(
      `SELECT r.*, c.holding_fee_amount, c.cohort_name 
       FROM early_registrations r
       JOIN bootcamp_cohorts c ON r.cohort_id = c.id
       WHERE r.id = $1 AND r.email = $2`,
      [registrationId, email]
    );

    if (registration.rows.length === 0) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    const reg = registration.rows[0];

    // Check if holding fee already paid
    if (reg.has_paid_holding_fee) {
      return NextResponse.json(
        { error: 'Holding fee has already been paid for this registration' },
        { status: 400 }
      );
    }

    const holdingFeeAmount = parseFloat(reg.holding_fee_amount);
    const amountInCents = Math.round(holdingFeeAmount * 100);

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      description: `Holding Fee - ${reg.cohort_name}`,
      metadata: {
        registration_id: registrationId,
        registration_email: email,
        type: 'holding_fee',
        cohort_name: reg.cohort_name
      },
      receipt_email: email,
    });

    // Create payment record
    await pool.query(
      `INSERT INTO holding_fee_payments (
        registration_id, stripe_payment_intent_id, amount, currency, payment_status
      ) VALUES ($1, $2, $3, $4, 'pending')`,
      [registrationId, paymentIntent.id, holdingFeeAmount, 'USD']
    );

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      amount: holdingFeeAmount,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('Error creating holding fee payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}

// PUT - Confirm payment completion (webhook or manual confirmation)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentIntentId, registrationId } = body;

    if (!paymentIntentId || !registrationId) {
      return NextResponse.json(
        { error: 'Payment Intent ID and Registration ID are required' },
        { status: 400 }
      );
    }

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Payment has not been completed' },
        { status: 400 }
      );
    }

    // Update payment record
    await pool.query(
      `UPDATE holding_fee_payments 
       SET payment_status = 'succeeded',
           stripe_charge_id = $1,
           receipt_url = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE stripe_payment_intent_id = $3`,
      [
        paymentIntent.latest_charge,
        paymentIntent.charges?.data[0]?.receipt_url || null,
        paymentIntentId
      ]
    );

    // Update registration
    await pool.query(
      `UPDATE early_registrations 
       SET has_paid_holding_fee = true,
           holding_fee_paid_at = CURRENT_TIMESTAMP,
           has_early_bird_discount = true,
           amount_paid = amount_paid + $1,
           status = 'holding-paid',
           registration_type = 'holding-fee',
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [paymentIntent.amount / 100, registrationId]
    );

    // TODO: Send confirmation email with discount code
    // TODO: Notify admin of payment received

    return NextResponse.json({
      success: true,
      message: 'Holding fee payment confirmed. You now have the early bird discount!',
      earlyBirdDiscount: 1500
    });

  } catch (error) {
    console.error('Error confirming payment:', error);
    return NextResponse.json(
      { error: 'Failed to confirm payment' },
      { status: 500 }
    );
  }
}
