import React, { useState } from "react"
import EmployeeRepository from "../../repositories/EmployeeRepository";
import "./EmployeeForm.css"
import LocationRepository from "../../repositories/LocationRepository"
import {useEffect} from "react"
import { useHistory } from "react-router-dom"




export default (props) => {
    const [employee, updateEmployee] = useState({})
    const [locations, defineLocations] = useState([])


    useEffect(() => {
        LocationRepository.getAll()
        .then((res)=>{
            defineLocations(res)
        })
    }, [])

    
    
    const history = useHistory()
    
    const constructNewEmployee = () => {
        if (employee.locationId === 0) {
            window.alert("Please select a location")
        } else {
            EmployeeRepository.addEmployee({
                name: employee.name,
                employee: true,
                email: employee.email
            })
            .then(data => {
                
                EmployeeRepository.assignEmployee({
                    userId: data.id,
                    locationId: parseInt(employee.locationId)
                })
            })
            .then(() => history.push("/employees"))
        }
    }

    const handleUserInput = (event) => {
        const copy = {...employee}
        copy[event.target.id] = event.target.value
        updateEmployee(copy)
    }


    return (
        <>
            <form className="employeeForm">
                <h2 className="employeeForm__title">New Employee</h2>
                <div className="form-group">
                    <label htmlFor="employeeName">Employee name</label>
                    <input id="name" onChange={handleUserInput}
                        type="text"
                        required
                        autoFocus
                        className="form-control"
                        placeholder="Employee name"
                    />
                </div>



                
                <div className="form-group">
                    <label htmlFor="email">Employee Email</label>
                    <input id="email" onChange={handleUserInput}
                        type="text"
                        required
                        autoFocus
                        className="form-control"
                        placeholder="Employee name"
                    />
                </div>




                <div className="form-group" >
                    <label htmlFor="location">Assign to location</label>
                    <select id="locationId" onChange={handleUserInput}
                        defaultValue=""
                        name="location"
                        className="form-control"
                    >
                        <option key="location--0" value="0">Select a location</option>
                        {locations.map(e => (
                            <option key={e.id} value={e.id}>
                                {e.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit"
                    onClick={
                        evt => {
                            evt.preventDefault()
                            constructNewEmployee()
                        }
                    }
                    className="btn btn-primary"> Save Employee </button>
            </form>
        </>
    )
}
