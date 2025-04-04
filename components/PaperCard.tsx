// components/PaperCard.tsx
import PaperCardContent from "../islands/PaperCardContent.tsx";
import { JSX } from "preact";

interface PaperCardProps {
  title: string;
  abstract: string;
  filename: string;
  link: string;
  linkLabel: string;
  backgroundColor: string;
  year: number;
  journal: string;
}

export default function PaperCard({
  title,
  abstract,
  filename,
  link,
  linkLabel,
  backgroundColor,
  year,
  journal
}: PaperCardProps) {
  return (
    <div 
      class="group relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white"
      style={{ 
        backgroundColor: `${backgroundColor}20`, // Add slight transparency
        borderTop: `4px solid ${backgroundColor}`
      }}
    >
      <div class="p-6 md:p-8 relative z-10">
        <div class="absolute top-0 right-0 m-4 opacity-50 group-hover:opacity-70 transition-opacity">
          <span class="text-3xl font-bold text-gray-300">{year}</span>
        </div>
        
        <h2 class="text-2xl font-extrabold text-gray-900 mb-4 leading-tight group-hover:text-indigo-800 transition-colors">
          {title}
        </h2>
        
        <div class="mb-4 space-y-2 text-gray-600">
          <div class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 4v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span class="font-semibold">{journal}</span>
          </div>
        </div>
        
        <PaperCardContent abstract={abstract} />
        
        <div class="flex flex-wrap gap-4 justify-between items-center">
          <div class="flex space-x-3 w-full">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              class="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {linkLabel}
            </a>

            <a
              href={`/${filename}`}
              target="_blank"
              rel="noopener noreferrer"
              class="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Download PDF
            </a>

            <a
              href={`/doc-chat/${filename}`}
              class="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Chat
            </a>
          </div>
        </div>
      </div>
      
      {/* Subtle background effect */}
      <div 
        class="absolute inset-0 bg-gradient-to-br from-transparent to-gray-100 opacity-0 group-hover:opacity-20 transition-opacity duration-300 z-0"
      ></div>
    </div>
  );
}