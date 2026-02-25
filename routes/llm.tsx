// routes/llm.tsx
import { Head } from "$fresh/runtime.ts";
import { useState } from "preact/hooks";
import LLMIsland from "../islands/LLMIsland.tsx";

export default function LLMPage() {
  return (
    <>
      <Head>
        <title>LLM Interface | Jesse Wood</title>
        <meta name="description" content="Chat with an LLM model" />
      </Head>
      
      <div class="min-h-screen bg-zinc-950 py-20 px-6 sm:px-8">
        <header class="max-w-4xl mx-auto mb-16 text-center">
          <h1 class="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">LLM Interface</h1>
          <div class="h-1.5 w-24 bg-indigo-500 mx-auto rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)] mb-8"></div>
          <p class="text-xl text-slate-400 font-light max-w-2xl mx-auto">
            Interactive playground for exploring Large Language Models and their scientific applications.
          </p>
        </header>
        
        <main class="max-w-5xl mx-auto">
          <div class="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-sm min-h-[600px] shadow-2xl">
            <LLMIsland />
          </div>
        </main>
      </div>
    </>
  );
}