import { defineType } from "sanity";

export default defineType({
  name: "productType",
  title: "Product Category",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "categoryImage",
      title: "Category Image",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "description",
      title: "Description",
      type: "text",
    },
  ],
});
