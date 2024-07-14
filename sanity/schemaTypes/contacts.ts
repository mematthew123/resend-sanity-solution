import { defineField, defineType } from "sanity";

export default defineType({
  name: "contacts",
  title: "Contacts",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: 'subscribedAt',
      title: 'Subscribed At',
      type: 'datetime',
    }),
  ],
});
