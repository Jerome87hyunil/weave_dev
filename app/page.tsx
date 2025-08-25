'use client';

import WeaveAssistant from '@/components/WeaveAssistant';

export default function Home() {
  return (
    <WeaveAssistant
      // All tabs are enabled by default
      // Callbacks can be added as needed
      onDataExtracted={() => {
        // Handle extracted data if needed
      }}
      onDocumentGenerated={() => {
        // Handle generated document if needed
      }}
      onBusinessInfoFetched={() => {
        // Handle business info if needed
      }}
      onRequestSent={() => {
        // Handle document request if needed
      }}
    />
  );
}