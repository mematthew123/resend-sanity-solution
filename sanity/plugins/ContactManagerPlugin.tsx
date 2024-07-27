import React, { useState, useEffect } from "react";
import {
  Stack,
  Card,
  Text,
  Button,
  TextInput,
  Box,
} from "@sanity/ui";
import { definePlugin, useClient } from "sanity";
import { Tool } from "sanity";
import ContactCard from "./components/ContactCard";

export interface Contact {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  unsubscribed?: boolean;
}

export function ContactManagerPlugin() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const client = useClient({ apiVersion: "2021-10-21" });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/resend-contacts");
      if (!response.ok) {
        throw new Error("Failed to fetch contacts");
      }
      const data = await response.json();
      setContacts(data);
    } catch (err) {
      setError("Failed to fetch contacts");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const addContact = async () => {
    if (!newEmail) {
      setError("Email is required");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/resend-contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: newEmail,
          firstName: newFirstName,
          lastName: newLastName,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add contact");
      }
      setNewEmail("");
      setNewFirstName("");
      setNewLastName("");
      await fetchContacts();
    } catch (err) {
      setError("Failed to add contact");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateContact = async (id: string, data: Partial<Contact>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/resend-contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          ...data,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update contact");
      }
      await fetchContacts();
    } catch (err) {
      setError("Failed to update contact");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteContact = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/resend-contacts?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete contact");
      }
      await fetchContacts();
    } catch (err) {
      setError("Failed to delete contact");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredContacts = contacts.filter((contact) =>
    `${contact.email} ${contact.firstName} ${contact.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (

<Card padding={5} radius={3} shadow={2}>
  <Stack space={5}>
    <Text size={4} weight="bold">
      Contact Manager
    </Text>

    {error && (
      <Text size={3} weight="bold" color="critical">
        {error}
      </Text>
    )}

    <Stack space={4}>
      <TextInput
        placeholder="Email"
        value={newEmail}
        onChange={(event) => setNewEmail(event.currentTarget.value)}
      />
      <TextInput
        placeholder="First Name"
        value={newFirstName}
        onChange={(event) => setNewFirstName(event.currentTarget.value)}
      />
      <TextInput
        placeholder="Last Name"
        value={newLastName}
        onChange={(event) => setNewLastName(event.currentTarget.value)}
      />
      <Button
        text="Add Contact"
        tone="positive"
        onClick={addContact}
        disabled={isLoading}
        fontSize={[2, 2, 3]}
      />
    </Stack>

    <Box padding={300} style={{ borderTop: '1px solid #eaeaea' }}>
      <TextInput
        placeholder="Search contacts"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.currentTarget.value)}
        padding={[3, 3, 4]}
      />
    </Box>

    {isLoading ? (
      <Text size={2} muted>Loading...</Text>
    ) : (
      <Stack space={4}>
        {filteredContacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            onUpdate={updateContact}
            onDelete={deleteContact}
          />
        ))}
      </Stack>
    )}
  </Stack>
</Card>
  );
}

const contactManagerTool = (): Tool => {
  return {
    title: "Contacts",
    name: "contact-manager",
    component: ContactManagerPlugin,
  };
};

export const contactManagerPlugin = definePlugin({
  name: "contact-manager-plugin",
  tools: [contactManagerTool()],
});