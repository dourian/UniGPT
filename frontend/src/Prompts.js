import React, { useState, useContext, useEffect } from "react";
import { BackendContext } from "./BackendProvider";

function Prompts () {
    const {
        getPrompts,
        prompts,
        setPrompts
    } = useContext(BackendContext);
    
    // useEffect(() => {
    //     console.log("here: ", prompts)
    //     if (!prompts.length) {
    //         getPrompts();
    //     }
    // }, []);

    return (
        <div className="w-[500px] h-[200px] grid grid-cols-2 gap-[5px] self-center text-black">
            {prompts && prompts.map((item, index) => (
                <div key={index} className= "border rounded-lg">                      
                   {item}
                </div>
            ))}
        </div>
    );
}
export default Prompts;