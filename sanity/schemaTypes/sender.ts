import { defineField, defineType } from "sanity";

export default defineType({
    name: "sender",
    title: "Sender",
    type: "document",
    fields: [
        defineField({
            name: "name",
            title: "Name ( This will appear in the email as the sender )",
            type: "string",
        }),
    ],
});