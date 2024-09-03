import { defineType, defineArrayMember } from 'sanity';

export default defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [{ title: 'Bullet', value: 'bullet' }],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
        ],
      },
    }),

    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
    }),
    
    defineArrayMember({
      title: 'Button',
      name: 'button',
      type: 'object',
      fields: [
        {
          title: 'Label',
          name: 'label',
          type: 'string',
        },
        {
          title: 'Link',
          name: 'link',
          type: 'url',
        },
        {
          title: 'Style',
          name: 'style',
          type: 'string',
          options: {
            list: [
              { title: 'Primary', value: 'primary' },
              { title: 'Secondary', value: 'secondary' },
            ],
          },
        },
      ],
    }),

    defineArrayMember({
      title: 'Custom Image Grid',
      name: 'customImageGrid',
      type: 'object',
      fields: [
        {
          name: 'images',
          type: 'array',
          of: [
            {
              type: 'image',
              options: { hotspot: true },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alternative Text',
                },
              ],
            },
          ],
          options: {
            layout: 'grid',
          },
        },
      ],
    }),

    defineArrayMember({
      title: 'Blog Post Reference',
      name: 'blogPostReference',
      type: 'reference',
      to: [{ type: 'blogPost' }],
    }),
  ],
});
