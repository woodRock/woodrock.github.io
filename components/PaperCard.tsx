// components/PaperCard.tsx
import { Button } from "./Button.tsx";
import PaperCardContent from "../islands/PaperCardContent.tsx";

interface PaperCardProps {
  title: string;
  abstract: string;
  filename: string;
  link: string;
  linkLabel?: string;
  backgroundColor?: string;
  year?: number;
  journal?: string;
}

export default function PaperCard({
  title,
  abstract,
  filename,
  link,
  linkLabel = "Open Access",
  backgroundColor = "#E1CFE8",
  year,
  journal
}: PaperCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-[1.01] hover:shadow-xl">
      <div className={`h-2 bg-[${backgroundColor}]`}></div>
      <div className="p-6 md:p-8">
        {(year || journal) && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-700 mb-3 md:mb-0">
              {year && year} {year && journal && "•"} {journal && journal}
            </span>
          </div>
        )}
        
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">{title}</h2>
        
        {/* Abstract content with Read More functionality */}
        <PaperCardContent abstract={abstract} />
        
        <div className="flex flex-wrap gap-3">
          <a 
            href={`/download?filename=${filename}`}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </a>
          
          <a 
            target="_blank" 
            href={link}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            {linkLabel}
          </a>
        </div>
      </div>
    </div>
  );
}
