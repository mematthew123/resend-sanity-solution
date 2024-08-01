import { defineType } from "sanity";
import {TextIcon} from '@sanity/icons'

export default defineType({
  name: "form",
  title: "Form",
  type: "document",
  icon: TextIcon,
  fields: [
    {
      name: "heading",
      title: "Heading",
      type: "string",
    },
    {
        name:"subHeading",
        title:"Sub Heading",
        type:"string"
    }
  ],
});
