import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { EmailTemplate } from '@/components/EmailTemplate';
import { client } from "@/sanity/lib/client";

const resend = new Resend(process.env.RESEND_API_KEY);
const apiToken = process.env.NEXT_PUBLIC_SANITY_API_TOKEN;

async function readBody(readable: ReadableStream) {
  const reader = readable.getReader();
  const chunks = [];
  let done, value;
  while ({ done, value } = await reader.read(), !done) {
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString('utf8');
}

async function fetchResendContacts() {
  try {
    const response = await fetch('https://api.resend.com/v1/contacts', {
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch contacts from Resend API');
    }
    const data = await response.json();
    return data.contacts;
  } catch (error) {
    console.error('Error fetching contacts from Resend API:', error);
    return [];
  }
}

export async function POST(request: Request) {
  console.log('Incoming request:', request); // Debug log

  const authorization = request.headers.get('Authorization');
  const token = authorization?.split(' ')[1];

  if (token !== apiToken) {
    console.error('Invalid API token');
    return NextResponse.json({ message: 'Invalid API token' }, { status: 401 });
  }

  const body = await readBody(request.body as ReadableStream);
  console.log('Raw body:', body); // Debug log

  try {
    const jsonBody = JSON.parse(body);
    const { documentId, selectedContacts } = jsonBody;

    console.log('Received JSON body:', jsonBody); // Debug log
    console.log('Received selected contacts:', selectedContacts); // Debug log

    if (!documentId) {
      console.error('No document ID provided');
      return NextResponse.json({ message: 'No document ID provided' }, { status: 400 });
    }

    if (!selectedContacts || selectedContacts.length === 0) {
      console.error('No contacts selected');
      return NextResponse.json({ message: 'No contacts selected' }, { status: 400 });
    }

    const newsletter = await client.fetch(`*[_id == $id][0]`, { id: documentId });
    console.log('Fetched newsletter:', newsletter); // Debug log

    if (!newsletter || newsletter._type !== 'newsLetter') {
      console.error('Invalid document type or document not found');
      return NextResponse.json({ message: 'Invalid document type or document not found' }, { status: 400 });
    }

    const allContacts = await fetchResendContacts();
    console.log('All contacts from Resend API:', allContacts); // Debug log

    const contacts = allContacts.filter((contact: { id: any; }) => selectedContacts.includes(contact.id));
    console.log('Matched contacts:', contacts); // Debug log

    if (!contacts || contacts.length === 0) {
      console.error('No contacts found');
      return NextResponse.json({ message: 'No contacts found' }, { status: 400 });
    }

    for (const contact of contacts) {
      try {
        await resend.emails.send({
          from: "Bernice <hello@zephyrpixels.dev>",
          to: [contact.email],
          subject: newsletter.title,
          react: EmailTemplate({
            title: newsletter.title,
            subject: newsletter.title,
            content: newsletter.emailDetails.body
          }),
          text: "This is a text version of the email.",
        });
        console.log(`Email sent to ${contact.email}`);
      } catch (emailError) {
        console.error(`Error sending email to ${contact.email}:`, emailError);
      }
    }

    return NextResponse.json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ message: 'Error processing webhook' }, { status: 500 });
  }
}
