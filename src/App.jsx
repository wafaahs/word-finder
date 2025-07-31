import React, { useState, useEffect } from 'react';

export default function App() {
  const [input, setInput] = useState('');
  const [words, setWords] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch('/words.json')
      .then(res => res.json())
      .then(data => setWords(data));
  }, []);

  const findMatches = () => {
    const letters = input.toLowerCase().split('').sort().join('');
    const matches = words.filter(word => {
      const wordSorted = word.toLowerCase().split('').sort().join('');
      return word.length === letters.length && wordSorted === letters;
    });
    setResults(matches);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-6">🔍 Word Finder</h1>

      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow">
        <label className="block mb-2 text-lg font-medium">Enter letters:</label>
        <input
          type="text"
          placeholder="e.g. react"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={findMatches}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Find Words
        </button>
      </div>

      {results.length > 0 && (
        <div className="w-full max-w-md mt-6 bg-white p-4 rounded-xl shadow overflow-y-auto max-h-96">
          <h2 className="text-xl font-semibold mb-2">Results:</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {results.map((word, idx) => (
              <li key={idx}>{word}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
