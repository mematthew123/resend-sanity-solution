import React from "react";
import { Card, Stack, Text, Box, Switch, Button, Flex, Badge } from "@sanity/ui";
import { Contact } from "@/sanity/plugins/ContactManagerPlugin";

interface ContactCardProps {
  contact: Contact;
  onUpdate: (id: string, data: Partial<Contact>) => void;
  onDelete: (id: string) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, onUpdate, onDelete }) => {
  return (
<Card padding={4} radius={3} shadow={2} style={{ border: '1px solid #eaeaea' }}>
  <Stack space={4}>
    <Flex justify="space-between" align="center">
      <Text size={3} weight="semibold">{contact.email}</Text>
    </Flex>
    {(contact.firstName || contact.lastName) && (
      <Text size={2} muted>
        {contact.firstName} {contact.lastName}
      </Text>
    )}
    <Flex align="center" justify="space-between">
      <Flex align="center">
        <Switch
          checked={!contact.unsubscribed}
          onChange={() =>
            onUpdate(contact.id, {
              unsubscribed: !contact.unsubscribed,
            })
          }
        />
        <Badge
          tone={contact.unsubscribed ? "critical" : "positive"}
          padding={2}
          style={{ marginLeft: '12px' }}
        >
          {contact.unsubscribed ? "Unsubscribed" : "Subscribed"}
        </Badge>
      </Flex>
      <Button
        text="Delete"
        tone="critical"
        onClick={() => onDelete(contact.id)}
        size={2}
      />
    </Flex>
  </Stack>
</Card>
  );
};

export default ContactCard;
