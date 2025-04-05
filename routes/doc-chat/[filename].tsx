// routes/doc-chat/[filename].tsx
import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import DocChatIsland from "../../islands/DocChat.tsx";

interface DocumentInfo {
  title: string;
  path: string;
  author?: string;
  year?: string;
  error?: string;
  isApiLimitError?: boolean;
}

export const handler: Handlers<DocumentInfo> = {
  async GET(req, ctx) {
    try {
      const filename = ctx.params.filename;
      
      if (!filename) {
        return ctx.render({ 
          title: "Document Not Found",
          path: "",
          error: "No document filename provided"
        });
      }
      
      // More robust file existence check
      const fileExists = await checkFileExists(filename);
      
      if (!fileExists) {
        return ctx.render({ 
          title: "Document Not Found",
          path: "",
          error: `The file "${filename}" was not found in the static directory`
        });
      }
      
      // Extract document info
      const documentInfo = getDocumentInfo(filename);
      
      return ctx.render(documentInfo);
    } catch (error) {
      console.error("Error in doc chat handler:", error);
      
      // Specific handling for 429 error
      if (error instanceof Error && error.message.includes('429')) {
        return ctx.render({ 
          title: "API Limit Reached",
          path: "",
          error: "You have run out of API credits. Please upgrade your plan or try again later.",
          isApiLimitError: true
        });
      }
      
      return ctx.render({ 
        title: "Error",
        path: "",
        error: `An error occurred: ${error.message}`
      });
    }
  },
};

async function checkFileExists(filename: string): Promise<boolean> {
  try {
    // In a server environment, you'd use fs.exists or similar
    // This is a placeholder - in a real implementation, actually check file system
    const validFiles = [
      "wood2022rapid.pdf",
      "wood2022automated.pdf", 
      "wood2025hook.pdf"
    ];
    
    return validFiles.includes(filename);
  } catch (e) {
    console.error(`Error checking file existence:`, e);
    return false;
  }
}

function getDocumentInfo(filename: string): DocumentInfo {
  // Expanded mapping of known documents with more metadata
  const knownDocuments: Record<string, DocumentInfo> = {
    "wood2022rapid.pdf": {
      title: "Rapid determination of bulk composition and quality of marine biomass in Mass Spectrometry",
      path: `./static/wood2022rapid.pdf`,
      author: "Jesse Wood",
      year: "2022"
    },
    "wood2022automated.pdf": {
      title: "Automated Fish Classification Using Unprocessed Fatty Acid Chromatographic Data",
      path: `./static/wood2022automated.pdf`,
      author: "Jesse Wood",
      year: "2022"
    },
    "wood2025hook.pdf": {
      title: "Hook, Line and Spectra: Machine Learning for Fish Species and Part Classification using Rapid Evaporative Ionization Mass Spectrometry",
      path: `./static/wood2025hook.pdf`,
      author: "Jesse Wood",
      year: "2025"
    }
  };
  
  // Return known document info or fallback to basic info from filename
  if (knownDocuments[filename]) {
    return knownDocuments[filename];
  } else {
    // Basic fallback for unknown documents
    const nameWithoutExt = filename.replace(/\.pdf$/i, "");
    const formattedName = nameWithoutExt
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    
    return {
      title: formattedName,
      path: `./static/${filename}`,
    };
  }
}

export default function DocChatPage({ data }: PageProps<DocumentInfo>) {
  const { title, path, author, year, error, isApiLimitError } = data;

  // Log the path to the console for debugging
  console.log("Document path:", path);
  
  if (error) {
    return (
      <>
        <Head>
          <title>{isApiLimitError ? "API Limit Reached" : "Document Error"} | Jesse Wood</title>
        </Head>
        
        <div class="min-h-screen bg-gray-50 py-12">
          <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              <div class={`p-6 ${isApiLimitError ? 'bg-yellow-50 text-yellow-800' : 'bg-red-50 text-red-800'}`}>
                <h1 class="text-2xl font-bold mb-4">
                  {isApiLimitError ? "API Limit Reached" : "Error"}
                </h1>
                <p>{error}</p>
                {isApiLimitError && (
                  <div class="mt-4">
                    <a href="/" class="inline-block bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition">
                      Return Home
                    </a>
                  </div>
                )}
              </div>
              <div class="p-6">
                <a href="/" class="text-indigo-600 hover:text-indigo-800">
                  Return Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Head>
        <title>Chat with Document | Jesse Wood</title>
        <meta name="description" content={`Chat with ${title} using AI`} />
      </Head>
      
      <div class="min-h-screen bg-gray-50">
        <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-5 bg-indigo-600 text-white">
              <div class="flex items-center gap-4">
                <div class="rounded-full bg-white/10 p-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                  </svg>
                </div>
                <div>
                  <h1 class="text-xl font-semibold">Chat with Document</h1>
                  <p class="text-indigo-100 text-sm truncate">Ask questions about this document using Gemini AI</p>
                </div>
              </div>
            </div>
            
            <DocChatIsland 
              documentTitle={title}
              documentPath={path}
              documentAuthor={author}
              documentYear={year}
            />
          </div>
        </main>
      </div>
    </>
  );
}