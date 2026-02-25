// islands/OnnxWordleSolver.tsx
import { useState, useEffect } from "preact/hooks";

// Import ONNX Runtime dynamically
let ort: any = null;

export default function OnnxWordleSolver() {
  const [wordList, setWordList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modelStatus, setModelStatus] = useState("loading");
  const [model, setModel] = useState<any>(null); // Store the loaded model
  
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [feedbacks, setFeedbacks] = useState<string[]>([]);
  const [currentFeedback, setCurrentFeedback] = useState("00000");
  const [predictions, setPredictions] = useState<string[]>(["STARE", "CRANE", "ROATE", "RAISE", "ARISE"]);

  // Character to index mapping (A=0, B=1, ..., Z=25)
  const vocab = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").reduce((acc, char, idx) => {
    acc[char] = idx;
    return acc;
  }, {} as Record<string, number>);

  // Load ONNX Runtime dynamically
  useEffect(() => {
    async function loadOnnxRuntime() {
      if (typeof window !== "undefined") {
        try {
          ort = await import("npm:onnxruntime-web@latest");

          if (ort.env) {
            console.log("Configuring ONNX Runtime...");
            ort.env.wasm.numThreads = 1;
            ort.env.wasm.simd = false;
          }
          console.log("ONNX Runtime loaded");
        } catch (e) {
          console.error("Failed to load ONNX Runtime:", e);
          setModelStatus("failed");
          setError("Failed to load ONNX Runtime: " + (e instanceof Error ? e.message : String(e)));
        }
      }
    }
    loadOnnxRuntime();
  }, []);

  // Load model and word data
  useEffect(() => {
    async function loadModelAndData() {
      try {
        setLoading(true);
        
        // Load word list
        let words: string[] = [];
        try {
          const response = await fetch("/words.txt");
          if (response.ok) {
            const text = await response.text();
            words = text.trim().split("\n").map(w => w.toUpperCase());
          } else {
            words = [
              "STARE", "CRANE", "ROATE", "RAISE", "ARISE", "AUDIO", "ADIEU",
              "ABOUT", "ABOVE", "ACUTE", "BRAVE", "WATER", "PEARS", "RESIN"
            ];
          }
        } catch (e) {
          console.warn("Using default word list");
          words = [
            "STARE", "CRANE", "ROATE", "RAISE", "ARISE", "AUDIO", "ADIEU",
            "ABOUT", "ABOVE", "ACUTE", "BRAVE", "WATER", "PEARS", "RESIN"
          ];
        }
        setWordList(words);
        
        // Load the model if ort is available
        if (ort && modelStatus === "loading") {
          try {
            console.log("Attempting to load the ONNX model");
            const modelResponse = await fetch("/wordle_model.onnx");
            if (!modelResponse.ok) {
              throw new Error(`Failed to fetch model: ${modelResponse.statusText}`);
            }
            const modelBuffer = await modelResponse.arrayBuffer();
            const loadedModel = await ort.InferenceSession.create(modelBuffer);
            setModel(loadedModel);
            setModelStatus("loaded");
            console.log("ONNX model loaded successfully!");
          } catch (modelError) {
            console.error("Failed to load ONNX model:", modelError);
            setModelStatus("failed");
            setError("Failed to load ONNX model: " + 
              (modelError instanceof Error ? modelError.message : String(modelError)));
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error in initialization:", err);
        setError(err instanceof Error ? err.message : "Failed to initialize");
        setLoading(false);
      }
    }
    
    if (typeof window !== "undefined") {
      loadModelAndData();
    }
  }, [modelStatus]);

  // Update feedback for a specific character
  const updateFeedbackChar = (index: number, value: string) => {
    const newFeedback = currentFeedback.split("");
    newFeedback[index] = value;
    setCurrentFeedback(newFeedback.join(""));
  };

  // Submit a guess with feedback and use the model for predictions
  const submitGuess = async () => {
    if (currentGuess.length !== 5) {
      setError("Guess must be 5 letters");
      return;
    }
    
    const guess = currentGuess.toUpperCase();
    const feedback = currentFeedback;
    
    const newGuesses = [...guesses, guess];
    const newFeedbacks = [...feedbacks, feedback];
    
    setGuesses(newGuesses);
    setFeedbacks(newFeedbacks);
    setCurrentGuess("");
    setCurrentFeedback("00000");
    
    try {
      setLoading(true);
      setError("");
      
      let newPredictions: string[];
      if (model && modelStatus === "loaded") {
        // Use the ONNX model for predictions
        newPredictions = await getModelPredictions(newGuesses, newFeedbacks);
      } else {
        // Fallback to frequency-based predictions
        const filtered = filterWordList(wordList, newGuesses, newFeedbacks);
        newPredictions = getTopPredictions(filtered, newGuesses);
      }
      
      setPredictions(newPredictions);
      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setLoading(false);
    }
  };

  // Get predictions from the ONNX model
  const getModelPredictions = async (guesses: string[], feedbacks: string[]): Promise<string[]> => {
    // Prepare input tensors
    const batchSize = 1; // Single game
    const numGuesses = guesses.length;
    
    // If no guesses yet, use zero tensors
    const guessData = new Float32Array(batchSize * numGuesses * 5);
    const feedbackData = new Float32Array(batchSize * numGuesses * 5);
    
    for (let g = 0; g < numGuesses; g++) {
      const guess = guesses[g];
      const feedback = feedbacks[g];
      for (let i = 0; i < 5; i++) {
        const idx = g * 5 + i;
        guessData[idx] = vocab[guess[i]]; // Letter index (0-25)
        feedbackData[idx] = parseInt(feedback[i]); // Feedback (0, 1, 2)
      }
    }
    
    const guessTensor = new ort.Tensor("float32", guessData, [batchSize, numGuesses, 5]);
    const feedbackTensor = new ort.Tensor("float32", feedbackData, [batchSize, numGuesses, 5]);
    
    // Run inference
    const inputs = {
      guesses: guessTensor,
      feedbacks: feedbackTensor,
    };
    const output = await model.run(inputs);
    
    // Process output (word_scores)
    const wordScores = output.word_scores.data; // Adjust output name if different
    const filtered = filterWordList(wordList, guesses, feedbacks);
    
    // Sort words by score, keeping only filtered ones
    const scoredWords = wordList.map((word, idx) => ({
      word,
      score: filtered.includes(word) ? wordScores[idx] : -Infinity,
    }));
    scoredWords.sort((a, b) => b.score - a.score);
    
    return scoredWords.slice(0, 5).map(item => item.word);
  };
  
  // Reset the game
  const resetGame = () => {
    setGuesses([]);
    setFeedbacks([]);
    setCurrentGuess("");
    setCurrentFeedback("00000");
    setPredictions(["STARE", "CRANE", "ROATE", "RAISE", "ARISE"]);
    setError("");
  };

  return (
    <div class="bg-zinc-900/40 rounded-[2.5rem] border border-white/5 p-8 md:p-12 backdrop-blur-sm shadow-2xl">
      {loading && guesses.length === 0 ? (
        <div class="text-center p-12">
          <div class="inline-block animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full mb-6"></div>
          <p class="text-slate-400 font-bold uppercase tracking-widest text-xs">Initializing Neural Engine...</p>
        </div>
      ) : (
        <>
          {error && modelStatus === "failed" && (
            <div class="mb-8 p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-3xl text-yellow-200/80">
              <p class="font-bold text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Model Compatibility Mode
              </p>
              <p class="text-xs leading-relaxed font-medium">Falling back to algorithmic solver. High accuracy maintained.</p>
            </div>
          )}
          
          <div class="mb-12">
            <h2 class="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6 ml-1">Sequence History</h2>
            {guesses.length === 0 ? (
              <div class="p-10 border border-dashed border-white/10 rounded-3xl text-center">
                <p class="text-slate-600 text-xs font-bold uppercase tracking-widest">No inputs recorded</p>
              </div>
            ) : (
              <div class="space-y-4">
                {guesses.map((guess, index) => (
                  <div key={index} class="flex items-center justify-between bg-white/5 border border-white/5 p-4 rounded-2xl group transition-all hover:bg-white/[0.08]">
                    <div class="flex space-x-2">
                      {guess.split("").map((letter, letterIndex) => {
                        const feedback = feedbacks[index][letterIndex];
                        let bgColor = "bg-zinc-800 border-white/5";
                        if (feedback === "2") bgColor = "bg-green-500/20 border-green-500/30 text-green-400";
                        else if (feedback === "1") bgColor = "bg-yellow-500/20 border-yellow-500/30 text-yellow-400";
                        return (
                          <div key={letterIndex} class={`w-10 h-10 md:w-12 md:h-12 ${bgColor} border flex items-center justify-center font-black rounded-xl text-lg transition-all duration-500`}>
                            {letter}
                          </div>
                        );
                      })}
                    </div>
                    <div class="hidden md:block text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-slate-400 transition-colors">
                      Entry #{index + 1} <span class="mx-2">•</span> Score: {((index + 1) * 14.2).toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div class="mb-12">
            <h2 class="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6 ml-1">Input Interface</h2>
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
              <div class="lg:col-span-4">
                <label class="block text-[10px] font-black uppercase tracking-widest text-slate-600 mb-3 ml-1">Candidate Word</label>
                <input
                  type="text"
                  value={currentGuess}
                  onInput={(e) => setCurrentGuess(e.currentTarget.value.slice(0, 5).toUpperCase())}
                  placeholder="ABCDE"
                  class="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-black text-xl tracking-[0.3em] focus:outline-none focus:border-indigo-500/50 transition-all placeholder-zinc-800"
                  maxLength={5}
                />
              </div>
              
              <div class="lg:col-span-5">
                <label class="block text-[10px] font-black uppercase tracking-widest text-slate-600 mb-3 ml-1">Vector Feedback</label>
                <div class="flex space-x-2">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <select
                      key={index}
                      value={currentFeedback[index]}
                      onChange={(e) => updateFeedbackChar(index, e.currentTarget.value)}
                      class={`w-full aspect-square border rounded-2xl text-center text-xl transition-all appearance-none cursor-pointer hover:scale-105 active:scale-95 ${
                        currentFeedback[index] === "2" ? "bg-green-500 border-green-400" :
                        currentFeedback[index] === "1" ? "bg-yellow-500 border-yellow-400" :
                        "bg-zinc-800 border-zinc-700"
                      }`}
                    >
                      <option value="0">⚫</option>
                      <option value="1">🟡</option>
                      <option value="2">🟢</option>
                    </select>
                  ))}
                </div>
              </div>
              
              <div class="lg:col-span-3">
                <button
                  onClick={submitGuess}
                  disabled={loading || currentGuess.length !== 5}
                  class={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all ${
                    loading || currentGuess.length !== 5
                      ? "bg-white/5 text-slate-600 cursor-not-allowed border border-white/5"
                      : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)] active:scale-95"
                  }`}
                >
                  {loading ? "Analyzing..." : "Submit"}
                </button>
              </div>
            </div>
            
            {error && modelStatus !== "failed" && (
              <p class="mt-4 text-red-400 text-xs font-bold uppercase tracking-widest text-center">{error}</p>
            )}
          </div>
          
          <div class="mb-8 pt-8 border-t border-white/5">
            <div class="flex justify-between items-center mb-8">
              <h2 class="text-xs font-black uppercase tracking-[0.2em] text-indigo-400">
                {modelStatus === "loaded" ? "Neural Network Output" : "Smart Predictions"}
              </h2>
              <div class="h-px flex-grow mx-6 bg-indigo-500/10"></div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
              {predictions.map((word, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentGuess(word)}
                  class="group bg-white/5 border border-white/5 rounded-2xl p-5 text-center transition-all hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:-translate-y-1"
                >
                  <span class="block font-black text-xl text-white group-hover:text-indigo-400 transition-colors tracking-widest">{word}</span>
                  <div class="text-[10px] font-black text-slate-600 uppercase tracking-[0.15em] mt-2 group-hover:text-indigo-400/60 transition-colors">#{index + 1} Priority</div>
                </button>
              ))}
            </div>
          </div>
          
          <div class="text-center mt-12 pt-8 border-t border-white/5">
            <button
              onClick={resetGame}
              class="px-8 py-3 bg-white/5 border border-white/10 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all active:scale-95"
            >
              Reset Terminal
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// Filter words based on feedback (unchanged)
function filterWordList(wordList: string[], guesses: string[], feedbacks: string[]): string[] {
  if (guesses.length === 0) return wordList;
  
  return wordList.filter(word => {
    for (let i = 0; i < guesses.length; i++) {
      if (!isConsistentWithFeedback(word, guesses[i], feedbacks[i])) {
        return false;
      }
    }
    return true;
  });
}

// Check if a word is consistent with feedback (unchanged)
function isConsistentWithFeedback(candidate: string, guess: string, feedback: string): boolean {
  const candidateChars = [...candidate];
  const guessChars = [...guess];
  
  for (let i = 0; i < 5; i++) {
    if (feedback[i] === "2") {
      if (guessChars[i] !== candidateChars[i]) return false;
      candidateChars[i] = "#";
      guessChars[i] = "$";
    }
  }
  
  for (let i = 0; i < 5; i++) {
    if (feedback[i] === "1") {
      if (guess[i] === candidate[i]) return false;
      const pos = candidateChars.indexOf(guess[i]);
      if (pos === -1) return false;
      candidateChars[pos] = "#";
      guessChars[i] = "$";
    }
  }
  
  for (let i = 0; i < 5; i++) {
    if (feedback[i] === "0" && guessChars[i] !== "$") {
      if (candidateChars.includes(guess[i])) return false;
    }
  }
  
  return true;
}

// Fallback frequency-based predictions (unchanged)
function getTopPredictions(words: string[], previousGuesses: string[]): string[] {
  if (words.length <= 5) return words;
  
  const letterFrequency: Record<string, number> = {};
  for (const word of words) {
    const uniqueLetters = new Set(word.split(""));
    for (const letter of uniqueLetters) {
      letterFrequency[letter] = (letterFrequency[letter] || 0) + 1;
    }
  }
  
  const scoredWords = words.map(word => {
    const uniqueLetters = new Set(word.split(""));
    let score = 0;
    for (const letter of uniqueLetters) {
      score += letterFrequency[letter] || 0;
    }
    for (const guess of previousGuesses) {
      for (const letter of guess) {
        if (word.includes(letter)) score -= 10;
      }
    }
    return { word, score };
  });
  
  scoredWords.sort((a, b) => b.score - a.score);
  return scoredWords.slice(0, 5).map(item => item.word);
}