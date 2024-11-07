import React, { useState, useEffect } from "react";
import {
  Stack,
  Card,
  Text,
  Button,
  TextInput,
  Box,
  Select,
  Checkbox,
  Flex,
} from "@sanity/ui";
import { definePlugin } from "sanity";
import ContactCard from "./components/ContactCard";
import { useDebounce } from "use-debounce";

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

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const [filterStatus, setFilterStatus] = useState<
    "all" | "subscribed" | "unsubscribed"
  >("all");

  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  useEffect(() => {
    fetchContacts();
  }, [debouncedSearchTerm, filterStatus]);

  const fetchContacts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (debouncedSearchTerm) {
        queryParams.append("search", debouncedSearchTerm);
      }
      if (filterStatus !== "all") {
        queryParams.append("status", filterStatus);
      }
      const response = await fetch(
        `/api/resend-contacts?${queryParams.toString()}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch contacts");
      }
      const data = await response.json();
      setContacts(data);
      // Reset selected contacts when contacts change
      setSelectedContacts([]);
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
        method: "PUT",
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

  const toggleContactSelection = (id: string) => {
    setSelectedContacts((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((contactId) => contactId !== id)
        : [...prevSelected, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      // Unselect all
      setSelectedContacts([]);
    } else {
      // Select all
      setSelectedContacts(contacts.map((contact) => contact.id));
    }
  };

  const bulkDeleteContacts = async () => {
    if (selectedContacts.length === 0) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/resend-contacts`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedContacts }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete contacts");
      }
      setSelectedContacts([]);
      await fetchContacts();
    } catch (err) {
      setError("Failed to delete contacts");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const bulkUpdateContacts = async (data: Partial<Contact>) => {
    if (selectedContacts.length === 0) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/resend-contacts", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: selectedContacts,
          ...data,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update contacts");
      }
      setSelectedContacts([]);
      await fetchContacts();
    } catch (err) {
      setError("Failed to update contacts");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card padding={5} shadow={2}>
      <Stack space={5}>
        <Text size={4} weight="bold">
          Contact Manager
        </Text>

        {error && (
          <Text size={3} weight="bold" >
            {error}
          </Text>
        )}

        {/* Add Contact Form */}
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
            tone="primary"
            onClick={addContact}
            disabled={isLoading}
            fontSize={[2, 2, 3]}
          />
        </Stack>

        {/* Search and Filter */}
        <Box paddingY={4} style={{ borderTop: "1px solid #eaeaea" }}>
          <Flex align="center" justify="space-between">
            <TextInput
              placeholder="Search contacts"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.currentTarget.value)}
              padding={[2, 2, 3]}
            />
            <Select
              value={filterStatus}
              onChange={(event) =>
                setFilterStatus(event.currentTarget.value as
                  | "all"
                  | "subscribed"
                  | "unsubscribed")
              }
            >
              <option value="all">All</option>
              <option value="subscribed">Subscribed</option>
              <option value="unsubscribed">Unsubscribed</option>
            </Select>
          </Flex>
        </Box>

        {/* Bulk Actions */}
        {selectedContacts.length > 0 && (
          <Card padding={3} tone="caution">
            <Flex justify="space-between" align="center">
              <Text size={2}>
                {selectedContacts.length} contact
                {selectedContacts.length > 1 ? "s" : ""} selected
              </Text>
              <Flex gap={2}>
                <Button
                  text="Bulk Delete"
                  tone="critical"
                  onClick={bulkDeleteContacts}
                />
                <Button
                  text="Bulk Subscribe"
                  tone="positive"
                  onClick={() =>
                    bulkUpdateContacts({ unsubscribed: false })
                  }
                />
                <Button
                  text="Bulk Unsubscribe"
                  tone="critical"
                  onClick={() =>
                    bulkUpdateContacts({ unsubscribed: true })
                  }
                />
              </Flex>
            </Flex>
          </Card>
        )}

        {/* Contacts List */}
        {isLoading ? (
          <Text size={2} muted>
            Loading...
          </Text>
        ) : (
          <Stack space={4}>
            {/* Select All Checkbox */}
            <Flex align="center" gap={2}>
              <Checkbox
                checked={
                  selectedContacts.length === contacts.length &&
                  contacts.length > 0
                }
                onChange={toggleSelectAll}
              />
              <Text size={3}>Select All</Text>
            </Flex>

            {/* Individual Contacts */}
            {contacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                isSelected={selectedContacts.includes(contact.id)}
                toggleContactSelection={toggleContactSelection}
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

const contactManagerTool = () => {
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
