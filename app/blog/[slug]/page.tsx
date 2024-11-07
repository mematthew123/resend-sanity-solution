import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import { queries } from "@/sanity/lib/queries";
import { Post } from "@/sanity/lib/types";
import { PortableText } from "@portabletext/react";
import Image from "next/image";

async function getBlogPost(slug: string): Promise<Post | null> {
  return await client.fetch(queries.postBySlug, { slug });
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold">Post not found</h1>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

      {post.mainImage && post.mainImage.asset && (
        <div className="relative w-full h-[400px] mb-8">
          <Image
            src={urlForImage(post.mainImage)}
            alt={post.mainImage.alt || post.title}
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>
      )}

      <div className="mb-8 text-sm text-gray-500 space-y-2">
        {post.author && (
          <p className="flex items-center gap-2">
            <span className="font-semibold">Author:</span> {post.author.name}
          </p>
        )}

        <p className="flex items-center gap-2">
          <span className="font-semibold">Published:</span>
          {new Date(post._createdAt).toLocaleDateString()}
        </p>

        {post.categories && post.categories.length > 0 && (
          <p className="flex items-center gap-2">
            <span className="font-semibold">Categories:</span>
            <span className="flex gap-2 flex-wrap">
              {post.categories.map((cat) => (
                <span
                  key={cat._id}
                  className="bg-gray-100 px-2 py-1 rounded-full text-sm"
                >
                  {cat.title}
                </span>
              ))}
            </span>
          </p>
        )}
      </div>

      <div className="prose prose-lg max-w-none">
        <PortableText
          value={post.body}
          components={{
            types: {
              image: ({ value }) => {
                if (!value?.asset) {
                  return null;
                }
                return (
                  <div className="relative w-full h-[400px] my-8">
                    <Image
                      src={urlForImage(value)}
                      alt={value.alt || "Blog post image"}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                );
              },
            },
          }}
        />
      </div>
    </article>
  );
}

// Enable dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.body?.[0]?.children?.[0]?.text?.substring(0, 160) || "",
    openGraph: {
      title: post.title,
      description: post.body?.[0]?.children?.[0]?.text?.substring(0, 160) || "",
      images: post.mainImage ? [urlForImage(post.mainImage)] : [],
    },
  };
}
