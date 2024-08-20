export default {
    name: 'imageGrid',
    title: 'Image Grid',
    type: 'object',
    fields: [
      {
        name: 'images',
        title: 'Images',
        type: 'array',
        of: [{ type: 'image' }],
        options: {
          layout: 'grid',
        },
      },
    ],
  }