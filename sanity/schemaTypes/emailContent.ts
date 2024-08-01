import { defineField, defineType } from "sanity";

export default defineType({
  name: "emailContent",
  title: "Email Content",
  type: "object",
  fields: [

    defineField({
      name: "subject",
      title: "Subject",
      type: "string",
    }),
    defineField({
      name: "preview",
      title: "Preview",
      type: "string",
    }),

    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
    }),
    defineField({
      name:"author",
      title:"Author",
      type:"reference",
      to:[{type:"author"}]
    })
   
  ],
});
