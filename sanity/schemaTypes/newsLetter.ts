import { defineField, defineType } from "sanity";
import ContactListSanity from '@/sanity/components/ContactListSanity';
export default defineType({
  name: "newsLetter",
  title: "Newsletter",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "emailDetails",
      title: "Body",
      type: "emailContent", // Reference the emailContent schema here
    }),
    defineField({
      name: "contacts",
      title: "Contacts",
      type: "string",
      components: {
        input: ContactListSanity
      }
    }),
  ],
});