import React, { useState, useContext, useEffect } from "react";
import { BackendContext } from "./BackendProvider";
import { IoSend } from "react-icons/io5";
import { Tooltip } from 'antd';

function Prompts () {
    const {
        getPrompts,
        prompts,
        setPrompts,
        inputValue,
        setInputValue
    } = useContext(BackendContext);

    const [hoveredPrompt, setHoveredPrompt] = useState()

    const generatePrompt = async (item) => {
        setInputValue(item)
    }
    
    return (
        <div className="w-[500px] grid grid-cols-2 gap-x-[6px] gap-y-[6px] self-center text-black">
            {prompts && prompts.map((item, index) => (
                <div key={index} className= "flex flex-row rounded-lg py-2 px-2 text-[14px] border-[1.5px] leading-snug h-[80px] hover:border-[#101625]" onMouseEnter={() => setHoveredPrompt(item)}>                      
                    <div className = "w-[200px] mx-[10px] my-auto">{item}</div>
                    <Tooltip title = "Click to send" className="">
                        <button onClick={() => generatePrompt(item)} className = {hoveredPrompt === item? "w-[30px] h-[30px] my-auto text-[18px] opacity-1 transition-[900ms] ease-in-out" : "w-[30px] h-[30px] my-auto text-[18px] opacity-0 transition-[900ms] ease-in-out"} >
                            <IoSend/>
                        </button>
                    </Tooltip>
                </div>
            ))}
        </div>
    );
}
export default Prompts;