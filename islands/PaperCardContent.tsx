import { useState } from "preact/hooks";

interface PaperCardContentProps {
  abstract: string;
}

export default function PaperCardContent({ abstract }: PaperCardContentProps) {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  return (
    <div class="mb-6">
      <p class={`text-gray-600 leading-relaxed ${expanded ? "" : "line-clamp-3"} mb-2`}>
        {abstract}
      </p>
      <button 
        onClick={toggleExpanded}
        class="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
      >
        {expanded ? "Read less" : "Read more"}
      </button>
    </div>
  );
}
