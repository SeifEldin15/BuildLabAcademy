import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { sendNewsletterEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { subject, content, adminKey } = await request.json();

    // Simple admin authentication (in production, use proper authentication)
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate input
    if (!subject || !content) {
      return NextResponse.json(
        { error: 'Subject and content are required' },
        { status: 400 }
      );
    }

    // Get all active subscribers
    const result = await pool.query(
      'SELECT email FROM newsletter_subscriptions WHERE is_active = true ORDER BY subscribed_at DESC'
    );

    const subscriberEmails = result.rows.map(row => row.email);

    if (subscriberEmails.length === 0) {
      return NextResponse.json(
        { message: 'No active subscribers found' },
        { status: 200 }
      );
    }

    // Send newsletter to all subscribers (in batches for better performance)
    const batchSize = 50;
    const batches = [];
    
    for (let i = 0; i < subscriberEmails.length; i += batchSize) {
      batches.push(subscriberEmails.slice(i, i + batchSize));
    }

    let sentCount = 0;
    let failedCount = 0;

    for (const batch of batches) {
      try {
        await sendNewsletterEmail(batch, subject, content);
        sentCount += batch.length;
      } catch (error) {
        console.error('Failed to send batch:', error);
        failedCount += batch.length;
      }
    }

    return NextResponse.json(
      { 
        message: `Newsletter sent successfully!`,
        stats: {
          totalSubscribers: subscriberEmails.length,
          sent: sentCount,
          failed: failedCount
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Newsletter send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminKey = searchParams.get('adminKey');

    // Simple admin authentication
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get newsletter statistics
    const activeSubscribers = await pool.query(
      'SELECT COUNT(*) as count FROM newsletter_subscriptions WHERE is_active = true'
    );

    const totalSubscribers = await pool.query(
      'SELECT COUNT(*) as count FROM newsletter_subscriptions'
    );

    const recentSubscribers = await pool.query(
      'SELECT email, subscribed_at, source FROM newsletter_subscriptions WHERE is_active = true ORDER BY subscribed_at DESC LIMIT 10'
    );

    return NextResponse.json(
      {
        stats: {
          activeSubscribers: parseInt(activeSubscribers.rows[0].count),
          totalSubscribers: parseInt(totalSubscribers.rows[0].count),
          unsubscribed: parseInt(totalSubscribers.rows[0].count) - parseInt(activeSubscribers.rows[0].count)
        },
        recentSubscribers: recentSubscribers.rows
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Newsletter stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
