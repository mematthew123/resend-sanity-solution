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
import { publishAndSendPlugin } from "./sanity/plugins/publishAndSendPlugin";
import { resendContactManagerPlugin } from "./sanity/plugins/resendContactManagerPlugin";
import { EnvelopeIcon } from "@sanity/icons";
import { CheckmarkCircleIcon } from "@sanity/icons";
import { PresentationIcon } from "@sanity/icons";
import { DiamondIcon } from "@sanity/icons";
import { TextIcon } from "@sanity/icons";
import { HighlightIcon } from "@sanity/icons";
import {BoltIcon} from '@sanity/icons';
import { BookIcon } from "@sanity/icons";
import { UsersIcon } from "@sanity/icons";
import { TagIcon } from "@sanity/icons";

const structure = (S: any) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Emails")
        .icon(EnvelopeIcon)
        .child(
          S.list()
            .title("Emails")
            .items([
              S.documentTypeListItem("newsLetter")
                .title("Newsletter (Marketing Email)")
                .icon(DiamondIcon),
              S.documentTypeListItem("emailSignUp")
                .title("Email Sign Up (Transactional Email)")
                .icon(CheckmarkCircleIcon),
              S.documentTypeListItem("sender")
                .title("Sender (Who is sending the email)")
                .icon(PresentationIcon),
            ])
        ),
      
  // Blog Folder
      S.listItem()
        .title("Blog")
        .icon(BookIcon)
        .child(
          S.list()
            .title("Blog")
            .items([
              S.documentTypeListItem("blogPost")
                .title("Blog Posts")
                .icon(TextIcon),
              S.documentTypeListItem("author")
                .title("Authors")
                .icon(UsersIcon),
              S.documentTypeListItem("category")
                .title("Categories")
                .icon(TagIcon),
            ])
        ),
      
      // Add other default items
      ...S.documentTypeListItems().filter(
        (listItem: { getId: () => string }) =>
          !["newsLetter", "emailSignUp", "sender", "blogPost", "author", "category"].includes(
            listItem.getId() as string
          )
      ),
    ]);

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  // Set to false to disable the scheduled publishing feature. To enable simply comment out.
  scheduledPublishing: {
    enabled: false,
  },
  plugins: [
    structureTool({ structure }),
    // Vision is a tool that lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
    publishAndSendPlugin(),
    resendContactManagerPlugin(),
    
  ],
});
