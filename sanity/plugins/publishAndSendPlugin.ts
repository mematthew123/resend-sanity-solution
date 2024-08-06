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

  const handleSendNewsletter = async () => {
    try {
      publish.execute();
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const selectedContacts = parseContacts(newsLetterDraft.contacts);
      if (!Array.isArray(selectedContacts)) {
        throw new Error("Selected contacts is not an array");
      }

      console.log("Selected contacts for API:", selectedContacts);

      await sendNewsletter(id, selectedContacts);
    } catch (error) {
      console.error("Error in handleSendNewsletter:", error);
    } finally {
      props.onComplete();
    }
  };

  return {
    label: "Send Newsletter",
    onHandle: handleSendNewsletter,
    tone: "primary",
  };
};

const parseContacts = (contacts?: string): string[] => {
  try {
    return JSON.parse(contacts || "[]");
  } catch (error) {
    console.error("Error parsing contacts:", error);
    return [];
  }
};

const sendNewsletter = async (documentId: string, selectedContacts: string[]) => {
  if (!process.env.NEXT_PUBLIC_SANITY_API_TOKEN) {
    throw new Error("Missing API token");
  }

  const response = await fetch(`/api/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SANITY_API_TOKEN}`,
    },
    body: JSON.stringify({
      documentId,
      selectedContacts,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(`Error: ${result.message}`);
  }
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