import React, { useState, useEffect } from "react";
import { Stack, Card, Text, Button, TextInput, Box, Switch } from "@sanity/ui";
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

  return (
    <Card padding={4}>
      <Stack space={4}>
        <Text size={4} weight="bold">
          Contact Manager
        </Text>

        {error && (
          <Text size={2} weight="bold" >
            {error}
          </Text>
        )}

        <Stack space={3}>
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
          />
        </Stack>

        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <Stack space={3}>
            {contacts.map((contact) => (
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
