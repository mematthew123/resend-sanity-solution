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

export async function POST(request: Request) {
  console.log('Received POST request');

  const authorization = request.headers.get('Authorization');
  const token = authorization?.split(' ')[1];

  if (token !== apiToken) {
    console.error('Invalid API token');
    return NextResponse.json({ message: 'Invalid API token' }, { status: 401 });
  }

  const body = await readBody(request.body as ReadableStream);

  try {
    const jsonBody = JSON.parse(body);
    const { documentId } = jsonBody;

    console.log('Parsed body:', jsonBody);

    if (!documentId) {
      console.error('No document ID provided');
      return NextResponse.json({ message: 'No document ID provided' }, { status: 400 });
    }

    console.log('Fetching newsletter from Sanity');
    const newsletter = await client.fetch(`*[_id == $id][0]`, { id: documentId });

    if (!newsletter || newsletter._type !== 'newsLetter') {
      console.error('Invalid document type or document not found');
      return NextResponse.json({ message: 'Invalid document type or document not found' }, { status: 400 });
    }

    console.log('Fetching contacts from Sanity');
    const contacts = await client.fetch(`*[_type == "contacts" && _id in $ids]{email}`, {
      ids: newsletter.contacts.map((ref: any) => ref._ref)
    });

    if (!contacts || contacts.length === 0) {
      console.error('No contacts found');
      return NextResponse.json({ message: 'No contacts found' }, { status: 400 });
    }

    console.log(`Preparing to send emails to ${contacts.length} contacts`);
    
    const emailBatch = contacts.map((contact: { email: any; }) => ({
      from: "Bernice <hello@zephyrpixels.dev>",
      to: [contact.email],
      subject: newsletter.title,
      react: EmailTemplate({
        title: newsletter.title,
        subject: newsletter.title,
        content: newsletter.emailDetails.body
      }),
      text: "This is a text version of the email.",
    }));

    try {
      const result = await resend.batch.send(emailBatch);
      console.log('Batch email result:', result);
      return NextResponse.json({ message: 'Emails sent successfully', result });
    } catch (batchError) {
      console.error('Error sending batch emails:', batchError);
      return NextResponse.json({ message: 'Error sending batch emails', error: batchError }, { status: 500 });
    }

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
  }
}