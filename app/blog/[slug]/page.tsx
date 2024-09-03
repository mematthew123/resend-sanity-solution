import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import { PortableText } from "@portabletext/react";
import { groq } from "next-sanity";
import Image from "next/image";

interface BlogPost {
  title: string;
  mainImage?: any;
  body: any;
  author?: {
    name: string;
  };
  categories?: {
    title: string;
  }[];
  publishedAt?: string;
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const query = groq`
    *[_type == "blogPost" && slug.current == $slug][0] {
      title,
      mainImage,
      body,
      "author": author->{name},
      "categories": categories[]->{title},
      publishedAt
    }
  `;
  return await client.fetch(query, { slug });
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      {post.mainImage && (
        <Image
          src={urlForImage(post.mainImage)}
          alt={post.title}
          width={800}
          height={400}
          className="w-full h-auto rounded-lg mb-8"
        />
      )}
      <div className="mb-8 text-sm text-gray-500">
        {post.author && <p>By {post.author.name}</p>}
        {post.publishedAt && (
          <p>
            Published on {new Date(post.publishedAt).toLocaleDateString()}
          </p>
        )}
        {post.categories && post.categories.length > 0 && (
          <p>
            Categories:{" "}
            {post.categories.map((cat) => cat.title).join(", ")}
          </p>
        )}
      </div>
      <div className="prose max-w-none">
        <PortableText value={post.body} />
      </div>
    </article>
  );
}