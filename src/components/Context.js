import { data } from 'autoprefixer';
import React from 'react'
import { createContext, useState } from 'react'

export const Sharedcontext = createContext()

const isNumberKey = (e) => {
  const char = e.key
  const allowedchars = "0123456789"
  const isAllowed = allowedchars.includes(char)
  const controlKeys = [
    "Backspace",
    "Delete",
    "ArrowLeft",
    "ArrowRight",
    "Tab"
  ];

  // Allow control keys
  if (controlKeys.includes(char)) return;

  // if(char==="." && e.target.value.includes('.'))
  //     return false
  if (!isAllowed)
    e.preventDefault()
}

const Context = ({ children }) => {
  const[role_selected,setroleSelected] =useState (0)
  return (
    <Sharedcontext.Provider value={{ isNumberKey,role_selected,setroleSelected}}>{children}</Sharedcontext.Provider>
  )
}

export default Context