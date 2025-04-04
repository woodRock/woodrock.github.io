// routes/llm.tsx
import { Head } from "$fresh/runtime.ts";
import { useState } from "preact/hooks";
import LLMIsland from "../islands/LLMIsland.tsx";

export default function LLMPage() {
  return (
    <>
      <Head>
        <title>LLM Interface</title>
        <meta name="description" content="Chat with an LLM model" />
      </Head>
      
      <div class="min-h-screen bg-gray-50">
        <header class="bg-white shadow">
          <div class="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold text-gray-900">LLM Interface</h1>
          </div>
        </header>
        
        <main class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div class="px-4 py-6 sm:px-0">
            <div class="bg-white rounded-lg shadow p-4 min-h-[600px]">
              <LLMIsland />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}