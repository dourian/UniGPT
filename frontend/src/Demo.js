import React, { useState, useEffect, useRef } from "react";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { RiArrowUpCircleFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { Conversation } from "./components/Conversation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import { Modal, Button, Popover } from "antd";
import DemoPrompts from "./components/DemoPrompts";

export default function Demo() {
  const [conversationArr, setConversationArr] = useState([]);
  const [renderedConversation, setRenderedConversation] = useState([]);
  const [showPrompts, setShowPrompts] = useState(true);
  const [demoSteps, setDemoSteps] = useState([true, false, false, false]);
  const [isLoading, setIsLoading] = useState(false);
  const [disabledAsk, setDisabledAsk] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const notify = () => toast("You cannot enter a blank question!");

  const bottomEl = useRef(null);

  const scrollToBottom = () => {
    bottomEl?.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStartDemo = () => {
    setDemoSteps([false, true, false, false]);
  };

  useEffect(() => {
    let temp = [];
    conversationArr.forEach((item) => {
      if (item.type === "user") {
        temp.push(
          <div className="bg-[#FFFFFF] border border-gray-300 h-fit">
            <p className="text-right w-full pl-24 pr-10 text-lg pt-5 pb-5">
              {item.text}
            </p>
          </div>
        );
      } else if (item.type === "bot") {
        temp.push(
          <div className="bg-[#F7F7F8] border border-gray-300 h-fit">
            <p className="text-left w-full pl-10 pr-24 text-lg pt-5 pb-5">
              {item.text}
            </p>
          </div>
        );
      }
    });

    setRenderedConversation(temp);
  }, [conversationArr]);

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const queryQuestion = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    setShowPrompts(false);
    if (inputValue === "") {
      notify();
    } else {
      setInputValue("");
      setDisabledAsk("disabled");
      await setConversationArr((prev) => [
        ...prev,
        new Conversation("user", inputValue),
      ]);

      let ans =
        "To complete your Computer Science degree at the University of Waterloo, you'll need to: take 40 courses (20.0 units) including CS, fulfill math and elective requirements, add extra units, meet depth and average constraints, and satisfy communication and humanities needs. Stay informed about official regulations for success.";

      setTimeout(() => {
        setConversationArr((prev) => [...prev, new Conversation("bot", ans)]);
      }, 1000);
    }
    setTimeout(() => {
      setDemoSteps([false, false, false, true]);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    scrollToBottom();
  }, [renderedConversation]);

  return (
    <div className="w-full h-[100vh]">
      <div className="w-full h-[100vh] absolute flex flex-col justify-between z-0">
        <div className="drop_shadow w-full flex items-center">
          <Popover
            placement="right"
            content={
              <div className="w-[400px]">
                Good job, you've completed the demo. Thanks for trying out
                UniGPT! Click here to go back to the start page.
              </div>
            }
            visible={demoSteps[3]}
          >
            <button className="m-2" onClick={() => navigate("/")}>
              <IoIosArrowDropleftCircle
                className={`fill-black text-[30px] ${
                  demoSteps[3] ? `animate-pulse` : ``
                }`}
              />
            </button>
          </Popover>
          <h6 className="text-2xl font-bold text-black text-center flex-grow">
            UniGPT
          </h6>
        </div>
        <Modal
          visible={demoSteps[0]}
          closable={false}
          footer={[
            <Button
              key={"footer"}
              className="bg-black text-white border-white animate-pulse border-none hover:text-white focus:text-white "
              style={{ color: "white" }}
              onClick={handleStartDemo}
            >
              Start Demo
            </Button>,
          ]}
        >
          <p>
            Welcome to UniGPT – Your virtual assistant designed to answer all
            your questions about the University of Waterloo! Want to try it out?
            Engage with the demo and let UniGPT guide you through the process!
          </p>
        </Modal>
        {showPrompts ? (
          <DemoPrompts
            setDemoSteps={setDemoSteps}
            demoSteps={demoSteps}
            setInputValue={setInputValue}
          />
        ) : (
          <div className="overflow-scroll flex item-start flex-col h-full">
            {renderedConversation}
            <div ref={bottomEl}></div>
          </div>
        )}
        <div className="flex flex-row w-full mb-[10px] items-center justify-center gap-4 mt-2">
          <form onSubmit={queryQuestion} className="w-[500px] drop_shadow">
            <label>
              <input
                className="border-[2px] rounded-lg mx-4 py-1 px-4 h-[50px] w-full"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder={
                  isLoading ? "Loading..." : "What is University of Waterloo?"
                }
                disabled={true}
              ></input>
            </label>
          </form>
          <form onSubmit={queryQuestion}>
            {!demoSteps[3] && (
              <button
                className="bg-[#101625] w-[50px] m-2 h-[50px] text-white text-center items-center text-sm rounded-lg drop_shadow flex flex-col justify-center relative"
                type="submit"
                disabled={demoSteps[1]}
              >
                {isLoading ? (
                  <CircularProgress color="inherit" size={40} />
                ) : (
                  <Popover
                    content={
                      "Great! Now click this button to send it to the chatbot"
                    }
                    visible={demoSteps[2]}
                  >
                    <RiArrowUpCircleFill
                      className={`text-[35px] mx-auto ${
                        demoSteps[2] && "animate-pulse"
                      }`}
                    />
                  </Popover>
                )}
              </button>
            )}
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
