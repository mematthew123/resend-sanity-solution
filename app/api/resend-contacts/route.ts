// app/api/contacts/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function GET() {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const audienceId = process.env.RESEND_AUDIENCE_ID || ''; // Set a default value if undefined
    const response = await resend.contacts.list({
      audienceId,
    });
    console.log('Resend API response:', response); // Debug log
    
    // Check if response.data is an object with a data property that is an array
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return NextResponse.json(response.data.data);
    } else {
      console.error('Unexpected response structure:', response);
      return NextResponse.json([], { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ message: 'Error fetching contacts' }, { status: 500 });
  }
}