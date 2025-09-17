import { data } from 'autoprefixer';
import React from 'react'
import { createContext, useState } from 'react'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

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
  // const[role_selected,setroleSelected
  // ] =useState (0)
  const BASE = import.meta.env.VITE_BASE_URL;
  const authToken = JSON.parse(sessionStorage.getItem('authToken')) || '';


  const ReactSwal = withReactContent(Swal);
  const [action_details, setactiondetails] = useState({})
  const fetchActionDetails = async (pageName) => {
    console.log("fetch")
    try {
      const response = await fetch(`${BASE}permission/lists/${roleId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        console.log("fetching")
        console.log(response)
        const data = await response.json();
        let founditem = null
        const findrecursively = (nodes) => {
          for (let node of nodes) {
            if (node.to && node.to.replace("/", "") === pageName) // compare with path
            {
              return node
            }
            if (node.children) {
              const child = findrecursively(node.children)
              if (child) {
                return child
              }
            }
          }
          return null
        }
        founditem = findrecursively(data)
        console.log(founditem)
        console.log(founditem?.isView)
        setactiondetails(founditem)

      } else {
        const error = await response.json();
        ReactSwal.fire({
          title: 'Error',
          text: error.message || 'Unable to reach user data',
          icon: 'error',
        });
      }
    } catch (err) {
      console.error('Error:', err);
      ReactSwal.fire({
        title: 'Error',
        text: 'Failed to connect to the server. Please try again later.',
        icon: 'error',
      });
    }
  }
  const [roleId, setroleId] = useState(() => {
    const encodedRoleId = sessionStorage.getItem("RoleId");
    return encodedRoleId ? JSON.parse(atob(encodedRoleId)) : 0

  })
  return (
    <Sharedcontext.Provider value={{ isNumberKey, roleId, setroleId, fetchActionDetails, action_details }}>{children}</Sharedcontext.Provider>
  )
}

export default Context