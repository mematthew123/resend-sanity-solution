// app/api/unsubscribe/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ message: 'Missing contact ID' }, { status: 400 });
  }

  try {
    const audienceId = process.env.RESEND_AUDIENCE_ID || '';
    await resend.contacts.update({
      id,
      audienceId,
      unsubscribed: true,
    });

    return NextResponse.json({ message: 'Successfully unsubscribed' });
  } catch (error) {
    console.error('Error unsubscribing contact:', error);
    return NextResponse.json({ message: 'Error unsubscribing contact' }, { status: 500 });
  }
}