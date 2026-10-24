import { useState, useRef } from "react";
import "./App.css";

function App() {
  const inputRef = useRef(null);
  const resultRef = useRef(null);
  const [result, setResult] = useState(0);
  const [inputValue, setInputValue] = useState(''); 

  function plus(e) {
    e.preventDefault();
    setResult((result) => result + Number(inputRef.current.value));
  }

  function minus(e) {
    e.preventDefault();
    setResult((result) => result - Number(inputRef.current.value));
  }

  function times(e) {
    e.preventDefault();
    setResult((result) => result * Number(inputRef.current.value));
  }

  function divide(e) {
    e.preventDefault();
    const value = Number(inputRef.current.value);
    if (value === 0) {
      alert("Error: Division by zero");
      return;
    }
    setResult((result) => result / value);
  }

  function resetInput(e) { 
    e.preventDefault();
    inputRef.current.value = '0'; 
  }

  function resetResult(e) {
    e.preventDefault();
    setResult((prevVal)=> prevVal * 0)
  }

  return (
    <div className="App">
      <div className="center-container">
        <h1>The Essential Calculator 🧮</h1>
        <div className="calculator">
          <p ref={resultRef}>{result}</p>
          <div className="input-button-container">
            <input
              pattern="[0-9]"
              ref={inputRef}
              type="number"
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              placeholder="Type a number"
            />
            <div className="button-container">
              <button className="cute-button" onClick={plus}>add</button>
              <button className="cute-button" onClick={minus}>subtract</button>
              <button className="cute-button" onClick={times}>multiply</button>
              <button className="cute-button" onClick={divide}>divide</button>
              <button className="cute-button the-end-button" onClick={resetInput}>resetInput</button>
              <button className="cute-button the-end-button" onClick={resetResult}>resetResult</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;