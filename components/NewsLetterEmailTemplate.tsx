// app/components/EmailTemplate.tsx
import * as React from "react";
import {
  Body,
  Head,
  Html,
  Preview,
  Tailwind,
  Link,
  Container,
  Heading,
  Hr,
  Section,
} from "@react-email/components";
import { PortableTextBlock } from "@portabletext/types";
import { PortableTextToEmailComponents } from "./PortableTextToEmailComponents";

interface NewsLetterEmailTemplateProps {
  preview: string;
  subject: string;
  content: any;
  recipientId: string;
  unsubscribeUrl: string;
  sender: string;
}
export const NewsLetterEmailTemplate = ({
  preview,
  subject,
  content,
  recipientId,
  unsubscribeUrl,
  sender,
}: {
  preview: string;
  subject: string;
  content: any;
  recipientId: string;
  unsubscribeUrl: string;
  sender: string;
}) => (
  <Html>
    <Head />
    <Preview>{preview}</Preview>
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: "#007291",
              brand2: "#000000",
              accent: "#f9f9f9",
              loud: "#333",
            },
            fontFamily: {
              sans: ["Helvetica", "Arial", "sans-serif"],
            },
          },
        },
      }}
    >
      <Body className="bg-accent font-sans">
        <Container className="mx-auto p-4 max-w-[600px]">
          <Section className="bg-white p-6 rounded-lg shadow-md">
            <Heading className="text-3xl font-bold text-brand text-center mb-6">
              {subject}
            </Heading>
            <div className="text-base text-loud mb-4">
              {PortableTextToEmailComponents(content)}
            </div>
            <Hr className="border-t border-gray-300 my-6" />
            <p className="text-sm text-gray-500 text-center">
              Sent by {sender}
            </p>
            <p className="text-sm text-gray-500 text-center mt-2">
              <Link
                href={unsubscribeUrl}
                className="text-brand hover:underline"
              >
                Unsubscribe
              </Link>
            </p>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
