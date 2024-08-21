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
  const [audienceName, setAudienceName] = useState<string | null>(null);

  const fetchContactsAndAudience = async () => {
    setIsLoading(true);
    try {
      const contactsResponse = await fetch("/api/resend-contacts", { cache: "no-store" });
      if (!contactsResponse.ok) {
        throw new Error("Failed to fetch contacts");
      }
      const contactsData = await contactsResponse.json();
      const filteredContacts = contactsData.filter((contact: Contact) => !contact.unsubscribed);
      console.log("Contacts Data:", filteredContacts);

      const audienceResponse = await fetch("/api/audiences", { cache: "no-store" });
      if (!audienceResponse.ok) {
        throw new Error("Failed to fetch audience data");
      }
      const audienceData = await audienceResponse.json();
      console.log("Audience Data:", audienceData);

      if (!Array.isArray(audienceData.data)) {
        throw new Error("Received audience data is not an array");
      }

      const audienceName = audienceData.data.length > 0 ? audienceData.data[0].name : "Unknown Audience";
      console.log("Selected Audience Name:", audienceName);

      setContacts(filteredContacts);
      setAudienceName(audienceName);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContactsAndAudience();
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

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedContacts(
      event.target.checked ? contacts.map((contact) => contact.id) : []
    );
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

  console.log("Contacts:", contacts);

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
            {audienceName} ({contacts.length} contacts)
          </Text>
        </Flex>
      </Card>
    </Box>
  );
};

export default ContactListSanity;