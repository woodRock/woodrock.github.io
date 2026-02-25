// routes/wordle.tsx
import OnnxWordleSolver from "../islands/OnnxWordleSolver.tsx";

export default function WordlePage() {
  return (
    <div class="min-h-screen bg-zinc-950 py-20 px-6 sm:px-8">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-16">
          <h1 class="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">Wordle Solver</h1>
          <div class="h-1.5 w-24 bg-indigo-500 mx-auto rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)] mb-8"></div>
          <p class="text-xl text-slate-400 font-light max-w-2xl mx-auto mb-4">
            AI-powered tool that uses a trained neural network model to solve Wordle puzzles in real-time.
          </p>
          <p class="text-sm text-slate-500 max-w-2xl mx-auto uppercase tracking-widest font-black">
            Enter guesses and feedback to get intelligent suggestions.
          </p>
        </div>
        
        <div class="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-sm shadow-2xl mb-12">
          <OnnxWordleSolver initialWordList={[]} />
        </div>
        
        <div class="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 md:p-12">
          <h2 class="text-2xl font-bold text-white mb-8 tracking-tight">How to Use</h2>
          <ol class="space-y-6 text-slate-400 font-light">
            <li class="flex gap-4">
              <span class="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xs font-black">1</span>
              <div>
                <strong class="text-white block mb-1">Get a Suggestion</strong>
                The model will provide you with its top 5 recommended words to start with based on initial probability.
              </div>
            </li>
            <li class="flex gap-4">
              <span class="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xs font-black">2</span>
              <div>
                <strong class="text-white block mb-1">Enter Your Guess</strong>
                Type a 5-letter word into the input field to record your attempt.
              </div>
            </li>
            <li class="flex gap-4">
              <span class="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xs font-black">3</span>
              <div>
                <strong class="text-white block mb-1">Set the Feedback</strong>
                Select the color feedback received from Wordle to refine the AI's search space.
                <div class="flex gap-6 mt-4">
                  <span class="text-xs font-bold flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-green-500"></div> Correct Position</span>
                  <span class="text-xs font-bold flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-yellow-500"></div> Wrong Position</span>
                  <span class="text-xs font-bold flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-zinc-700"></div> Not in Word</span>
                </div>
              </div>
            </li>
          </ol>
        </div>
        
        <div class="mt-12 text-center">
          <p class="text-slate-600 text-[10px] font-black uppercase tracking-widest leading-loose">
            Model trained on common five-letter English words.<br />
            Built with Deno Fresh, ONNX Runtime, and PyTorch.
          </p>
        </div>
      </div>
    </div>
  );
}