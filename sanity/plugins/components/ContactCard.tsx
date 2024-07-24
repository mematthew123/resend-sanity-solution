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
      <Stack space={3}>
        <Flex justify="space-between">
          <Text size={2} weight="semibold">{contact.email}</Text>
    
        </Flex>
        {(contact.firstName || contact.lastName) && (
          <Text size={1} muted>
            {contact.firstName} {contact.lastName}
          </Text>
        )}
        <Flex align="center" justify="space-between">
          <Box>
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
            marginLeft={2}
          >
            {contact.unsubscribed ? "Unsubscribed" : "Subscribed"}
          </Badge>
          </Box>
          <Button
            text="Delete"
            tone="critical"
            onClick={() => onDelete(contact.id)}
            size={1}
          />
        </Flex>
      </Stack>
    </Card>
  );
};

export default ContactCard;
