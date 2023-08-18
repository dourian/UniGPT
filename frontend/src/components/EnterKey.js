import React, { useState, useContext } from "react";
import { BackendContext } from "../BackendProvider";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

export default function EnterKey() {
    const {setApiKey} = useContext(BackendContext)
    const [apikey, setKey] = useState("")
    const notify = (message) => toast(message);
    
    const handleInputChange = (event) => {
        setKey(event.target.value)
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        let status = await setApiKey(apikey)
        console.log(status)
        if (status === "failure") {
            notify("openai key is valid and works! woohoo!")
        } else {
            notify("try another key!")
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <ToastContainer />
            <input
                className="border-[2px] rounded-lg mx-4 py-1 px-4 h-[50px] w-full"
                type="text"
                value={apikey}
                onChange={handleInputChange}
              ></input>
        </form>
    )
}
