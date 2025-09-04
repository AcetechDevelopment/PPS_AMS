import { CCardHeader, CCardTitle, CTableHeaderCell, CCard, CCardBody, CFormLabel, CTable, CTableRow, CTableHead, CButton } from '@coreui/react'
import React, { useEffect } from 'react'
import Select from "react-select";
import { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


const Settings = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const BASE = import.meta.env.VITE_BASE_URL;
    const ReactSwal = withReactContent(Swal);
    const authToken = JSON.parse(sessionStorage.getItem('authToken')) || '';
    const [allmenus, setallmenus] = useState([])
    const [checkedlist, setcheckedlist] = useState([])
    const [roleoptions, setroleoptions] = useState([])
    const [selectedrole, setselectedrole] = useState(null)
    const [isselectrole, setisselectrole] = useState(false)

    const initNodes = (nodes = []) =>
        nodes.map((n) => ({
            ...n,
            isChecked: !!n.isChecked,
            indeterminate: !!n.indeterminate,
            children: n.children ? initNodes(n.children) : undefined,
        }));




    const fetchmenus = async () => {
        console.log("fetch")
        try {
            const response = await fetch(`${BASE}permission/lists`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data)
                setallmenus(initNodes(data))

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
    const getrolelist = async () => {
        console.log("getrolelist")
        try {
            const response = await fetch(`${BASE}permission/role`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                }
            })
            if (response.ok) {
                const result = await response.json();
                //  console.log(result.roles)
                const datas = result?.map(item => ({
                    value: item.role_id,
                    label: item.name
                }));
                setroleoptions(datas)
            }


            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
        }
        catch (err) {
            console.error('Error:', err);
            ReactSwal.fire({
                title: 'Error',
                text: 'Failed to connect to the server. Please try again later.',
                icon: 'error',
            });
        }

    }
    const handleselectrole = (selectedOption) => {
        setselectedrole(selectedOption?.value)
        setisselectrole(true)
    }

    console.log(roleoptions)
    useEffect(() => {
        getrolelist()
    }, [])

    useEffect(() => {
        fetchmenus()
        console.log(selectedrole)
    }, [selectedrole])


    const getHeadingRowSpan = (heading) => {
        if (!heading.children) return 1;
        return heading.children.reduce((sum, menu) => {
            return sum + (menu.children?.length || 1);
        }, 0);
    };



    const handlecheckbox = (clickeditem) => {
        setallmenus((allstate) => {
            const toggled = toggleNode(allstate, clickeditem)
            return updateparents(toggled)
        }

        )
        console.log(allmenus)
    }
    const toggleNode = (prev, clicked) => {
        return prev.map((heading) => {
            if (heading.id === clicked.id)
            //if heading is clicked
            {
                const newChecked = !heading.isChecked
                return {
                    ...heading,
                    isChecked: newChecked,
                    indeterminate: false,
                    //propagate change downward to all children
                    children: heading.children?.map((menu) =>
                        applyDownward(menu, newChecked)
                        //if it has children then call applyDownward(child,parent toggler)
                    )
                }
            }
            if (heading.children) {
                return { ...heading, children: toggleNode(heading.children, clicked) }
            }
            return heading
        })
    }


    const applyDownward = (node, checked) => ({
        ...node,
        isChecked: checked,
        indeterminate: false,
        children: node.children?.map((child) => applyDownward(child, checked)),

    })
    const updateparents = (nodes) => {
        return nodes?.map((node) => {
            if (node.children?.length) {
                const updatedChildren = updateparents(node.children);
                const allChecked = updatedChildren.every((c) => c.isChecked);
                const someChecked = updatedChildren.some((c) => c.isChecked || c.indeterminate);

                return {
                    ...node,
                    children: updatedChildren,
                    isChecked: allChecked,
                    indeterminate: !allChecked && someChecked,
                };
            }
            return node;
        });
    }

    const collectallids = (allmenus, visited = new Set()) => {
        let checked_items = []

        allmenus.forEach((node) => {
            if (visited.has(node.id)) return; // 🚫 prevent infinite loop
            visited.add(node.id);
            if (node.isChecked || node.indeterminate) {
                checked_items.push(node.id)
            }
            if (node.children) {
                checked_items = checked_items.concat(collectallids(node.children, visited))
            }
        }

        )
        return checked_items
    }

    // allmenus.map((prev)=>(prev.isChecked?checked_items.push(prev.id):[]))
    // allmenus.map((prev) => {
    //     prev.isChecked ? checked_items.push(prev.id) :
    //         prev.children?.map((menu) => menu.isChecked ? checked_items.push(prev.id, menu.id) :
    //             menu.children?.map((sub) => sub.isChecked ? checked_items.push(prev.id, menu.id, sub.id) : []))
    // })
    const handlesubmit = async () => {
        const array_list = collectallids(allmenus)
        console.log(array_list)
        const payload = {
            role_id: selectedrole,                // single integer
            main_menu_ids: array_list,    // array of integers
        };
        try {
            const response = await fetch(`${BASE}role/create`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer${authToken}`
                },
                body: JSON.stringify(payload)
            })
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const result = await response.json();
            console.log("Server response:", result);
            toast.success("Submitted successfully!");
        }
        catch (err) {
            console.error('Error:', err);
            ReactSwal.fire({
                title: 'Error',
                text: 'Failed to connect to the server. Please try again later.',
                icon: 'error',
            });
        }

    }

    // toggleNode → handles the clicked node + downward propagation.

    // applyDownward → applies parent’s state to children.

    // updateparents → recalculates parent’s state after children change.

    // setallmenus((pre)=>(pre.map((item)=>(item.id===heading.id?{...item,isChecked:!item.isChecked}:item))))
    //   setallmenus((prev)=>(prev.map((heading)=>(heading.id===clickeditem.id?{
    //     ...heading,
    //     isChecked:!heading.isChecked,
    //     children:heading.children?.map((menu)=>({
    //         ...menu,
    //         isChecked:!heading.isChecked,
    //         children:menu.children?.map((submenu)=>({
    //             ...submenu,
    //             isChecked:!heading.isChecked,

    //         }))}))}
    //   :{...heading,
    //     children:heading.children?.map((menu)=>(menu.id===clickeditem.id?{
    //     ...menu,
    //     isChecked:!menu.isChecked,
    //     children:menu.children?.map((submenu)=>({...submenu,
    //         isChecked:!menu.isChecked}
    //     ))
    //   }:{
    //     ...menu,children:menu.children?.map((submenu)=>(submenu.id===clickeditem.id?{...submenu,
    //         isChecked:!submenu.isChecked}:submenu))
    //   }))}))))

   const handleview=(e)=>{
      const{id,checked}=e.target
      console.log(checked)
      console.log(e)

   }

    return (
        <div>
            <CCard>
                <CCardHeader>
                    <CCardTitle>Roles and Privileges</CCardTitle>
                </CCardHeader>
                <CCardBody>
                    <CFormLabel className='fw-bold'>Select Role</CFormLabel>
                    <Select options={roleoptions}
                        className="w-25 mb-3"
                        value={roleoptions.find((item) => item.value === selectedrole)}
                        // onChange={(selectedOption) => (setselectedrole(selectedOption?.value))}
                        onChange={(selectedoption) => handleselectrole(selectedoption)}
                        placeholder="select role"
                    />

                    {isselectrole &&
                        <table className="table table-bordered">
                            <thead>
                                <tr style={{ background: "#5a646d", color: "#fff" }}>
                                    <th></th>
                                    <th colSpan={2} style={{ textAlign: "center" }}>Menu</th>
                                    {/* <th colSpan={5} style={{ textAlign: "center" }}>Action</th> */}
                                </tr>
                                <tr style={{ background: "#17a2b8", color: "#fff" }}>
                                    <th>Heading</th>
                                    <th>Main menu</th>
                                    <th>Sub Menu</th>
                                    <th>View</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                    <th>Print</th>
                                </tr>
                            </thead>

                            <tbody>
                                {allmenus.map((item, hIdx) => {
                                    const headingRowSpan = getHeadingRowSpan(item); // ✅ use item instead of heading

                                    return (item.children || []).flatMap((menu, mIdx) => {
                                        const submenus = menu.children && menu.children.length ? menu.children : [null];
                                        const mSpan = Math.max(submenus.length, 1);

                                        return submenus.map((sub, sIdx) => (
                                            <tr key={`${hIdx}-${mIdx}-${sIdx}`}>
                                                {/* Heading: only once per heading, top-aligned */}
                                                {mIdx === 0 && sIdx === 0 && (
                                                    <td
                                                        rowSpan={headingRowSpan}  // ✅ correct variable
                                                        style={{ color: "blue", fontWeight: 700, verticalAlign: "top" }}
                                                    >
                                                        {/* <p>{<span style={{ marginRight: ".3rem" }}>
                                                            <input type="checkbox"

                                                                checked={item.isChecked}
                                                                ref={el => { if (el) el.indeterminate = item.indeterminate }}
                                                                onChange={() => { handlecheckbox(item) }}
                                                                style={{ transform: "scale(1.5)" }} />

                                                        </span>}{item.name} </p> */}
                                                        <p>{item.name}</p>
                                                    </td>
                                                )}


                                                {/* Menu: only once per menu, top-aligned */}
                                                {sIdx === 0 && (
                                                    <td
                                                        rowSpan={mSpan}
                                                        style={{ color: "red", fontWeight: 700, verticalAlign: "top" }}
                                                    >
                                                        {/* <p>{menu && <span style={{ marginRight: ".3rem" }}>
                                                            < input type="checkbox"
                                                                checked={menu.isChecked}
                                                                ref={el => { if (el) el.indeterminate = menu.indeterminate }}
                                                                onChange={() => { handlecheckbox(menu) }}
                                                                style={{ transform: "scale(1.5)" }} /></span>}{menu.name}</p> */}
                                                        <p>{menu.name}</p>
                                                    </td>
                                                )}

                                                {/* Sub Menu (may be empty if no children) */}
                                                <td style={{ color: "green", fontWeight: 700 }}>
                                                    {/* <p>{sub && <span style={{ marginRight: ".3rem" }}>
                                                        <input type="checkbox"
                                                            checked={sub.isChecked}
                                                            ref={el => { if (el) el.indeterminate = sub.indeterminate }}
                                                            onChange={() => { handlecheckbox(sub) }}
                                                            style={{ transform: "scale(1.5)" }} /></span>}{sub ? sub.name : ""}</p> */}
                                                    <p>{sub ? sub.name : ""}</p>
                                                </td>

                                                {/* Actions  */}
                                                <td><input type="checkbox" style={{ transform: "scale(1.5)" }} onChange={(e)=>handleview(e)} /></td>
                                                <td><input type="checkbox" style={{ transform: "scale(1.5)" }} onChange={()=>handleedit()}/></td>
                                                <td><input type="checkbox" style={{ transform: "scale(1.5)" }} onChange={()=>handledelete()}/></td>
                                                <td><input type="checkbox" style={{ transform: "scale(1.5)" }} onChange={()=>handlePrint()}/></td>
                                                
                                            </tr>
                                        ));
                                    });
                                })}
                            </tbody>


                        </table>

                    }

                    {/* <div className="d-flex justify-content-end">
                        <CButton color="primary" variant="outline" onClick={handlesubmit}>Submit</CButton>
                    </div> */}

                </CCardBody>
            </CCard>

        </div>
    )
}

export default Settings
