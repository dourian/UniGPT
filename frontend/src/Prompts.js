import React, { useState, useContext, useEffect } from "react";
import { BackendContext } from "./BackendProvider";

function Prompts () {
    const {
        getPrompts,
        prompts,
        setPrompts,
        inputValue,
        setInputValue
    } = useContext(BackendContext);

    const generatePrompt = async (item) => {
        console.log("click");
        await setInputValue(item)
        console.log(inputValue)
    }
    
    return (
        <div className="w-[500px] h-[500px] grid grid-cols-2 gap-[6px] m-4 self-center text-black">
            {prompts && prompts.map((item, index) => (
                <div key={index} className= "rounded-lg py-2 px-2 border-[2px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-[#101625]"  onClick={() => generatePrompt(item)}>                      
                   {item}
                </div>
            ))}
        </div>
    );
}
export default Prompts;