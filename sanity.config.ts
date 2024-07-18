'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './sanity/env'
import {schema} from './sanity/schema'
import {publishAndSendPlugin} from './sanity/lib/publishAndSendPlugin'




const structure = (S: any) =>
  S.list()
    .title('Content')
    .items([
      // Add the "Emails" folder with the specific document types
      S.listItem()
        .title('Emails')
        .child(
          S.list()
            .title('Emails')
            .items([
              S.documentTypeListItem('newsletter').title('Newsletter'),
              S.documentTypeListItem('emailSignUp').title('Email Sign Up'),
              S.documentTypeListItem('contacts').title('Contacts'),
            ])
        ),
      // Add other default items
      ...S.documentTypeListItems().filter(
        (listItem: { getId: () => string }) =>
          !['newsLetter', 'emailSignUp', 'contacts'].includes(listItem.getId())
      ),
    ]);



export default defineConfig({
  
  basePath: '/studio',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schema' folder
  schema,
  plugins: [
    structureTool({ structure }), 
    // Vision is a tool that lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
    publishAndSendPlugin(),
  ],
  cors: {
    origin: ['http://localhost:3000', 'https://your-nextjs-app-url.com'],
    credentials: true,
  },
})
