import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { sendNewsletterWelcomeEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscription = await pool.query(
      'SELECT id, is_active FROM newsletter_subscriptions WHERE email = $1',
      [email]
    );

    if (existingSubscription.rows.length > 0) {
      const subscription = existingSubscription.rows[0];
      
      if (subscription.is_active) {
        return NextResponse.json(
          { error: 'This email is already subscribed to our newsletter' },
          { status: 409 }
        );
      } else {
        // Reactivate subscription
        const result = await pool.query(
          'UPDATE newsletter_subscriptions SET is_active = true, subscribed_at = NOW() WHERE email = $1 RETURNING unsubscribe_token',
          [email]
        );
        
        const unsubscribeToken = result.rows[0].unsubscribe_token;
        
        // Send welcome email
        try {
          await sendNewsletterWelcomeEmail(email, unsubscribeToken);
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError);
          // Don't fail the subscription if email fails
        }

        return NextResponse.json(
          { message: 'Welcome back! Your newsletter subscription has been reactivated.' },
          { status: 200 }
        );
      }
    }

    // Create new subscription
    const result = await pool.query(
      'INSERT INTO newsletter_subscriptions (email, source) VALUES ($1, $2) RETURNING unsubscribe_token',
      [email, 'website']
    );

    const unsubscribeToken = result.rows[0].unsubscribe_token;

    // Send welcome email
    try {
      await sendNewsletterWelcomeEmail(email, unsubscribeToken);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the subscription if email fails
    }

    return NextResponse.json(
      { message: 'Thank you for subscribing! Please check your email for a welcome message.' },
      { status: 201 }
    );

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
