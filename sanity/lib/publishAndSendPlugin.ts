import { definePlugin, DocumentActionComponent, useDocumentOperation } from 'sanity'

const PublishAndSendAction: DocumentActionComponent = (props) => {
  const { draft, published, id } = props;
  const { publish } = useDocumentOperation(id, props.type);

  if (!draft || draft._type !== 'newsLetter') {
    return null;
  }

  return {
    label: 'Let it Rip!',
    onHandle: async () => {
      if (!published) {
        publish.execute();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const selectedContacts = JSON.parse(draft.selectedContacts as string || '[]');

      console.log('Selected contacts for API:', selectedContacts); // Debug log

      try {
        const response = await fetch(`/api/sendNewsletter`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SANITY_API_TOKEN}`,
          },
          body: JSON.stringify({ 
            documentId: id,
            selectedContacts: selectedContacts
          })
        });

        const result = await response.json();

        if (!response.ok) {
          console.error(`Error: ${result.message}`);
          return {
            message: `Error: ${result.message}`,
            tone: 'critical',
          }
        }

        return {
          message: result.message,
          tone: 'positive',
        }
      } catch (error) {
        console.error('Fetch error:', error);
        return {
          message: `Error: Failed to send newsletter`,
          tone: 'critical',
        }
      } finally {
        props.onComplete();
      }
    },
    tone: 'primary',
  }
};



export const publishAndSendPlugin = definePlugin({
  name: 'publish-and-send',
  document: {
    actions: (prev, context) => {
      if (context.schemaType !== 'newsLetter') {
        return prev
      }

      return prev.map(action => 
        action.action === 'publish' ? PublishAndSendAction : action
      )
    },
  },
})