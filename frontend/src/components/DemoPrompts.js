import React, { useState, useContext } from "react";
import { BackendContext } from "../BackendProvider";
import { IoSend } from "react-icons/io5";
import { Tooltip, Popover } from "antd";

function DemoPrompts({ demoSteps, setDemoSteps, setInputValue }) {
  const { prompts } = useContext(BackendContext);

  const [hoveredPrompt, setHoveredPrompt] = useState();

  const generatePrompt = async (item) => {
    setDemoSteps([false, false, true, false]);
    setInputValue(item);
  };

  return (
    <div className="w-[500px] grid grid-cols-2 gap-x-[6px] gap-y-[6px] self-center text-black">
      {prompts?.map((item, index) =>
        index === 2 ? (
          <Popover
            key={item}
            content={"Hover over this prompt and click the send button!"}
            visible={demoSteps[1]}
          >
            <div
              key={item}
              className={
                demoSteps[1]
                  ? "flex border-black flex-row transition-border-color ease-in-out transition-[900ms] rounded-lg py-2 px-2 text-[14px] border-[1.5px] leading-snug h-[80px] animate-pulse"
                  : "flex flex-row transition-border-color ease-in-out  transition-[900ms] rounded-lg py-2 px-2 text-[14px] border-[1.5px] leading-snug h-[80px]"
              }
              onMouseEnter={() => setHoveredPrompt(item)}
              onMouseLeave={() => setHoveredPrompt()}
            >
              <div className="w-[200px] mx-[10px] my-auto">{item}</div>
              <Tooltip title="Click to send" className="">
                <button
                  onClick={() => generatePrompt(item)}
                  className={
                    hoveredPrompt === item
                      ? "w-[30px] h-[30px] my-auto text-[18px] opacity-1 transition-[1000ms] ease-in-out"
                      : "w-[30px] h-[30px] my-auto text-[18px] opacity-0 transition-[1000ms] ease-in-out"
                  }
                >
                  <IoSend />
                </button>
              </Tooltip>
            </div>
          </Popover>
        ) : (
          <div
            key={item}
            className={`flex flex-row rounded-lg py-2 px-2 text-[14px] border-[1.5px] leading-snug h-[80px] ${
              demoSteps[1] && "opacity-[30%]"
            }`}
          >
            <div className="w-[200px] mx-[10px] my-auto">{item}</div>
          </div>
        )
      )}
    </div>
  );
}

export default DemoPrompts;
