
import React, { useState, useEffect } from "react"
import AnimalTreatmentRepository from "../../repositories/AnimalTreatmentRepository"
import { useHistory, useParams } from "react-router-dom"
import useResourceResolver from "../../hooks/resource/useResourceResolver";
import {Link} from "react-router-dom"


export const AddTreatment = ({ animal }) => {
    const [animals, petAnimals] = useState([])
    const [animalTreatment, setTreatment] = useState("")
    const history = useHistory()
    const { animalId } = useParams()
    const { resolveResource, resource: currentAnimal } = useResourceResolver()


    const syncAnimals = () => {
        AnimalTreatmentRepository.getAll().then(data => petAnimals(data))
    }

    useEffect(() => {
        syncAnimals()
    }, [])

    useEffect(() => {
        resolveResource(animal, animalId, AnimalTreatmentRepository.get)
    }, [])

    const newTreatment = () => {
        

        const treatmentObj = {
            animalId: currentAnimal.id,
            timestamp: new Date().toLocaleString("en-US"),
            description: animalTreatment
        }
        return AnimalTreatmentRepository
        .addTreatment(treatmentObj)
    }

    return (
        <>
                    {console.log(currentAnimal)}
            <form className="animalTreatmentForm">
                <h2>New Treatment</h2>
                <div>
                    <label htmlFor="animalTreatment">Treatment for {currentAnimal.name} </label>
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
                <Link to={"/animals"}> <button id="submitTreatmentBtn"
                    className="btn btn-warning mt-3 form-control small"
                    onClick={() => {
                        newTreatment()
                    }}
                    
                >Submit</button></Link>
            </form>
        </>
    )
}