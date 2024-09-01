import { type SchemaTypeDefinition } from "sanity";
import blockContent from "./schemaTypes/blockContent";
import emailContent from "./schemaTypes/emailContent";
import emails from "./schemaTypes/emails";
import newsLetter from "./schemaTypes/newsLetter";
import sender from "./schemaTypes/sender"
import imageGrid from "./schemaTypes/imageGrid";
import author from "./schemaTypes/author";
import blogPost from "./schemaTypes/blogPost";
import category from "./schemaTypes/category";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContent, emailContent, emails,newsLetter,sender,imageGrid,category,author,blogPost],
};
