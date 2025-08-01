import React from 'react'
import { createContext ,useState} from 'react'

export const Sharedcontext=createContext()

const Context = ({children}) => {
    
    const room_items = [{
                room_name: "",
                room_id: "",
                no_of_racks: "",
                columns_rack: "",
                location: ""
            }]
    
            const [spareitems, setspareitems] = useState(room_items)
           
   
  return (
    <Sharedcontext.Provider value={{spareitems, setspareitems}}>{children}</Sharedcontext.Provider>
  )
}

export default Context