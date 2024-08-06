// /api/resend-contacts/route.ts

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || '');
const audienceId = process.env.RESEND_AUDIENCE_ID || '';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subscribedOnly = searchParams.get('subscribedOnly') === 'true';

    const response = await resend.contacts.list({ audienceId });

    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      let contacts = response.data.data;

      if (subscribedOnly) {
        contacts = contacts.filter(contact => contact.unsubscribed !== true);
      }

      return NextResponse.json(contacts);
    } else {
      console.error('Unexpected response structure:', response);
      return NextResponse.json([], { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ message: 'Error fetching contacts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { id, email, firstName, lastName, unsubscribed } = await request.json();

    if (id) {
      // Update contact
      const response = await resend.contacts.update({
        audienceId,
        id,
        firstName,
        lastName,
        unsubscribed,
      });

      return NextResponse.json(response.data);
    } else {
      // Create new contact
      if (!email) {
        return NextResponse.json({ message: 'Email is required' }, { status: 400 });
      }

      const response = await resend.contacts.create({
        audienceId,
        email,
        firstName,
        lastName,
      });

      return NextResponse.json(response.data);
    }
  } catch (error) {
    console.error('Error handling contact:', error);
    return NextResponse.json({ message: `Oops! Something went wrong: ${(error as Error).message}` }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Contact ID is required' }, { status: 400 });
    }

    await resend.contacts.remove({
      audienceId,
      id,
    });

    return NextResponse.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json({ message: 'Error deleting contact' }, { status: 500 });
  }
}
