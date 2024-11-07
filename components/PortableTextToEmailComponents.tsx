// components/PortableTextToEmailComponents.tsx
import * as React from "react";
import { PortableTextBlock } from "@portabletext/types";
import {
  Text,
  Img,
  Link,
  Button,
  Section,
  Heading,
  Column,
  Row,
} from "@react-email/components";
import { urlForImage } from "@/sanity/lib/image";

const renderProductGrid = (block: any, blockIndex: number) => {
  if (!block.products || block.products.length === 0) {
    return <Text key={blockIndex}>No products to display</Text>;
  }

  // Limit to 3 products
  const products = block.products.slice(0, 3);

  return (
    <Section key={blockIndex} style={{ margin: "16px 0" }}>
      <Row style={{ width: "100%", textAlign: "center" }}>
        {products.map((product: any, index: number) => {
          const { title, price, slug, images } = product;
          const imageUrl =
            images && images.length > 0 && images[0].asset
              ? images[0].asset.url
              : null;

          return (
            <Column
              key={index}
              style={{
                display: "inline-block",
                verticalAlign: "top",
                width: "33%",
                maxWidth: "33%",
                padding: "0 4px",
                boxSizing: "border-box",
              }}
            >
              {imageUrl && (
                <Img
                  alt={title}
                  src={imageUrl}
                  width="100%"
                  style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                />
              )}
              <Heading
                style={{
                  margin: "24px 0 0",
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#111827",
                  lineHeight: "28px",
                }}
              >
                {title}
              </Heading>
              {/* Optional description can be added here */}
              <Text
                style={{
                  margin: "8px 0 0",
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#111827",
                  lineHeight: "24px",
                }}
              >
                ${price}
              </Text>
              <Button
                style={{
                  marginTop: "16px",
                  borderRadius: "8px",
                  backgroundColor: "#4F46E5",
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  textDecoration: "none",
                  display: "inline-block",
                  padding: "12px 24px",
                }}
                href={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/products/${slug?.current}`}
              >
                View Product
              </Button>
            </Column>
          );
        })}
      </Row>
    </Section>
  );
};

const renderProductReference = (block: any, blockIndex: number) => {
  if (!block.product) {
    return <Text key={blockIndex}>Product reference (no data)</Text>;
  }

  const { title, price, slug, images } = block.product;
  const imageUrl = images && images.length > 0 ? urlForImage(images[0]) : null;

  return (
    <Section
      key={blockIndex}
      style={{ margin: "20px 0", padding: "10px", border: "1px solid #ccc" }}
    >
      {imageUrl && (
        <Img
          src={imageUrl}
          alt={title}
          width={600}
          height={400}
          style={{ width: "100%", height: "auto", objectFit: "cover" }}
        />
      )}
      <Heading
        style={{ fontSize: "18px", fontWeight: "bold", marginTop: "10px" }}
      >
        {title}
      </Heading>
      <Text style={{ fontSize: "16px", color: "#666" }}>Price: ${price}</Text>
      <Link
        href={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/products/${slug?.current}`}
        style={{
          color: "#007291",
          textDecoration: "underline",
          marginTop: "10px",
          display: "inline-block",
        }}
      >
        View Product
      </Link>
    </Section>
  );
};

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
    className={`rounded px-4 py-2 ${block.style === "primary" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
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
      <div className="mb-4 ml-4">
        {items.map((item, index) => (
          <div key={index}>• {item}</div>
        ))}
      </div>
    );
  } else {
    if (type === "number") {
      return (
        <Text className="mb-4 ml-4">
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
    <Text className="mb-4 ml-4">
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
    width={800}
    height={800}
    className="my-4 h-auto w-full max-w-lg rounded-lg object-center"
  />
);

const renderCustomImageGrid = (block: any, blockIndex: number) => {
  const images = block.images || [];
  const rows = Math.ceil(images.length / 2);

  return (
    <Section key={blockIndex} className="my-4 bg-orange-200 rounded-lg">
      <table className="border-sky-600 border-2 gap-2 rounded-lg">
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {images
                .slice(rowIndex * 2, rowIndex * 2 + 2)
                .map((image: any, colIndex: number) => (
                  <td key={rowIndex * 2 + colIndex} className="p-2 w-1/2">
                    <Img
                      src={urlForImage(image)}
                      alt={
                        image.alt || `Grid image ${rowIndex * 2 + colIndex + 1}`
                      }
                      width="100%"
                      height="auto"
                      className="rounded-lg object-cover w-full h-auto"
                    />
                  </td>
                ))}
              {rowIndex * 2 + 1 >= images.length && (
                <td className="p-2 w-1/2"></td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
};

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

const renderBlogPostReference = (block: any, blockIndex: number) => {
  if (!block.post) {
    return <Text key={blockIndex}>Blog post reference (no data)</Text>;
  }

  const { title, slug, mainImage, _createdAt, body } = block.post;
  const imageUrl = mainImage?.asset?.url;
  const excerpt = body?.[0]?.children?.[0]?.text?.substring(0, 150) + "...";

  return (
    <Section
      key={blockIndex}
      style={{ margin: "20px 0", padding: "10px", border: "1px solid #ccc" }}
    >
      {imageUrl && (
        <Img
          src={imageUrl}
          alt={mainImage.alt || title}
          width={600}
          height={400}
          style={{ width: "100%", height: "auto", objectFit: "cover" }}
        />
      )}
      <Text style={{ fontSize: "18px", fontWeight: "bold" }}>
        {title || "Untitled"}
      </Text>
      <Text style={{ fontSize: "14px", color: "#666" }}>
        {_createdAt
          ? new Date(_createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : ""}
      </Text>
      {excerpt && (
        <Text style={{ fontSize: "16px", color: "#444", marginTop: "10px" }}>
          {excerpt}
        </Text>
      )}
      <Link
        href={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/blog/${slug?.current}`}
        style={{
          color: "#007291",
          textDecoration: "underline",
          marginTop: "10px",
          display: "inline-block",
        }}
      >
        Read more
      </Link>
    </Section>
  );
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
    } else if (block._type === "customImageGrid") {
      flushList();
      result.push(renderCustomImageGrid(block, blockIndex));
    } else if (block._type === "button") {
      flushList();
      result.push(renderButton(block, blockIndex));
    } else if (block._type === "blogPostReference") {
      flushList();
      result.push(renderBlogPostReference(block, blockIndex));
    } else if (block._type === "productReference") {
      flushList();
      result.push(renderProductReference(block, blockIndex));
    } else if (block._type === "productGrid") {
      flushList();
      result.push(renderProductGrid(block, blockIndex));
    }
  });

  flushList();
  return result;
};
