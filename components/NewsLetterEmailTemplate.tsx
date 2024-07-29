// app/components/EmailTemplate.tsx
import * as React from "react";
import {
  Body,
  Head,
  Html,
  Preview,
  Tailwind,
  Link,
} from "@react-email/components";
import { PortableTextBlock } from "@portabletext/types";
import { PortableTextToEmailComponents } from "./PortableTextToEmailComponents";

interface NewsLetterEmailTemplateProps {
  preview: string;
  subject: string;
  content: PortableTextBlock[];
  recipientId: string;
  unsubscribeUrl: string;
}

export const NewsLetterEmailTemplate: React.FC<Readonly<NewsLetterEmailTemplateProps>> = ({
  preview,
  subject,
  content,
  recipientId,
}) => {
  const emailComponents = PortableTextToEmailComponents(content);
  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/unsubscribe?id=${recipientId}`;

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#007291",
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
        <Body className="bg-accent">
          <div className="bg-white mx-auto p-6 shadow-md rounded-lg">
            <div className="text-center border-b pb-4 mb-4">
              <h1 className="text-4xl font-bold text-brand">{subject}</h1>
            </div>
            <div className="text-lg font-normal text-justify leading-relaxed">
              {emailComponents}
            </div>
            <div className="border-t mt-8 pt-4 text-center">
              <Link
                href={unsubscribeUrl}
                className="text-sm text-gray-500 hover:underline"
              >
                Unsubscribe from these emails
              </Link>
            </div>
          </div>
        </Body>
      </Tailwind>
    </Html>
  );
};
