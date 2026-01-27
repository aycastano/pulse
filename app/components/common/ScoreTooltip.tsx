import React, { useState } from "react";
import { Info } from "lucide-react";

export function ScoreTooltip() {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Información sobre el cálculo del score"
      >
        <Info className="w-4 h-4 text-gray-500" />
      </button>

      {show && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-4 bg-gray-900 text-white text-xs rounded-lg shadow-xl">
          <div className="font-semibold mb-2">Fórmula del Score:</div>
          <code className="block bg-gray-800 p-2 rounded mb-2">
            score = (impact × 2) + priorityWeight - effort
          </code>
          <ul className="space-y-1 text-gray-300">
            <li>• Critical: +6 pts</li>
            <li>• High: +4 pts</li>
            <li>• Medium: +2 pts</li>
            <li>• Low: +0 pts</li>
          </ul>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900" />
        </div>
      )}
    </div>
  );
}
