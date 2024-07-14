import React, { useEffect, useState } from 'react';
import { StringInputProps, set, unset } from 'sanity';

interface Contact {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

const ContactListSanity = (props: StringInputProps) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (selectedContacts.length > 0) {
      if (props.onChange) {
        props.onChange(set(JSON.stringify(selectedContacts)));
      }
    } else {
      if (props.onChange) {
        props.onChange(unset());
      }
    }
  }, [selectedContacts]);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/resend-contacts');
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      const data = await response.json();
      console.log('Fetched data:', data); // Debug log
      if (Array.isArray(data)) {
        setContacts(data);
      } else {
        setContacts([]);
        setError('Received data is not an array');
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError('Failed to fetch contacts');
    }
  };

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

  if (error) {
    return <div>Error: {error}</div>;
  }

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
      {contacts.length > 0 ? (
        contacts.map(contact => (
          <div key={contact.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedContacts.includes(contact.id)}
                onChange={() => handleSelectContact(contact.id)}
              />
              {contact.first_name} {contact.last_name} ({contact.email})
            </label>
          </div>
        ))
      ) : (
        <div>No contacts available</div>
      )}
    </div>
  );
};

export default ContactListSanity;
