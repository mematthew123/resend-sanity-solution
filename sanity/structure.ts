import {
  TagIcon,
  EarthGlobeIcon,
  CreditCardIcon,
  DoubleChevronRightIcon,
  ChevronRightIcon,
  UsersIcon,
  BookIcon,
  HighlightIcon,
  BoltIcon,
  DiamondIcon,
  CheckmarkCircleIcon,
  PresentationIcon,
  TextIcon,
  EnvelopeIcon,
} from "@sanity/icons";

const structure = (S: any) =>
  S.list()
    .title("Content")
    .items([
      // This is our website structure for the hero section of the website
      S.listItem()
        .title("Website")
        .icon(EarthGlobeIcon)
        .child(
          S.list()
            .title("Website")
            .items([
              S.documentTypeListItem("hero").title("Hero").icon(HighlightIcon),
              S.documentTypeListItem("imageGrid")
                .title("Image Grid")
                .icon(HighlightIcon),
            ])
        ),
      S.listItem()
        .title("Emails")
        .icon(EnvelopeIcon)
        .child(
          S.list()
            .title("Emails")
            .items([
              S.documentTypeListItem("newsLetter")
                .title("Newsletter (Marketing Email)")
                .icon(DiamondIcon),
              S.documentTypeListItem("emailSignUp")
                .title("Email Sign Up (Transactional Email)")
                .icon(CheckmarkCircleIcon),
              S.documentTypeListItem("sender")
                .title("Sender (Who is sending the email)")
                .icon(PresentationIcon),
            ])
        ),

      // Blog Folder
      S.listItem()
        .title("Blog")
        .icon(BookIcon)
        .child(
          S.list()
            .title("Blog")
            .items([
              S.documentTypeListItem("post").title("Blog Posts").icon(TextIcon),
              S.documentTypeListItem("author").title("Authors").icon(UsersIcon),
              S.documentTypeListItem("category")
                .title("Categories")
                .icon(TagIcon),
            ])
        ),

      // Product Folder
      S.listItem()
        .title("Products")
        .icon(CreditCardIcon)
        .child(
          S.list()
            .title("Products")
            .items([
              S.documentTypeListItem("product")
                .title("Products")
                .icon(DoubleChevronRightIcon),
              S.documentTypeListItem("productType")
                .title("Product Types")
                .icon(ChevronRightIcon),
              S.documentTypeListItem("featured")
                .title("Featured Products")
                .icon(BoltIcon),
            ])
        ),

      // Add other default items
      ...S.documentTypeListItems().filter(
        (listItem: { getId: () => string }) =>
          ![
            "newsLetter",
            "emailSignUp",
            "sender",
            "post",
            "author",
            "category",
            "product",
            "featured",
            "productType",
            "hero",
          ].includes(listItem.getId() as string)
      ),
    ]);


export { structure };