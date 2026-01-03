import React from "react";

/**
 * Component that injects JSON‑LD script into the page.
 * Supports both 'data' and 'json' props for compatibility.
 */
export default function JsonLd({ data, json }) {
  const content = data || json;

  if (!content) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(content) }}
    />
  );
}
