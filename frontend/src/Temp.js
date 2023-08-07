import React, { useState, useContext } from "react";
import { BackendContext } from "./BackendProvider";
import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

export default function Temp() {
    const [inputValue, setInputValue] = useState("");
    const navigate = useNavigate();
    const handleClick = () => navigate('/ask');

  const { getAnswer, setAnswer, answer } = useContext(BackendContext);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    getAnswer(inputValue);
    handleClick()
  };
  return (
    <div className="w-full h-[100vh] text-center overflow-y-hidden flex justify-center items-center">
    <div className="w-full">
      <h1 className="font-bold text-5xl">UniGPT</h1>
      <h3 >A GPT model trained on <span className="text-[#C0AD00]">Waterloo</span></h3>
      <form 
        onSubmit={handleSubmit}>
        <button className="bg-black text-white text-sm rounded-lg px-4 py-2 mt-[100px]" type="submit">Start</button>
        <label>
          <input
            className="border-[2px] rounded-lg w-1/2 mx-4 p-1"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={"Tell me about the University of Waterloo"}
          />
        </label>
      </form>

    </div>
  </div>
  )
}
