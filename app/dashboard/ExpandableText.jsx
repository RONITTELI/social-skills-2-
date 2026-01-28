import React, { useState } from "react";

export default function ExpandableText({ text, maxLength = 40 }) {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;
  if (text.length <= maxLength) return <div className="bg-gray-50 border rounded p-2 mt-1 text-xs text-gray-700">{text}</div>;
  return (
    <div className="bg-gray-50 border rounded p-2 mt-1 text-xs text-gray-700">
      {expanded ? text : text.slice(0, maxLength) + '...'}
      <button className="ml-2 text-blue-600 underline text-xs" onClick={() => setExpanded(e => !e)}>
        {expanded ? 'Show less' : 'Show more'}
      </button>
    </div>
  );
}
