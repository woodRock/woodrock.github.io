import CountdownIsland from "../islands/Countdown.tsx";

export default function Countdown() {
  return (
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center text-gray-800">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Thesis Countdown</h1>
          <p className="text-lg md:text-xl mb-6">Time until August 1st, 2025</p>
          <CountdownIsland />
        </div>
      </div>
  );
}

