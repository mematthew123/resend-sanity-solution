import { type SchemaTypeDefinition } from "sanity";
import blockContent from "./schemaTypes/blockContent";
import emailContent from "./schemaTypes/emailContent";
import emails from "./schemaTypes/emails";
import newsLetter from "./schemaTypes/newsLetter";
import author from "./schemaTypes/author";
import imageGrid from "./schemaTypes/imageGrid";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContent, emailContent, emails,newsLetter,author,imageGrid],
};
