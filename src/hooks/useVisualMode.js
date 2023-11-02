import { useState } from "react";
export default function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]); 

  const transition = (newMode, replace = false) => {
    if (replace) {
      // Replace the current mode in history with the new mode
      setHistory(prev => [...prev.slice(0, prev.length - 1), newMode]);
    } else {
      // Add the new mode to history
      setHistory(prev => [...prev, newMode]);
    }
  };
  function back() {
    setHistory(prev => [...prev.slice(0, prev.length - 1)])
  }

  return { mode: history[history.length -1], transition, back };
}

