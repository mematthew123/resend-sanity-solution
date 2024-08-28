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
import { contactManagerPlugin } from "./sanity/plugins/contactManagerPlugin";
import { EnvelopeIcon } from "@sanity/icons";
import { CheckmarkCircleIcon } from "@sanity/icons";
import { PresentationIcon } from "@sanity/icons";
import { DiamondIcon } from "@sanity/icons";
import { TextIcon } from "@sanity/icons";
import { HighlightIcon } from "@sanity/icons";
import {BoltIcon} from '@sanity/icons'


const structure = (S: any) =>
  S.list()
    .title("Content")
    .items([
      // Add the "Emails" folder with the specific document types
      S.documentTypeListItem("hero")
        .title("Hero Content")
        .icon(HighlightIcon),
      S.documentTypeListItem("form")
        .title("Form Content")
        .icon(TextIcon),
        S.documentTypeListItem("imageGallery")
        .title("Image Gallery")
        .icon(BoltIcon),
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
              S.documentTypeListItem("author")
                .title("Sender (Who is sending the email)")
                .icon(PresentationIcon),
            ])
        ),
      // Add other default items
      ...S.documentTypeListItems().filter(
        (listItem: { getId: () => string }) =>
          !["newsLetter", "emailSignUp", "author", "form", "hero","imageGallery"].includes(
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
    contactManagerPlugin(),
  ],
});
