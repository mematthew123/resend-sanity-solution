import {
  definePlugin,
  DocumentActionComponent,
  useDocumentOperation,
  SanityDocument,
} from "sanity";

interface NewsLetterDocument extends SanityDocument {
  _type: "newsLetter";
  contacts?: string;
}

const PublishAndSendAction: DocumentActionComponent = (props) => {
  const { draft, published, id } = props;
  const { publish } = useDocumentOperation(id, props.type);

  if (!draft || draft._type !== "newsLetter") {
    return null;
  }

  const newsLetterDraft = draft as NewsLetterDocument;

  if (published) {
    return {
      label: "Already Published",
      disabled: true,
      tone: "default",
    };
  }

  return {
    label: "Send Newsletter",
    onHandle: async () => {
      publish.execute();

      await new Promise((resolve) => setTimeout(resolve, 1000));

      let selectedContacts: string[] = [];
      try {
        selectedContacts = JSON.parse(newsLetterDraft.contacts || "[]");
      } catch (error) {
        console.error("Error parsing contacts:", error);
        props.onComplete();

        return;
      }

      if (!Array.isArray(selectedContacts)) {
        console.error("Selected contacts is not an array");
        props.onComplete();

        return;
      }

      console.log("Selected contacts for API:", selectedContacts);

      try {
        const response = await fetch(`/api/sendNewsletter`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SANITY_API_TOKEN}`,
          },
          body: JSON.stringify({
            documentId: id,
            selectedContacts: selectedContacts,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          console.error(`Error: ${result.message}`);
          props.onComplete();

          return;
        }
      } catch (error) {
        console.error("Fetch error:", error);
        props.onComplete();
      }
    },
    tone: "primary",
  };
};

export const publishAndSendPlugin = definePlugin({
  name: "publish-and-send",
  document: {
    actions: (prev, context) => {
      if (context.schemaType !== "newsLetter") {
        return prev;
      }

      return prev.map((action) =>
        action.action === "publish" ? PublishAndSendAction : action
      );
    },
  },
});
