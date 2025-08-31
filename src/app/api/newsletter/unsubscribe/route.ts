import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token && !email) {
      return NextResponse.json(
        { error: 'Unsubscribe token or email is required' },
        { status: 400 }
      );
    }

    let query, params;
    
    if (token) {
      query = 'UPDATE newsletter_subscriptions SET is_active = false WHERE unsubscribe_token = $1 AND is_active = true RETURNING email';
      params = [token];
    } else {
      query = 'UPDATE newsletter_subscriptions SET is_active = false WHERE email = $1 AND is_active = true RETURNING email';
      params = [email];
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Subscription not found or already unsubscribed' },
        { status: 404 }
      );
    }

    const unsubscribedEmail = result.rows[0].email;

    // Return a simple HTML page confirming unsubscription
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Unsubscribed - Build Lab Academy</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
            background-color: #f9fafb;
            color: #374151;
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            text-align: center;
          }
          .logo {
            height: 60px;
            margin-bottom: 30px;
          }
          h1 {
            color: #1f2937;
            margin-bottom: 20px;
          }
          p {
            line-height: 1.6;
            margin-bottom: 20px;
          }
          .email {
            background: #f3f4f6;
            padding: 10px;
            border-radius: 4px;
            font-family: monospace;
          }
          .button {
            display: inline-block;
            background: #3b82f6;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>✅ You've been unsubscribed</h1>
          <p>The email address <span class="email">${unsubscribedEmail}</span> has been successfully removed from our newsletter.</p>
          <p>We're sorry to see you go! If you change your mind, you can always subscribe again on our website.</p>
          <a href="${process.env.NEXTAUTH_URL}" class="button">Visit Build Lab Academy</a>
        </div>
      </body>
      </html>
    `;

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'UPDATE newsletter_subscriptions SET is_active = false WHERE email = $1 AND is_active = true RETURNING email',
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Email not found or already unsubscribed' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Successfully unsubscribed from newsletter' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
