import React, { useState, useContext, useEffect } from "react"
import "./AnimalForm.css"
import AnimalRepository from "../../repositories/AnimalRepository";
import EmployeeRepository from "../../repositories/EmployeeRepository";

export default (props) => {
    const [animalName, setName] = useState("")
    const [breed, setBreed] = useState("")
    const [animals, setAnimals] = useState([])
    const [employees, setEmployees] = useState([])
    const [employeeId, setEmployeeId] = useState(0)
    const [saveEnabled, setEnabled] = useState(false)
    const [animallocation, setlocation] = useState("")

    useEffect(() => {
        EmployeeRepository.getAll()
            .then((res) => {
                setEmployees(res)
            })
    }, [])


    const constructNewAnimal = evt => {
        evt.preventDefault()
        const eId = parseInt(employeeId)

        if (eId === 0) {
            window.alert("Please select a caretaker")
        } else {
            const emp = employees.find(e => e.id === eId)
            const animal = {
                name: animalName,
                breed: breed,
                employeeId: eId,
                locationId: parseInt(animallocation)
            }

            AnimalRepository.addAnimal(animal)
                .then(() => setEnabled(true))
                .then(() => props.history.push("/animals"))
        }
    }

    const chosenemployee = () => {
        const employeechosen = employees.filter(e => {
            return e.id === parseInt(employeeId)
        })

        const locationarray = employeechosen[0].employeeLocations
        return locationarray
    }



    return (
        <form className="animalForm">
            <h2>Admit Animal to a Kennel</h2>
            <div className="form-group">
                <label htmlFor="animalName">Animal name</label>
                <input
                    type="text"
                    required
                    autoFocus
                    className="form-control"
                    onChange={e => setName(e.target.value)}
                    id="animalName"
                    placeholder="Animal name"
                />
            </div>
            <div className="form-group">
                <label htmlFor="breed">Breed</label>
                <input
                    type="text"
                    required
                    className="form-control"
                    onChange={e => setBreed(e.target.value)}
                    id="breed"
                    placeholder="Breed"
                />
            </div>
            <div className="form-group">
                <label htmlFor="employee">Make appointment with caretaker</label>
                <select
                    defaultValue=""
                    name="employee"
                    id="employeeId"
                    className="form-control"
                    onChange={e => setEmployeeId(e.target.value)}
                >
                    <option value="">Select an employee</option>
                    {employees.map(e => (
                        e.employee ?
                            <option key={e.id} id={e.id} value={e.id}>
                                {e.name}
                            </option> :
                            ""
                    ))}

                </select>
            </div>
            {employeeId ?
                <div className="form-group">
                    <label htmlFor="employee">Choose a location </label>
                    <select
                        defaultValue=""
                        name="employee"
                        id="employeeId"
                        className="form-control"
                        onChange={e => setlocation(e.target.id)}
                    >
                        <option value="">Select a location</option>
                        {
                            chosenemployee().map((locate) => {
                                return <option key={locate.id} id={locate.id} value={locate.locationId}>{locate.locationId === 1? "Nashville North": "Nashville South"} </option>
                            })
                        }
                    </select>
                </div> : ""}

            <button type="submit"
                onClick={constructNewAnimal}
                disabled={saveEnabled}
                className="btn btn-primary"> Submit </button>
        </form>
    )
}
