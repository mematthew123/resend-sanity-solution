import React from "react";
import { Card, Stack, Text, Box, Switch,Button } from "@sanity/ui";
import { Contact } from "@/sanity/plugins/ContactManagerPlugin";

interface ContactCardProps {
  contact: Contact;
  onUpdate: (id: string, data: Partial<Contact>) => void;
  onDelete: (id: string) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, onUpdate, onDelete }) => {
  return (
    <Card padding={3} radius={2} shadow={1}>
      <Stack space={2}>
        <Text size={2}>{contact.email}</Text>
        {(contact.firstName || contact.lastName) && (
          <Text size={1} muted>
            {contact.firstName} {contact.lastName}
          </Text>
        )}
        <Box>
          <Switch
            checked={!contact.unsubscribed}
            onChange={() =>
              onUpdate(contact.id, {
                unsubscribed: !contact.unsubscribed,
              })
            }
          />
          <Text size={1}>
            {contact.unsubscribed ? "Unsubscribed" : "Subscribed"}
          </Text>
        </Box>
        <Button
          text="Delete"
          tone="critical"
          onClick={() => onDelete(contact.id)}
          size={1}
        />
      </Stack>
    </Card>
  );
};

export default ContactCard;