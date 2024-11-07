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
import { contactManagerPlugin } from "./sanity/plugins/resendContactManagerPlugin";
import { structure } from "@/sanity/structure";

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
