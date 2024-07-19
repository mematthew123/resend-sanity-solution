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
  title: string;
  subject: string;
  content: PortableTextBlock[];
  recipientId: string;
  unsubscribeUrl: string;
}

export const NewsLetterEmailTemplate: React.FC<Readonly<NewsLetterEmailTemplateProps>> = ({
  subject,
  content,
  recipientId,
}) => {
  const emailComponents = PortableTextToEmailComponents(content);
  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/unsubscribe?id=${recipientId}`;

  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#007291",
                accent: "#f9f9f9",
                loud: "#333",
              },
            },
          },
        }}
      >
        <Body className="bg-accent">
          <div className="p-4 my-2 items-center justify-center">
            <div className="text-4xl font-bold text-center mb-4">{subject}</div>
            <div className="text-lg font-normal text-justify">
              {emailComponents}
            </div>
            <div className="mt-8 text-center">
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