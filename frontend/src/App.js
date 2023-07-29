import "./App.css";
import React, { useState, useContext } from "react";
import { BackendContext } from "./BackendProvider";

function App() {
  const [inputValue, setInputValue] = useState("");

  const { getAnswer, setAnswer, answer } = useContext(BackendContext);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    getAnswer(inputValue);
  };

  return (
    <div className="text-center">
      <header className="app-container">
        <form onSubmit={handleSubmit}>
          <label>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      </header>
    </div>
  );
}

export default App;
