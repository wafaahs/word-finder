import React, { useState, useEffect, useMemo } from 'react';
import debounce from "lodash/debounce";


export default function App() {
  const [input, setInput] = useState('');
  const [words, setWords] = useState([]);
  const [results, setResults] = useState([]);
  const [includeLetters, setIncludeLetters] = useState("");
  const [excludeLetters, setExcludeLetters] = useState("");
  const [length, setLength] = useState("");
  const [pattern, setPattern] = useState("");
  const [startsWith, setStartsWith] = useState("");
  const [endsWith, setEndsWith] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 20;


  useEffect(() => {
    fetch('/words_dictionary.json')
      .then(res => res.json())
      .then(data => setWords(Object.keys(data)));
  }, []);


  const findMatches = () => {
    setLoading(true);
  const results = words.filter(word => {
    const lower = word.toLowerCase();

    // ✅ Word Length
    if (length && lower.length !== parseInt(length)) return false;

    // ✅ Include letters (must contain ALL)
    for (let char of includeLetters.toLowerCase()) {
      if (!lower.includes(char)) return false;
    }

    // ✅ Exclude letters
    for (let char of excludeLetters.toLowerCase()) {
      if (lower.includes(char)) return false;
    }

    // ✅ Pattern matching using RegExp (e.g. "a.d.o")
    if (pattern) {
      const regex = new RegExp(`^${pattern.toLowerCase()}$`);
      if (!regex.test(lower)) return false;
    }

    // ✅ Starts with
    if (startsWith && !lower.startsWith(startsWith.toLowerCase())) return false;

    // ✅ Ends with
    if (endsWith && !lower.endsWith(endsWith.toLowerCase())) return false;

    return true;
  });

  setResults(results);
  setLoading(false);
};

  const debouncedFindMatches = useMemo(() => debounce(findMatches, 300), [
    words,
    includeLetters,
    excludeLetters,
    length,
    pattern,
    startsWith,
    endsWith,
  ]);

  useEffect(() => {
  debouncedFindMatches();
  return () => debouncedFindMatches.cancel(); // Cleanup
  }, [includeLetters, excludeLetters, length, pattern, startsWith, endsWith]);


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
        <div className="mt-4 space-y-3">
          <input
            type="text"
            placeholder="Include letters (e.g. aei)"
            value={includeLetters}
            onChange={(e) => setIncludeLetters(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            placeholder="Exclude letters (e.g. xyz)"
            value={excludeLetters}
            onChange={(e) => setExcludeLetters(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <input
            type="number"
            placeholder="Word length (e.g. 5)"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            placeholder="Pattern (e.g. a.d.o)"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            placeholder="Starts with (e.g. un)"
            value={startsWith}
            onChange={(e) => setStartsWith(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            placeholder="Ends with (e.g. ing)"
            value={endsWith}
            onChange={(e) => setEndsWith(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>


        <button
          onClick={findMatches}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Find Words
        </button>
      </div>
      {loading && <p className="text-blue-500 font-semibold">Searching...</p>}


      {results.length > 0 && (
        <div className="w-full max-w-md mt-6 bg-white p-4 rounded-xl shadow overflow-y-auto max-h-96">
          <h2 className="text-xl font-semibold mb-2">Results:</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {results.map((word, idx) => (
              <li key={idx}>{word}</li>
            ))}
          </ul>
          <div className="flex justify-center items-center gap-2 mt-4">
  <button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(currentPage - 1)}
    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
  >
    Prev
  </button>
  <span className="font-medium">
    Page {currentPage} of {Math.ceil(results.length / resultsPerPage)}
  </span>
  <button
    disabled={currentPage >= Math.ceil(results.length / resultsPerPage)}
    onClick={() => setCurrentPage(currentPage + 1)}
    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
  >
    Next
  </button>
</div>

        </div>
      )}
    </div>
  );
}
