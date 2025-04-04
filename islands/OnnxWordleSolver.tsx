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
    <div>
      {loading && guesses.length === 0 ? (
        <div class="text-center p-8">
          <div class="inline-block animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
          <p>Loading data{modelStatus === "loading" ? " and model" : ""}...</p>
        </div>
      ) : (
        <>
          {error && modelStatus === "failed" && (
            <div class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
              <p class="font-medium">Model Loading Issue</p>
              <p class="text-sm">{error}</p>
              <p class="text-sm mt-1">The solver will use a smart algorithm instead of the neural network.</p>
            </div>
          )}
          
          <div class="mb-8">
            <h2 class="text-2xl font-bold mb-4">Past Guesses</h2>
            {guesses.length === 0 ? (
              <p class="text-gray-500 italic">No guesses yet</p>
            ) : (
              <div class="space-y-2">
                {guesses.map((guess, index) => (
                  <div key={index} class="flex items-center space-x-4">
                    <div class="flex space-x-1">
                      {guess.split("").map((letter, letterIndex) => {
                        const feedback = feedbacks[index][letterIndex];
                        let bgColor = "bg-gray-200";
                        if (feedback === "2") bgColor = "bg-green-500 text-white";
                        else if (feedback === "1") bgColor = "bg-yellow-500 text-white";
                        return (
                          <div key={letterIndex} class={`w-10 h-10 ${bgColor} flex items-center justify-center font-bold rounded`}>
                            {letter}
                          </div>
                        );
                      })}
                    </div>
                    <span class="text-gray-600">Feedback: {feedbacks[index]}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div class="mb-8">
            <h2 class="text-2xl font-bold mb-4">Enter New Guess</h2>
            <div class="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <input
                type="text"
                value={currentGuess}
                onInput={(e) => setCurrentGuess(e.currentTarget.value.slice(0, 5).toUpperCase())}
                placeholder="Enter a 5-letter word"
                class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                maxLength={5}
              />
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Feedback:</label>
                <div class="flex space-x-1">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <select
                      key={index}
                      value={currentFeedback[index]}
                      onChange={(e) => updateFeedbackChar(index, e.currentTarget.value)}
                      class="w-10 h-10 border border-gray-300 rounded text-center"
                    >
                      <option value="0">⚫</option>
                      <option value="1">🟡</option>
                      <option value="2">🟢</option>
                    </select>
                  ))}
                </div>
                <div class="mt-1 text-xs text-gray-500">
                  ⚫ = Gray (Not in word), 🟡 = Yellow (Wrong position), 🟢 = Green (Correct position)
                </div>
              </div>
              
              <button
                onClick={submitGuess}
                disabled={loading || currentGuess.length !== 5}
                class="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Submit"}
              </button>
            </div>
            
            {error && modelStatus !== "failed" && <p class="mt-2 text-red-600">{error}</p>}
          </div>
          
          <div class="mb-8">
            <h2 class="text-2xl font-bold mb-4">
              {modelStatus === "loaded" ? "Neural Network Suggestions" : "Smart Suggestions"}
            </h2>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
              {predictions.map((word, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentGuess(word)}
                  class="bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-center transform transition duration-200 hover:scale-105 hover:shadow-md hover:bg-indigo-100"
                >
                  <span class="font-bold text-lg text-indigo-800">{word}</span>
                  <div class="text-xs text-indigo-600 mt-1">Suggestion {index + 1}</div>
                </button>
              ))}
            </div>
          </div>
          
          <div class="text-center mt-8">
            <button
              onClick={resetGame}
              class="px-6 py-2 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Reset Game
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