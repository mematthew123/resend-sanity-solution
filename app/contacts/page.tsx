// app/contacts/page.tsx
import { Resend } from 'resend';
import ContactList from '@/components/ContactList'; 

export const revalidate = 1;

async function getContacts() {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data } = await resend.contacts.list({
    audienceId: process.env.RESEND_AUDIENCE_ID || '',
  });
  return data;
}

export default async function ContactsPage() {
  const contacts = await getContacts();

  return (
      <div>
        <h1>Contacts</h1>
        {contacts && <ContactList contacts={contacts.data} />}
      </div>
    );
}