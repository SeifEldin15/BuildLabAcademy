import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseType, amount } = await request.json();

    // Validate amount based on course type
    const prices = {
      'individual': 50000, // $500.00 in cents
      'group': 30000      // $300.00 in cents
    };

    const validAmount = prices[courseType as keyof typeof prices];
    if (!validAmount || amount !== validAmount) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: validAmount,
      currency: 'usd',
      metadata: {
        courseType,
        userEmail: session.user?.email || '',
        userName: session.user?.name || '',
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: validAmount,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
