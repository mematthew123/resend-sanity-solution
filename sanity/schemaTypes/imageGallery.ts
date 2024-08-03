import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'imageGallery',
  title: 'Image Gallery',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          title: 'Image',
          options: {
            hotspot: true,  // Enables the hotspot functionality
          },
          fields: [
            {
              name: 'alt',
              title: 'Alternative Text',
              type: 'string',
              options: {
                isHighlighted: true  // Makes this field easily accessible in the studio
              }
            }
          ]
        }
      ],
      options: {
        layout: 'grid'  // Optional: Define the layout in the studio
      }
    }),
  ],
});