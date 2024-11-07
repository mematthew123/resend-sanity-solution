import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { urlForImage } from "@/sanity/lib/image";
import Link from "next/link";
import Image from "next/image";
import { queries } from "@/sanity/lib/queries";
import { Post } from "@/sanity/lib/types";

export default async function BlogSection() {
  const posts = await client.fetch<Post[]>(queries.posts);
  if (!posts?.length) {
    return (
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Blog
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              No posts available at the moment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            From the blog
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Read our latest articles
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post._id}
              className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80 group hover:scale-[1.02] transition-transform duration-200"
            >
              {post.mainImage && post.mainImage.asset && (
                <div className="absolute inset-0 -z-10">
                  <Image
                    src={urlForImage(post.mainImage)}
                    alt={post.mainImage.alt || post.title}
                    fill
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                </div>
              )}
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
              <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />

              <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
                <time dateTime={post._createdAt} className="mr-8">
                  {new Date(post._createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                {post.author && (
                  <div className="-ml-4 flex items-center gap-x-4">
                    <svg
                      viewBox="0 0 2 2"
                      className="-ml-0.5 h-0.5 w-0.5 flex-none fill-white/50"
                    >
                      <circle cx={1} cy={1} r={1} />
                    </svg>
                    <div className="flex gap-x-2.5 items-center">
                      {post.author.image && post.author.image.asset && (
                        <div className="relative h-6 w-6">
                          <Image
                            src={urlForImage(post.author.image)}
                            alt={post.author.name}
                            fill
                            className="rounded-full object-cover bg-white/10"
                            sizes="24px"
                          />
                        </div>
                      )}
                      <span key={`author-${post._id}`}>{post.author.name}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-3">
                <h3 className="text-lg font-semibold leading-6 text-white">
                  <Link href={`/blog/${post.slug.current}`}>
                    <span className="absolute inset-0" />
                    {post.title}
                  </Link>
                </h3>
                {post.categories && post.categories.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.categories.map((category) => (
                      <span
                        key={`${post._id}-${category._id}`}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-white/10 rounded-full"
                      >
                        {category.title}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Blog - Your Site Name",
  description:
    "Read our latest articles and stay up to date with our insights.",
};
