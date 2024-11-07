import { defineField, defineType } from "sanity";

export default defineType({
  name: "featured",
  title: "Featured Product",
  type: "document",
  fields: [
    defineField({
     name: "featuredProduct",
      title: "Featured Product",
      type: "reference",
      to: [{ type: "product" }],
    }),
  ],
});