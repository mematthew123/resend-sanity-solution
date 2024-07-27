import * as React from "react";
import { Body, Head, Html, Preview, Tailwind } from "@react-email/components";
import { PortableTextBlock } from "@portabletext/types";
import { PortableTextToEmailComponents } from "./PortableTextToEmailComponents";

interface EmailTemplateProps {
  title: string;
  subject: string;
  content: PortableTextBlock[];
  preview: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  preview,
  subject,
  content,
}) => {
  const emailComponents = PortableTextToEmailComponents(content);

  return (
    <Html>
      <Head>
        <Preview>{preview}</Preview>
      </Head>
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
          </div>
        </Body>
      </Tailwind>
    </Html>
  );
};
