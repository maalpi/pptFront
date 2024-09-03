"use client";
import { useTheme } from "next-themes";
import React, {useState} from "react";
import { IoMoonSharp, IoSunnySharp } from "react-icons/io5";

import { Switch } from "@/components/ui/switch"

export default function DarkLightToggle() {

  const { theme, setTheme } = useTheme();

  const toggleTheme = () =>{
    if (theme === 'light'){
        setTheme('dark')
    }else {
        setTheme("light")
    }
  }
  return (
    <Switch
    onCheckedChange={toggleTheme}>
        
      {/* <button onClick={() => setTheme("dark")}><IoMoonSharp/></button>
      <button onClick={() => setTheme("light")}><IoSunnySharp/></button> */}
    </Switch>
  );
}