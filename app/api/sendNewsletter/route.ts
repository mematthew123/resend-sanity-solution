import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { NewsLetterEmailTemplate } from '@/components/NewsLetterEmailTemplate';
import { client } from "@/sanity/lib/client";

const resend = new Resend(process.env.RESEND_API_KEY);
const apiToken = process.env.NEXT_PUBLIC_SANITY_API_TOKEN;
const audienceId = process.env.RESEND_AUDIENCE_ID || '';
const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://resend-sanity-solution.vercel.app/';


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
    const { documentId, selectedContacts } = jsonBody;

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

    if (!selectedContacts || selectedContacts.length === 0) {
      console.error('No contacts selected');
      return NextResponse.json({ message: 'No contacts selected' }, { status: 400 });
    }

    console.log('Fetching contacts from Resend');
    let contacts;
    try {
      const response = await resend.contacts.list({ audienceId });
      console.log('Resend API response:', JSON.stringify(response, null, 2)); // Detailed logging

      if (response && response.data) {
        contacts = response.data;
        console.log('Fetched contacts:', contacts);
      } else {
        console.error('Unexpected response structure:', JSON.stringify(response, null, 2));
        return NextResponse.json({ message: 'Unexpected response structure from Resend' }, { status: 500 });
      }
    } catch (error) {
      console.error('Error fetching contacts from Resend:', error);
      return NextResponse.json({ message: 'Error fetching contacts from Resend' }, { status: 500 });
    }

    // Filter contacts based on selectedContacts
    const filteredContacts = contacts.data.filter((contact: { id: any; }) => selectedContacts.includes(contact.id));
    console.log('Filtered contacts:', filteredContacts);

    if (filteredContacts.length === 0) {
      console.error('No matching contacts found');
      return NextResponse.json({ message: 'No matching contacts found' }, { status: 400 });
    }

    console.log(`Preparing to send emails to ${filteredContacts.length} contacts`);
    const emailBatch = filteredContacts.map(contact => {
      const unsubscribeUrl = `${websiteUrl}/unsubscribe?id=${contact.id}`;
      return {
        from: "Bernice <hello@zephyrpixels.dev>",
        to: [contact.email],
        subject: newsletter.title,
        react: NewsLetterEmailTemplate({
          preview: newsletter.emailDetails.preview,
          subject: newsletter.title,
          content: newsletter.emailDetails.body,
          recipientId: contact.id,
          unsubscribeUrl: unsubscribeUrl, // Pass the constructed URL
        }),
        text: `This is a text version of the email. To unsubscribe, visit: ${unsubscribeUrl}`,
      };
    });
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