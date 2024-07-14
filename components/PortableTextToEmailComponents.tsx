import * as React from "react";
import { PortableTextBlock } from "@portabletext/types";
import { Text, Img, Link, Button } from "@react-email/components";
import { urlForImage } from "@/sanity/lib/image";

const renderTextWithMarks = (child: any, childIndex: number) => {
  let textElement = child.text;

  if (child.marks.includes("strong")) {
    textElement = <strong key={childIndex}>{textElement}</strong>;
  }
  if (child.marks.includes("em")) {
    textElement = <em key={childIndex}>{textElement}</em>;
  }
  if (child.marks.some((mark: any) => mark._type === "link")) {
    const link = child.markDefs?.find(
      (def: any) =>
        def._key === child.marks.find((mark: any) => mark._type === "link")
    );
    textElement = (
      <Link
        key={childIndex}
        href={link?.href as string}
        className="text-brand underline"
      >
        {textElement}
      </Link>
    );
  }

  return textElement;
};

const renderButton = (block: any, blockIndex: number) => (
  <Button
    key={blockIndex}
    href={block.link}
    className={`px-4 py-2 rounded ${block.style === "primary" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
  >
    {block.label}
  </Button>
);

const renderTextBlock = (block: any, blockIndex: number) => {
  const styleClassMap = {
    normal: "text-lg font-normal mb-4",
    h1: "text-3xl font-bold mb-4",
    h2: "text-2xl font-bold mb-3",
    h3: "text-xl font-bold mb-2",
  };

  const className =
    styleClassMap[block.style as keyof typeof styleClassMap] ||
    styleClassMap.normal;
  const textContent = block.children.map(renderTextWithMarks);

  return (
    <Text key={blockIndex} className={className}>
      {textContent}
    </Text>
  );
};

const renderList = (items: React.ReactNode[], type: "bullet" | "number") => {
  if (type === "bullet") {
    return (
      <div className="ml-4 mb-4">
        {items.map((item, index) => (
          <div key={index}>• {item}</div>
        ))}
      </div>
    );
  } else {
    if (type === "number") {
      return (
        <Text className="ml-4 mb-4">
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {index + 1}. {item}
              {index < items.length - 1 && <br />}
            </React.Fragment>
          ))}
        </Text>
      );
    }
  }

  return (
    <Text className="ml-4 mb-4">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index + 1}. {item}
          {index < items.length - 1 && <br />}
        </React.Fragment>
      ))}
    </Text>
  );
};

const renderImage = (block: any, blockIndex: number) => (
  <Img
    key={blockIndex}
    src={urlForImage(block)}
    alt="alt text"
    width={600}
    height={600}
    className="my-4 h-60 w-60 aspect-auto rounded-lg"
  />
);

export const PortableTextToEmailComponents = (
  blocks: PortableTextBlock[]
): React.ReactNode[] => {
  const result: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];
  let currentListType: "bullet" | "number" | null = null;

  const flushList = () => {
    if (currentList.length > 0) {
      result.push(renderList(currentList, currentListType!));
      currentList = [];
      currentListType = null;
    }
  };

  blocks.forEach((block: any, blockIndex) => {
    if (block._type === "block") {
      if (block.listItem) {
        if (currentListType !== block.listItem) {
          flushList();
          currentListType = block.listItem as "bullet" | "number";
        }
        currentList.push(block.children.map(renderTextWithMarks));
      } else {
        flushList();
        result.push(renderTextBlock(block, blockIndex));
      }
    } else if (block._type === "image") {
      flushList();
      result.push(renderImage(block, blockIndex));
    } else if (block._type === "button") {
      flushList();
      result.push(renderButton(block, blockIndex));
    }
  });

  flushList();
  return result;
};
