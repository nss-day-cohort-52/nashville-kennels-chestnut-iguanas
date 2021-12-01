
import React, { useState, useContext, useEffect } from "react"
import AnimalRepository from "../../repositories/AnimalRepository";



export const AddTreatment = () => {
    const [animalTreatment, setTreatment] = useState([])



useEffect(() => {
    EmployeeRepository.getAll()
        .then((res) => {
            setEmployees(res)
        })
}, [])


const newTreatment = evt => {
    evt.preventDefault()
    const eId = parseInt(employeeId)

    if (eId === 0) {
        window.alert("Please select a caretaker")
    } else {
        
        const animalTreatment = {
            animalId: animal.,
            timestamp: 1634687829221,
            description: 
        }

        AnimalRepository.addAnimal(animal)
            .then(() => setEnabled(true))
            .then(() => props.history.push("/animals"))
    }
}
}

<form className="animalTreatmentForm">
<h2>New Treatment</h2>
<div className="form-group">
    <label htmlFor="animalName">Animal name</label>
    <input
        type="text"
        required
        autoFocus
        className="form-control"
        onChange={e => setTreatment(e.target.value)}
        id="animalTreatment"
        placeholder="Type Treatment Here"
    />
</div>
</form>