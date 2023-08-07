import { CiDark } from "react-icons/ci";
import { IoSunnyOutline } from "react-icons/io5";
import React from "react";

function DarkModeToggle({ isDark, setIsDark }) {
  return (
    <button className = "p-4 absolute top-0 left-0" onClick={() => setIsDark(!isDark)}>
      {isDark ? <IoSunnyOutline size={25}/> : <CiDark size={25}/>}
    </button>
  );
}
export default DarkModeToggle;
