import React, { useEffect, useState, useMemo } from "react";
import { StringInputProps, set, unset } from "sanity";
import { debounce } from "lodash";
import {
  Box,
  Card,
  Stack,
  Text,
  Checkbox,
  Button,
  Flex,
  Spinner,
} from "@sanity/ui";

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
    () =>
      debounce((value: string[]) => {
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
      const response = await fetch("/api/resend-subscribers", {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch contacts");
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setContacts(data);
      } else {
        throw new Error("Received data is not an array");
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateContact = async (id: string, updateData: Partial<Contact>) => {
    try {
      const response = await fetch("/api/resend-contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          audienceId: process.env.NEXT_PUBLIC_RESEND_AUDIENCE_ID,
          ...updateData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update contact");
      }

      // Refresh the contact list
      await fetchContacts();
    } catch (error) {
      console.error("Error updating contact:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedContacts(
      event.target.checked ? contacts.map((contact) => contact.id) : []
    );
  };

  const handleSelectContact = (id: string) => {
    setSelectedContacts((prev) =>
      prev.includes(id)
        ? prev.filter((contactId) => contactId !== id)
        : [...prev, id]
    );
  };

  const handleUnsubscribe = async (id: string) => {
    await updateContact(id, { unsubscribed: true });
  };

  if (isLoading) {
    return (
      <Flex align="center" justify="center" height="fill">
        <Spinner muted />
        <Text size={2} muted>
          Loading contacts...
        </Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Text size={2} color="red">
        Error: {error}
      </Text>
    );
  }

  return (
    <Box padding={4}>
      <Card radius={2} shadow={1} padding={4}>
        <Flex align="center">
          <Checkbox
            checked={selectedContacts.length === contacts.length}
            onChange={handleSelectAll}
            aria-label="Select all contacts"
          />
          <Text size={2} weight="semibold" style={{ marginLeft: "12px" }}>
            Select All
          </Text>
        </Flex>
      </Card>
      {contacts.length > 0 ? (
        <Stack space={4} marginTop={4}>
          {contacts.map((contact) => (
            <Card key={contact.id} radius={2} shadow={1} padding={4}>
              <Flex align="center" justify="space-between">
                <Flex align="center">
                  <Checkbox
                    checked={selectedContacts.includes(contact.id)}
                    onChange={() => handleSelectContact(contact.id)}
                    aria-label={`Select ${contact.first_name} ${contact.last_name}`}
                  />
                  <Text size={2} style={{ marginLeft: "12px" }}>
                    {contact.first_name} {contact.last_name} ({contact.email})
                  </Text>
                </Flex>
                <Button
                  text="Unsubscribe"
                  tone="critical"
                  onClick={() => handleUnsubscribe(contact.id)}
                  size={2}
                />
              </Flex>
            </Card>
          ))}
        </Stack>
      ) : (
        <Text size={2} muted style={{ marginTop: "16px" }}>
          No contacts available
        </Text>
      )}
    </Box>
  );
};

export default ContactListSanity;
