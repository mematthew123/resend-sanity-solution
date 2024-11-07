import { type SchemaTypeDefinition } from "sanity";
import blockContent from "./schemaTypes/blockContent";
import emailContent from "./schemaTypes/emailContent";
import emails from "./schemaTypes/emails";
import newsLetter from "./schemaTypes/newsLetter";
import sender from "./schemaTypes/sender"
import imageGrid from "./schemaTypes/imageGrid";
import author from "./schemaTypes/author";
import category from "./schemaTypes/category";
import productType from "./schemaTypes/productType";
import product from "./schemaTypes/product";
import featured from "./schemaTypes/featured";
import hero from "./schemaTypes/hero";
import post from "./schemaTypes/post";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContent, emailContent, emails,newsLetter,sender,imageGrid,category,author,post,product,productType,featured,hero],
};
