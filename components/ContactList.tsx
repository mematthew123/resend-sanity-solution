'use client';

import { useState } from 'react';

interface Contact {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface ContactListProps {
  contacts: Contact[];
}

export default function ContactList({ contacts }: ContactListProps) {
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedContacts(contacts.map(contact => contact.id));
    } else {
      setSelectedContacts([]);
    }
  };

  const handleSelectContact = (id: string) => {
    setSelectedContacts(prev =>
      prev.includes(id) ? prev.filter(contactId => contactId !== id) : [...prev, id]
    );
  };

  const isAllSelected = selectedContacts.length === contacts.length;

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={isAllSelected}
          onChange={handleSelectAll}
        />
        Select All
      </label>
      {contacts.map(contact => (
        <div key={contact.id}>
          <label>
            <input
              type="checkbox"
              checked={selectedContacts.includes(contact.id)}
              onChange={() => handleSelectContact(contact.id)}
            />
            {contact.firstName} {contact.lastName} ({contact.email})
          </label>
        </div>
      ))}
    </div>
  );
}