import { defineField, defineType } from "sanity";
import { HighlightIcon } from "@sanity/icons";

export default defineType({
  name: "hero",
  title: "Hero",
  type: "document",
  icon: HighlightIcon,

  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
  ],
});
