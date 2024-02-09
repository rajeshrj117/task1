import { useState } from 'react';
import dynamic from 'next/dynamic';

// Load CodeMirror dynamically to prevent SSR issues
const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), { ssr: false });

// Function to load Pyodide asynchronously
async function loadPyodide() {
  if (typeof window !== 'undefined' && !window.pyodide) {
    try {
      // Load Pyodide script dynamically
      const pyodideScript = await import('https://cdn.jsdelivr.net/pyodide/v0.18.1/full/pyodide.js');

      // Initialize Pyodide
      await globalThis.languagePluginLoader;
      window.pyodide = await globalThis.pyodide;

      // Optionally, expose loadPyodide as a global function
      globalThis.loadPyodide = loadPyodide;

      return window.pyodide;
    } catch (error) {
      console.error('Failed to load Pyodide:', error);
      throw error;
    }
  } else {
    return window.pyodide;
  }
}


// Function to execute Python code using Pyodide
async function runPythonCode(code) {
  const pyodide = await loadPyodide();
  pyodide.runPython(code);
}

export default function CodeEditor() {
  const [code, setCode] = useState('');
  const [consoleOutput, setConsoleOutput] = useState('');

  // Function to handle code execution
  async function handleRun() {
    try {
      await runPythonCode(code);
      setConsoleOutput('Execution successful.');
    } catch (error) {
      setConsoleOutput(`Error: ${error.message}`);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <button onClick={handleRun}>Run</button>
      </div>
      <CodeMirror
        value={code}
        onChange={(value) => setCode(value)}
        options={{
          mode: 'python',
          theme: 'default',
          lineNumbers: true,
        }}
      />
      <div>
        <h3>Console Output:</h3>
        <pre>{consoleOutput}</pre>
      </div>
    </div>
  );
}
