import { defineField, defineType } from "sanity";

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
      type: "array",
      of: [{ type: "reference", to: [{ type: "contacts" }] }],
    }),
   
  ],
});
