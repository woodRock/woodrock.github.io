// routes/wordle.tsx
import OnnxWordleSolver from "../islands/OnnxWordleSolver.tsx";

export default function WordlePage() {
  return (
    <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-bold text-center mb-6 text-gray-800">Wordle Solver</h1>
        <p class="text-center text-gray-600 mb-4 max-w-2xl mx-auto">
          AI-powered tool that uses a trained neural network model to solve Wordle puzzles in real-time.
        </p>
        <p class="text-center text-gray-500 mb-10 max-w-2xl mx-auto text-sm">
          Enter your Wordle guesses and the color feedback to get intelligent suggestions for your next word.
        </p>
        
        <div class="bg-white rounded-xl shadow-lg overflow-hidden p-6 md:p-8">
          <OnnxWordleSolver initialWordList={[]} />
        </div>
        
        <div class="mt-10 bg-white rounded-xl shadow-lg overflow-hidden p-6 md:p-8">
          <h2 class="text-2xl font-bold mb-4">How to Use</h2>
          <ol class="list-decimal pl-5 space-y-3 text-gray-700">
            <li>
              <strong>Get a Suggestion:</strong> The model will provide you with its top 5 recommended words to start with.
            </li>
            <li>
              <strong>Enter Your Guess:</strong> Type a 5-letter word into the input field.
            </li>
            <li>
              <strong>Set the Feedback:</strong> Select the color feedback you received from Wordle:
              <ul class="list-disc pl-5 mt-2">
                <li><span class="text-green-600 font-medium">Green (🟢)</span> - The letter is in the correct position</li>
                <li><span class="text-yellow-600 font-medium">Yellow (🟡)</span> - The letter is in the word but in the wrong position</li>
                <li><span class="text-gray-600 font-medium">Gray (⚫)</span> - The letter is not in the word</li>
              </ul>
            </li>
            <li>
              <strong>Submit and Repeat:</strong> Click the Submit button to get the next prediction, then repeat the process.
            </li>
          </ol>
        </div>
        
        <div class="mt-8 text-center text-gray-500 text-sm">
          <p>Model trained on a dataset of common five-letter English words.</p>
          <p>Built with Deno Fresh, ONNX Runtime, and PyTorch.</p>
        </div>
      </div>
    </div>
  );
}