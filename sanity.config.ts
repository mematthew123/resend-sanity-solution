"use client";

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schema } from "./sanity/schema";
import { publishAndSendPlugin } from "./sanity/lib/publishAndSendPlugin";
import { contactManagerPlugin } from "./sanity/plugins/ContactManagerPlugin";

const structure = (S: any) =>
  S.list()
    .title("Content")
    .items([
      // Add the "Emails" folder with the specific document types
      S.listItem()
        .title("Emails")
        .child(
          S.list()
            .title("Emails")
            .items([
              S.documentTypeListItem("newsLetter").title("Newsletter (Marketing Email)"),
              S.documentTypeListItem("emailSignUp").title("Email Sign Up (Transactional Email)"),
            ])
        ),
      // Add other default items
      ...S.documentTypeListItems().filter(
        (listItem: { getId: () => string }) =>
          !["newsLetter", "emailSignUp", "contacts"].includes(listItem.getId())
      ),
    ]);

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schema' folder
  schema,
  scheduledPublishing: {
    enabled: false, 
  },
  plugins: [
    structureTool({ structure }),
    // Vision is a tool that lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
    publishAndSendPlugin(),
    contactManagerPlugin(),
  ],
});
