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

  if (error) {
    return (
      <>
        <Head>
          <title>{isApiLimitError ? "API Limit Reached" : "Document Error"} | Jesse Wood</title>
        </Head>
        
        <div class="min-h-screen bg-zinc-950 py-20 px-6 sm:px-8">
          <div class="max-w-3xl mx-auto">
            <div class="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-sm">
              <div class={`p-10 ${isApiLimitError ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'}`}>
                <h1 class="text-3xl font-black mb-6 tracking-tighter">
                  {isApiLimitError ? "API Limit Reached" : "Error Occurred"}
                </h1>
                <p class="text-lg font-light leading-relaxed">{error}</p>
                {isApiLimitError && (
                  <div class="mt-8">
                    <a href="/" class="inline-block bg-yellow-500 text-zinc-950 px-8 py-3 rounded-full font-bold transition hover:bg-yellow-400 active:scale-95">
                      Return Home
                    </a>
                  </div>
                )}
              </div>
              <div class="p-10 border-t border-white/5">
                <a href="/" class="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Return to safety
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
      
      <div class="min-h-screen bg-zinc-950 py-12 px-6 sm:px-8">
        <main class="max-w-5xl mx-auto">
          <div class="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-sm">
            <div class="p-8 bg-white/5 border-b border-white/5">
              <div class="flex items-center gap-6">
                <div class="rounded-2xl bg-indigo-500/20 border border-indigo-500/30 p-3 text-indigo-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                  </svg>
                </div>
                <div>
                  <h1 class="text-2xl font-bold text-white tracking-tight">Chat with Document</h1>
                  <p class="text-slate-400 text-sm font-light">Analyzing {title} with Gemini AI</p>
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