import {client} from "@/sanity/lib/client"
import { groq, PortableTextBlock } from "next-sanity"
import {urlForImage} from "@/sanity/lib/image"
import Link from "next/link"

type Post = {
    _id: string;
    title: string;
    excerpt: string;
    mainImage: {
        asset: {
            _ref: string;
            _type: 'reference';
        };
    } | null;
    name: string;
    authorImage: {
        asset: {
            _ref: string;
            _type: 'reference';
        };
    } | null;
    categories: string[];
    slug: string;
    publishedAt: string;
    body: PortableTextBlock[];
}

export default async function BlogSection () {
    const posts = await client.fetch(
        groq`*[_type == "blogPost"]{
            _id,
            title,
            excerpt,
            mainImage,
            "name": author->name,
            "authorImage": author->image,
            "categories": categories[]->title,
            "slug": slug.current,
            "publishedAt": publishedAt,
            
        }`
    )
    return (
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">From the blog</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Read our latest articles
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {posts.map((post: Post) => (
              <article
                key={post._id}
                className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80"
              >
                {post.mainImage && (
                  <img 
                    src={urlForImage(post.mainImage)}
                    alt="" 
                    className="absolute inset-0 -z-10 h-full w-full object-cover" 
                  />
                )}
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
                <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
  
                <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
                  <time dateTime={post.publishedAt} className="mr-8">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </time>
                  <div className="-ml-4 flex items-center gap-x-4">
                    <svg viewBox="0 0 2 2" className="-ml-0.5 h-0.5 w-0.5 flex-none fill-white/50">
                      <circle cx={1} cy={1} r={1} />
                    </svg>
                    <div className="flex gap-x-2.5">
                      {post.authorImage && (
                        <img 
                          src={urlForImage(post.authorImage)}
                          alt="" 
                          className="h-6 w-6 flex-none rounded-full bg-white/10" 
                        />
                      )}
                      {post.name}
                    </div>
                  </div>
                </div>
                <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
                  <Link href={`/blog/${post.slug}`}>
                    <span className="absolute inset-0" />
                    {post.title}
                  </Link>
                </h3>
              </article>
            ))}
          </div>
        </div>
      </div>
    )
  }
