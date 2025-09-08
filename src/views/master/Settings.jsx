import { CCardHeader, CCardTitle, CTableHeaderCell, CCard, CCardBody, CFormLabel, CTable, CTableRow, CTableHead, CButton } from '@coreui/react'
import React, { useEffect } from 'react'
import Select from "react-select";
import { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { toast } from 'react-toastify';


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
    const [isview, setisview] = useState(false)
    const [updated_menus, setupdated_menus] = useState([])

   




    const fetchmenus = async () => {
        console.log("fetch")
        try {
            const response = await fetch(`${BASE}permission/lists/${selectedrole}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data)
                setallmenus(data)

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



    const handlesubmit = async () => {
        const updated_menus = collectupdatedmenus(allmenus)
        setupdated_menus(updated_menus)
        console.log(updated_menus)
        const payload = {
            permissions: updated_menus,
            role_id: selectedrole,

        };
        console.log(payload)
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

    function collectupdatedmenus(allmenus, result = []) {
        allmenus.forEach((heading) => (heading.children?.map((menu) => menu.children ? (menu.children.forEach((submenu) => {
            if (submenu.isView || submenu.isEdit || submenu.isDelete || submenu.isPrint) {
                result.push({
                    main_menu_ids: submenu.id,
                    isView: !!submenu.isView,
                    isEdit: !!submenu.isEdit,
                    isDelete: !!submenu.isDelete,
                    isPrint: !!submenu.isPrint
                })

            }
        }))
            : ((menu.isView || menu.isEdit || menu.isDelete || menu.isPrint) &&
                result.push({
                    main_menu_ids: menu.id,
                    isView: !!menu.isView,
                    isEdit: !!menu.isEdit,
                    isDelete: !!menu.isDelete,
                    isPrint: !!menu.isPrint
                })
            )

        )
        ))
        return result
    }

    const updateview = (all_menus, targetId, checked, key) => {
        return all_menus.map((menu) => {
            if (menu.id === targetId) {
                return { ...menu, [key]: checked }
            }
            if (menu.children) {
                return {
                    ...menu,
                    children: updateview(menu.children, targetId, checked, key)
                }
            }
            return menu
        })

    }

    useEffect(() => {
        handlesubmit()

    }, [allmenus])

    // const handleview = (e, sub) => {
    //     const { name, checked } = e.target

    //     // console.log(sub?.isView)
    //     // console.log(sub?.id)
    //     // console.log(e.target)

    //     setallmenus((prev) => updateview(prev, sub?.id, checked))


    // }
    // console.log(allmenus)

    const handlePermissionChange = (e, targetId, action) => {
        const { checked } = e.target
        setallmenus((prev) => updateview(prev, targetId, checked, action))
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
                                                        {item.name}
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

                                                <td style={{ color: "green", fontWeight: 700 }}>
                                                    {sub?.name || ""}
                                                </td>

                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        style={{ transform: "scale(1.3)" }}
                                                        checked={sub?sub.isView:menu.isView}
                                                        onChange={(e) => { handlePermissionChange(e, sub?sub.id:menu.id, "isView") }}
                                                    />
                                                </td>

                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        style={{ transform: "scale(1.3)" }}
                                                        checked={sub?sub.isEdit:menu.isEdit}
                                                        onChange={(e) => { handlePermissionChange(e, sub?sub.id:menu.id, "isEdit") }}
                                                    />
                                                </td>

                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        style={{ transform: "scale(1.3)" }}
                                                        checked={sub?sub.isDelete:menu.isDelete}
                                                        onChange={(e) => { handlePermissionChange(e, sub?sub.id:menu.id, "isDelete") }}
                                                    />
                                                </td>

                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        style={{ transform: "scale(1.3)" }}
                                                        checked={sub?sub.isPrint:menu.isPrint}
                                                        onChange={(e) => { handlePermissionChange(e, sub?sub.id:menu.id, "isPrint") }}
                                                    />
                                                </td>
                                                {/* Sub Menu (may be empty if no children) */}
                                                {/* <p>{sub && <span style={{ marginRight: ".3rem" }}>
                                                        <input type="checkbox"
                                                            checked={sub.isChecked}
                                                            ref={el => { if (el) el.indeterminate = sub.indeterminate }}
                                                            onChange={() => { handlecheckbox(sub) }}
                                                            style={{ transform: "scale(1.5)" }} /></span>}{sub ? sub.name : ""}</p> */}
                                                {/* 
                                                <td style={{ color: "green", fontWeight: 700 }}>

                                                    <p>{sub ? sub.name : ""}
                                                        <td>
                                                            <input type="checkbox"
                                                                style={{ transform: "scale(1.5)" }}
                                                                onChange={(e) => handleview(e, sub)}
                                                                checked={sub?.isview} />
                                                        </td>

                                                        <td>
                                                            <input type="checkbox" style={{ transform: "scale(1.5)" }}
                                                                onChange={(e) => handleedit(e,sub)} />
                                                        </td>

                                                         <td><input type="checkbox" style={{ transform: "scale(1.5)" }} 
                                                         onChange={() => handledelete()} /></td>

                                                         <td><input type="checkbox" style={{ transform: "scale(1.5)" }}
                                                          onChange={() => handlePrint()} /></td>
                                                    </p>

                                                </td>
                                                Actions  */}






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
