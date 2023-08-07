import React, { useState } from "react";
import {
  IoIosArrowDropleftCircle,
} from "react-icons/io";
import { RiArrowUpCircleFill } from "react-icons/ri"
import { BsThreeDots } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export default function Ask({ isDark, setIsDark }) {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className="w-full h-[100vh]">
      <div className="bg-[#101625] w-[80px] h-[100vh] transition-all duration-100 ease-in-out absolute z-10">
        <button className="m-4 border-b-[0.5px]" onClick={() => navigate("/")}>
          <IoIosArrowDropleftCircle className="fill-white text-[30px] m-2" />
        </button>
        <button className= 'flex items-center align-center w-full'>
          <BsThreeDots className= 'flex mx-auto mt-[85vh] fill-white text-[20px]'/>
        </button>
      </div>
      <div className="w-full h-[100vh] absolute flex flex-col justify-between z-0">
        <h1 className="mt-[80px] text-6xl font-bold text-black text-center w-full">UniGPT</h1>
        <div className="flex flex-row w-full mb-[10px] items-center justify-center gap-4">
          <form onSubmit={handleSubmit} className="w-[500px] drop_shadow">
            <label>
              <input
                className="border-[2px] rounded-lg mx-4 py-1 px-4 h-[50px] w-full"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder={"Tell me about the University of Waterloo"}
              />
            </label>
          </form>
          <button
              className="bg-[#101625] w-[50px] h-[50px] m-2 text-white text-center items-center text-sm rounded-lg drop_shadow"
              type="submit"
            >
              <RiArrowUpCircleFill className = 'text-[35px] mx-auto'/>
            </button>
        </div>
      </div>
    </div>
  );
}
