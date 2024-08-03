import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import { PortableText } from "@portabletext/react";
import { groq } from "next-sanity";

export const revalidate = 1; // ISR revalidation interval

type ImageType = {
  _key: string;
  alt?: string;
  asset: {
    _ref: string;
  };
};

type Gallery = {
  title: string;
  description: any;
  images: ImageType[];
};

async function getImageGallery(): Promise<Gallery[]> {
  const query = groq`*[_type == "imageGallery"]{
    title,
    description,
    images[]{
      _key,
      alt,
      asset->
    }
  }`;
  return await client.fetch(query);
}

export default async function ImageGallery() {
  const galleryData = await getImageGallery();

  if (!galleryData || galleryData.length === 0) {
    return <div>No images available</div>;
  }

  const gallery = galleryData[0]; 

  return (
    <div className="bg-white py-24" id="about">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="container px-4 md:px-6">
          <div className="space-y-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
              {gallery.title}
            </h2>
            <div className="mx-auto max-w-[700px] mt-6 text-xl text-gray-900/80 md:text-xl lg:text-base xl:text-xl">
              <PortableText value={gallery.description} />
            </div>
          </div>
          <div className="grid mt-20 grid-cols-2 sm:grid-cols-3 gap-4">
            {gallery.images.map((image) => (
              <div key={image._key} className="relative h-60">
                <Image
                  src={urlForImage(image.asset as any)}
                  alt={image.alt || "Gallery image"}
                  className="object-center md:w-full md:h-full rounded-lg h-60 w-full"
                  width={400}
                  height={400}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
