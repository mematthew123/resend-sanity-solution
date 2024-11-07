import { groq } from "next-sanity";

export const postFields = groq`
  _id,
  _createdAt,
  _updatedAt,
  title,
  mainImage {
    alt,
    asset->
  },
  author->{
    _id,
    name,
    image {
      asset->
    }
  },
  categories[]->{
    _id,
    title
  },
  "excerpt": array::join(string::split(pt::text(body[_type == "block"][0...1]), "")[0..200], "") + "...",
  slug,
  body
`;

export const blogPostReferenceFields = groq`
  "post": @->{
    _id,
    _createdAt,
    _updatedAt,
    title,
    slug,
    mainImage {
      alt,
      asset->
    },
    body,
    author->{
      name
    },
    categories[]->{
      title
    }
  }
`;

export const productReferenceFields = groq`
  "product": @.product->{
    _id,
    title,
    price,
    slug,
    images
  }
`;

export const queries = {
  // Get all posts for the blog listing
  posts: groq`*[_type == "post"] | order(_createdAt desc) {
    ${postFields}
  }`,

  // Get a single post by slug
  postBySlug: groq`
    *[_type == "post" && slug.current == $slug][0] {
      ${postFields}
    }
  `,

  // Get email signup template
  emailSignUp: groq`
    *[_type == "emailSignUp"] | order(_updatedAt desc)[0]{
      _id,
      _createdAt,
      _updatedAt,
      title,
      "emailSubject": emailDetails.subject,
      "emailPreview": emailDetails.preview,
      "emailBody": emailDetails.body[]{
        ...,
        _type == "blogPostReference" => {
          ...,
          ${blogPostReferenceFields}
        },
        _type == "productReference" => {
          ...,
          ${productReferenceFields}
        },
        _type == "productGrid" => {
          ...,
          "products": products[]-> {
            _id,
            title,
            price,
            slug,
            images
          }
        }
      },
      "sender": emailDetails.sender->name,
    }
  `,

  // Get newsletter template
  newsletter: groq`
    *[_id == $id][0]{
      ...,
      "sender": emailDetails.sender->name,
      "emailBody": emailDetails.body[]{
        ...,
        _type == "blogPostReference" => {
          ...,
          ${blogPostReferenceFields}
        },
        _type == "productReference" => {
          ...,
          ${productReferenceFields}
        },
        _type == "productGrid" => {
          ...,
          "products": products[]-> {
            _id,
            title,
            price,
            slug,
            images
          }
        }
      }
    }
  `,
};
