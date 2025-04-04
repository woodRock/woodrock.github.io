import { Handlers } from "$fresh/server.ts";
import { useState, useEffect } from "preact/hooks";

// Island component for the live countdown
export default function CountdownIsland() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const targetDate = new Date("2025-08-01T00:00:00Z").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        // Countdown is complete
        setIsComplete(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Ensure all values are finite
      setTimeLeft({
        days: Number.isFinite(days) ? days : 0,
        hours: Number.isFinite(hours) ? hours : 0,
        minutes: Number.isFinite(minutes) ? minutes : 0,
        seconds: Number.isFinite(seconds) ? seconds : 0,
      });
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  if (isComplete) {
    return (
      <div className="text-4xl md:text-6xl font-mono text-green-600">
        Thesis Deadline Reached!
      </div>
    );
  }

  return (
    <div className="text-4xl md:text-6xl font-mono flex space-x-4 justify-center">
      <div>
        <span>{timeLeft.days}</span>
        <span className="text-lg md:text-xl">d</span>
      </div>
      <div>
        <span>{timeLeft.hours}</span>
        <span className="text-lg md:text-xl">h</span>
      </div>
      <div>
        <span>{timeLeft.minutes}</span>
        <span className="text-lg md:text-xl">m</span>
      </div>
      <div>
        <span>{timeLeft.seconds}</span>
        <span className="text-lg md:text-xl">s</span>
      </div>
    </div>
  );
}

export const handler: Handlers = {
  GET(_req, ctx) {
    return ctx.render();
  },
};
