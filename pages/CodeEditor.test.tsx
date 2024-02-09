import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CodeEditor from '../components/CodeEditor';

test('renders code editor with run button', () => {
  render(<CodeEditor />);
  expect(screen.getByRole('button', { name: 'Run' })).toBeInTheDocument();
});

test('executes Python code and displays output', async () => {
  render(<CodeEditor />);
  const codeEditor = screen.getByRole('textbox');

  // Mock Pyodide's runPython function
  global.loadPyodide = jest.fn().mockResolvedValueOnce({
    runPython: jest.fn().mockImplementationOnce(() => {
      console.log('Execution successful');
    }),
  });

  fireEvent.change(codeEditor, { target: { value: 'print("Hello, World!")' } });
  fireEvent.click(screen.getByRole('button', { name: 'Run' }));

  await waitFor(() => {
    expect(screen.getByText('Execution successful.')).toBeInTheDocument();
  });
});
