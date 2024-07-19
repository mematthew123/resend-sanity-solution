import React, { useEffect, useState, useMemo } from 'react';
import { StringInputProps, set, unset } from 'sanity';
import { debounce } from 'lodash';

interface Contact {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  unsubscribed?: boolean;
}

const ContactListSanity: React.FC<StringInputProps> = (props) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const debouncedOnChange = useMemo(
    () => debounce((value: string[]) => {
      if (value.length > 0) {
        props.onChange(set(JSON.stringify(value)));
      } else {
        props.onChange(unset());
      }
    }, 300),
    [props]
  );

  useEffect(() => {
    debouncedOnChange(selectedContacts);
    return () => {
      debouncedOnChange.cancel();
    };
  }, [selectedContacts, debouncedOnChange]);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/resend-contacts', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setContacts(data);
      } else {
        throw new Error('Received data is not an array');
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const updateContact = async (id: string, updateData: Partial<Contact>) => {
    try {
      const response = await fetch('/api/resend-contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          audienceId: process.env.NEXT_PUBLIC_RESEND_AUDIENCE_ID,
          ...updateData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update contact');
      }

      // Refresh the contact list
      await fetchContacts();
    } catch (error) {
      console.error('Error updating contact:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedContacts(event.target.checked ? contacts.map(contact => contact.id) : []);
  };

  const handleSelectContact = (id: string) => {
    setSelectedContacts(prev =>
      prev.includes(id) ? prev.filter(contactId => contactId !== id) : [...prev, id]
    );
  };

  const handleUnsubscribe = async (id: string) => {
    await updateContact(id, { unsubscribed: true });
  };

  if (isLoading) {
    return <div>Loading contacts...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={selectedContacts.length === contacts.length}
          onChange={handleSelectAll}
          aria-label="Select all contacts"
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
                aria-label={`Select ${contact.first_name} ${contact.last_name}`}
              />
              {contact.first_name} {contact.last_name} ({contact.email})
            </label>
            <button onClick={() => handleUnsubscribe(contact.id)}>Unsubscribe</button>
          </div>
        ))
      ) : (
        <div>No subscribed contacts available</div>
      )}
    </div>
  );
};

export default ContactListSanity;