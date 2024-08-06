import { EmailTemplate } from '../../../components/EmailTemplate';
import { NewsLetterEmailTemplate } from '../../../components/NewsLetterEmailTemplate';
import { Resend } from 'resend';
import groq from 'groq';
import { client } from '@/sanity/lib/client';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);
const audienceId = process.env.RESEND_AUDIENCE_ID || '';
const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://resend-sanity-solution.vercel.app/';

async function readBody(readable: ReadableStream): Promise<string> {
  const reader = readable.getReader();
  const chunks = [];
  let done, value;
  while ((({ done, value } = await reader.read()), !done)) {
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString('utf8');
}

async function fetchEmailSignUp() {
  const query = groq`*[_type == "emailSignUp"] | order(_updatedAt desc)[0]{
    _id,
    _createdAt,
    _updatedAt,
    title,
    "emailSubject": emailDetails.subject,
    "emailPreview": emailDetails.preview,
    "emailBody": emailDetails.body,
  }`;

  return client.fetch(query);
}

async function sendIndividualEmail(emailAddress: string, emailSignUp: any) {
  const subject = emailSignUp.emailSubject || '';
  const emailBody = emailSignUp.emailBody || [];
  const title = emailSignUp.title || '';
  const preview = emailSignUp.emailPreview || '';

  try {
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Matthew <hello@zephyrpixels.dev>',
      to: [emailAddress],
      subject: subject,
      react: EmailTemplate({ title, subject, content: emailBody, preview }),
      text: 'This is a text version of the email.',
    });

    if (emailError) {
      return NextResponse.json({ error: emailError }, { status: 500 });
    }

    await resend.contacts.create({
      email: emailAddress,
      audienceId,
    });

    return NextResponse.json({
      message: 'Subscription successful',
      emailData: emailSignUp,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error('An unknown error occurred');
    }
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}

async function sendNewsletter(documentId: string, selectedContacts: string[]) {
  const newsletter = await client.fetch(
    `*[_id == $id][0]{
      ...,
      "author": emailDetails.author->name
    }`,
    { id: documentId }
  );

  if (!newsletter || newsletter._type !== 'newsLetter') {
    return NextResponse.json({ message: 'Invalid document type or document not found' }, { status: 400 });
  }

  if (!selectedContacts || selectedContacts.length === 0) {
    return NextResponse.json({ message: 'No contacts selected' }, { status: 400 });
  }

  let contacts;
  try {
    const response = await resend.contacts.list({ audienceId });

    if (response && response.data) {
      contacts = response.data;
    } else {
      return NextResponse.json({ message: 'Unexpected response structure from Resend' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching contacts from Resend' }, { status: 500 });
  }

  const filteredContacts = contacts.data.filter((contact: { id: any }) =>
    selectedContacts.includes(contact.id)
  );

  if (filteredContacts.length === 0) {
    console.error('No matching contacts found');
    return NextResponse.json({ message: 'No matching contacts found' }, { status: 400 });
  }

  const emailBatch = filteredContacts.map((contact: { id: any; email: any }) => {
    const unsubscribeUrl = `${websiteUrl}/unsubscribe?id=${contact.id}`;
    return {
      from: `${newsletter.author || 'Newsletter'} <hello@zephyrpixels.dev>`,
      to: [contact.email],
      subject: newsletter.title,
      react: NewsLetterEmailTemplate({
        preview: newsletter.emailDetails.preview,
        subject: newsletter.title,
        content: newsletter.emailDetails.body,
        recipientId: contact.id,
        unsubscribeUrl: unsubscribeUrl,
        author: newsletter.author,
      }),
      text: `This is a text version of the email. To unsubscribe, visit: ${unsubscribeUrl}`,
    };
  });

  try {
    const result = await resend.batch.send(emailBatch);
    return NextResponse.json({ message: 'Emails sent successfully', result });
  } catch (batchError) {
    console.error('Error sending batch emails:', batchError);
    return NextResponse.json({ message: 'Error sending batch emails', error: batchError }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await readBody(request.body as ReadableStream);
    const jsonBody = JSON.parse(body);

    if (jsonBody.emailAddress) {
      const emailSignUp = await fetchEmailSignUp();
      if (!emailSignUp) {
        return NextResponse.json({ error: 'No email sign-up data found' }, { status: 404 });
      }
      return sendIndividualEmail(jsonBody.emailAddress, emailSignUp);
    } else if (jsonBody.documentId && jsonBody.selectedContacts) {
      return sendNewsletter(jsonBody.documentId, jsonBody.selectedContacts);
    } else {
      return NextResponse.json({ message: 'Invalid request data' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error during email sending process:', error);
    return NextResponse.json({ error: 'Oh no! Something went wrong' }, { status: 500 });
  }
}