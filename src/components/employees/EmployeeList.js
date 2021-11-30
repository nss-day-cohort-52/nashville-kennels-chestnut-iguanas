import React, { useState, useEffect } from "react"
import Employee from "./Employee"
import EmployeeRepository from "../../repositories/EmployeeRepository"
import "./EmployeeList.css"
import { Link } from "react-router-dom"
import { useHistory } from "react-router-dom"


export default () => {
    const [emps, setEmployees] = useState([])

    useEffect(
        () => {
            EmployeeRepository.getAll()
            .then((res)=>{
                setEmployees(res)
            })
        }, []
    )
const history = useHistory()
    return (
        <>
            <div className="employees">
                {
                    emps.map(a => <Employee key={a.id} employee={a} />)
                }
            </div>


            
            <button type="hire"
                    onClick={
                        evt => {
                            evt.preventDefault()
                            history.push("/employees/create")
                            // constructNewEmployee()
                        }
                    }
                    className="btn btn-primary"> New Employee </button>

            
        </>
    )
}


