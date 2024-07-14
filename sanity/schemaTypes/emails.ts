import { defineField, defineType } from "sanity";

export default defineType({
  name: "emailSignUp",
  title: "Transactional Email",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Internal Campaign Title (not visible to users)",
      type: "string",
    }),

    defineField({
      name: "emailDetails",
      title: "Body",
      type: "emailContent", // Reference the emailContent schema here
    }),
  ],
});
