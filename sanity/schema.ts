import { type SchemaTypeDefinition } from "sanity";
import blockContent from "./schemaTypes/blockContent";
import emailContent from "./schemaTypes/emailContent";
import emails from "./schemaTypes/emails";
import newsLetter from "./schemaTypes/newsLetter";
import author from "./schemaTypes/author";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContent, emailContent, emails,newsLetter,author],
};
