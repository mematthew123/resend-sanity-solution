export interface Post {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  title: string;
  mainImage?: {
    _type: "image";
    alt?: string;
    asset: {
      _ref: string;
      _type: "reference";
    };
  };
  author?: {
    _ref: string;
    _type: "reference";
    name: string;
    image?: {
      asset: {
        _ref: string;
        _type: "reference";
      };
    };
  };
  categories: Array<{
    _id: string;
    title: string;
  }>;
  slug: {
    _type: "slug";
    current: string;
  };
  body: any[];
  excerpt?: string;
}

export interface EmailSignUp {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  title: string;
  emailSubject: string;
  emailPreview: string;
  emailBody: any[];
  sender: string;
}

export interface Newsletter {
  _type: string;
  _id: string;
  sender: string;
  emailBody: any[];
  title: string;
  emailDetails: {
    preview: string;
  };
}
