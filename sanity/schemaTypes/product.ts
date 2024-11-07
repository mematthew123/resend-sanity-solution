import { defineField, defineType } from "sanity";

export default defineType({
  name: "product",
  title: "Products",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    }),


    defineField({
      name: "productType",
      title: "Product Type",
      type: "array",
      of: [{ type: "reference", to: { type: "productType" } }],
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: Rule => Rule.min(0).error('Price cannot be negative'),
    }),
    defineField({
      name: "size",
      title: "Size",
      type: "string",
    }),

    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
    }),

    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
          type: "image",
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative Text",
            },
          ],
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: "title",
      media: "images[0]",
    },
  },
});
