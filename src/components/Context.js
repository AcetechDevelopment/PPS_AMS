import { data } from 'autoprefixer';
import React from 'react'
import { createContext ,useState} from 'react'

export const Sharedcontext=createContext()
export const typecheck=(data)=>{
  return /^[0-9]$/.test(data);
  
}

const Context = ({children}) => {
    
    
           
           
   
  return (
    <Sharedcontext.Provider value={{typecheck}}>{children}</Sharedcontext.Provider>
  )
}

export default Context