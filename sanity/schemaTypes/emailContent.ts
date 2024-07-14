import { defineField, defineType } from "sanity";

export default defineType({
  name: "emailContent",
  title: "Email Content",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "subject",
      title: "Subject",
      type: "string",
    }),

    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
    }),
   
  ],
});
