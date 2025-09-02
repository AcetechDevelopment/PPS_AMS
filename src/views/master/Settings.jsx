import { CCardHeader, CCardTitle, CTableHeaderCell, CCard, CCardBody, CFormLabel, CTable, CTableRow, CTableHead } from '@coreui/react'
import React, { useEffect } from 'react'
import Select from "react-select";
import { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { checkPropTypes } from 'prop-types';
const Settings = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const BASE = import.meta.env.VITE_BASE_URL;
    const ReactSwal = withReactContent(Swal);
    const authToken = JSON.parse(sessionStorage.getItem('authToken')) || '';
    const [allmenus, setallmenus] = useState([])
    const [selectedrole, setselectedrole] = useState("")
    const [isselectrole, setisselectrole] = useState(false)
    const fetchmenus = async () => {
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

    useEffect(() => { fetchmenus() }, [selectedrole])

    const roleOptions = [
        { value: "admin", label: "Admin" },
        { value: "manager", label: "Manager" },
        { value: "technician", label: "Technician" },
        { value: "user", label: "User" },
    ];
    const [checkedItems, setCheckedItems] = useState([]);

    //how much rowspan should heading occupy..menus children
    const getHeadingRowSpan = (heading) => {
        if (!heading.children) return 1;
        return heading.children.reduce((sum, menu) => {
            return sum + (menu.children?.length || 1);
        }, 0);
    };

    const handleSelectRole = (selectedOption) => {
        setselectedrole(selectedOption);
        setisselectrole(true)
    };

    const handlecheckbox = (name, isChecked) => {

       setCheckedItems((pre)=>(pre.map((item2.children?.map((item3.children?.map((item4)=>(ischecked?)))))))
    }

    useEffect(() => { console.log(checkedItems) }, [checkedItems])
    return (
        <div>
            <CCard>
                <CCardHeader>
                    <CCardTitle>Roles and Privileges</CCardTitle>
                </CCardHeader>
                <CCardBody>
                    <CFormLabel className='fw-bold'>Select Role</CFormLabel>
                    <Select options={roleOptions}
                        className="w-25 mb-3"
                        value={selectedrole}
                        onChange={handleSelectRole}
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
                                    {/* <th>View</th>
                                    <th>Create</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                    <th>Print</th> */}
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
                                                        <p>{<span style={{ marginRight: ".3rem" }}>
                                                            <td>
                                                                <input type="checkbox"

                                                                    checked={checkedItems.includes(item.name)}
                                                                    onChange={(e) => { handlecheckbox(item.name, e.target.checked) }}
                                                                    style={{ transform: "scale(1.5)" }} />
                                                            </td>
                                                        </span>}{item.name} </p>
                                                    </td>
                                                )}

                                                {/* Menu: only once per menu, top-aligned */}
                                                {sIdx === 0 && (
                                                    <td
                                                        rowSpan={mSpan}
                                                        style={{ color: "red", fontWeight: 700, verticalAlign: "top" }}
                                                    >
                                                        <p>{menu && <span style={{ marginRight: ".3rem" }}> <td>
                                                            < input type="checkbox"
                                                                checked={checkedItems}
                                                                onChange={(e) => { handlecheckbox(menu.name, e.target.checked) }}
                                                                style={{ transform: "scale(1.5)" }} /></td></span>}{menu.name}</p>
                                                    </td>
                                                )}

                                                {/* Sub Menu (may be empty if no children) */}
                                                <td style={{ color: "green", fontWeight: 700 }}>
                                                    <p>{sub && <span style={{ marginRight: ".3rem" }}> 
                                                        <td><input type="checkbox" 
                                                        checked={checkedItems.includes(sub.name)}
                                                                     onChange={(e) => { handlecheckbox(sub.name, e.target.checked) }}
                                                         style={{ transform: "scale(1.5)" }} /></td></span>}{sub ? sub.name : ""}</p>
                                                </td>

                                                {/* Actions */}
                                                {/* <td><input type="checkbox" defaultChecked style={{ transform: "scale(1.5)" }} /></td>
                                                <td><input type="checkbox" defaultChecked style={{ transform: "scale(1.5)" }} /></td>
                                                <td><input type="checkbox" defaultChecked style={{ transform: "scale(1.5)" }} /></td>
                                                <td><input type="checkbox" defaultChecked style={{ transform: "scale(1.5)" }} /></td>
                                                <td><input type="checkbox" defaultChecked style={{ transform: "scale(1.5)" }} /></td> */}
                                            </tr>
                                        ));
                                    });
                                })}
                            </tbody>


                        </table>

                    }



                </CCardBody>
            </CCard>

        </div>
    )
}

export default Settings
