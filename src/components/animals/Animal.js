import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router";
import AnimalRepository from "../../repositories/AnimalRepository";
import AnimalOwnerRepository from "../../repositories/AnimalOwnerRepository";
import OwnerRepository from "../../repositories/OwnerRepository";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import useResourceResolver from "../../hooks/resource/useResourceResolver";
import {AddTreatment} from "./AnimalTreatmentForm";
import "./AnimalCard.css"
import EmployeeRepository from "../../repositories/EmployeeRepository";

export const Animal = ({ animal, syncAnimals,
    showTreatmentHistory, owners }) => {
    const [detailsOpen, setDetailsOpen] = useState(false)
    const [isEmployee, setAuth] = useState(false)
    const [myOwners, setPeople] = useState([])
    const [allOwners, registerOwners] = useState([])
    const [classes, defineClasses] = useState("card animal")
    const [allEmployees, setAllEmployees] = useState([])


    const { getCurrentUser } = useSimpleAuth()
    const history = useHistory()
    const { animalId } = useParams()
    const { resolveResource, resource: currentAnimal } = useResourceResolver()

    useEffect(() => {
        setAuth(getCurrentUser().employee)
        resolveResource(animal, animalId, AnimalRepository.get)
        syncEmployees()
    }, [])




    useEffect(() => {
        if (owners) {
            registerOwners(owners)
        }
    }, [owners])

    const syncEmployees = () => {
        return EmployeeRepository.getAll()
            .then(setAllEmployees)
    }


    const getPeople = () => {
        return AnimalOwnerRepository
            .getOwnersByAnimal(currentAnimal.id)
            .then(people => setPeople(people))
    }

    const assignNewOwner = (event) => {
        return AnimalOwnerRepository
            .assignOwner(currentAnimal.id, parseInt(event.target.value))
            .then(syncAnimals)

    }

    const filterEmployees = () => {
        let employeeArray = []
        for (const employee of allEmployees) {
            for (const location of employee.employeeLocations) {
                if (location.locationId === currentAnimal.locationId) {

                    employeeArray.push(employee)
                }
            }
        }
        return employeeArray
    }

    const assignCareTaker = (event) => {
        return EmployeeRepository
            .assignCareTaker(currentAnimal.id, parseInt(event.target.value))
            .then(syncAnimals)
    }

    const careTakerJsx = () => {
        const anmCareTaker = animal.animalCaretakers
        const newAnimalCareTaker = []
        for (const anmCareTakerObj of anmCareTaker) {
            if (newAnimalCareTaker.length === 0) {
                newAnimalCareTaker.push(anmCareTakerObj)
            } else {
                const careTakerObj = newAnimalCareTaker.find(animal => {
                    return anmCareTakerObj.userId === animal.userId
                })
                if (careTakerObj) {

                } else {
                    newAnimalCareTaker.push(anmCareTakerObj)

                }
            }
        }

            return newAnimalCareTaker
        
    }


        useEffect(() => {
            getPeople()
        }, [currentAnimal])

        useEffect(() => {
            if (animalId) {
                defineClasses("card animal--single")
                setDetailsOpen(true)

                AnimalOwnerRepository.getOwnersByAnimal(animalId).then(d => setPeople(d))
                    .then(() => {
                        OwnerRepository.getAllCustomers().then(registerOwners)
                    })
            }
        }, [animalId])

        return (
            <>
                <li className={classes}>
                    <div className="card-body">
                        <div className="animal__header">
                            <h5 className="card-title">
                                <button className="link--card btn btn-link"
                                    style={{
                                        cursor: "pointer",
                                        "textDecoration": "underline",
                                        "color": "rgb(94, 78, 196)"
                                    }}
                                    onClick={() => {
                                        if (isEmployee) {
                                            showTreatmentHistory(currentAnimal)
                                        }
                                        else {
                                            history.push(`/animals/${currentAnimal.id}`)
                                        }
                                    }}> {currentAnimal.name} </button>
                            </h5>
                            <span className="card-text small">{currentAnimal.breed}</span>
                        </div>

                        <details open={detailsOpen}>
                            <summary className="smaller">
                                <meter min="0" max="100" value={Math.random() * 100} low="25" high="75" optimum="100"></meter>
                            </summary>


                            <section>
                                <h6>Caretaker(s)</h6>
                                <span className="small">

                                    {careTakerJsx().map(u => u.user.name).join(" & ")}


                                </span>

                                {
                                    isEmployee
                                        ? <select defaultValue=""
                                            name="caretaker"
                                            className="form-control small"
                                            onChange={(event) => { assignCareTaker(event) }} >
                                            <option value="">
                                                Select {animal.animalCaretakers?.length >= 1 ? "another" : "a"} caretaker
                                            </option>
                                            {
                                                filterEmployees().map(o => <option key={o.id} value={o.id}>{o.name}</option>)
                                            }
                                        </select>
                                        : null
                                }

                                <h6>Owners</h6>
                                <span className="small">
                                    {animal.animalOwners?.map(u => u.user.name).join(" & ")}
                                </span>
                                {console.log("owners arrays below")}

                                {
                                    animal.animalOwners?.length < 2
                                        ? <select defaultValue=""
                                            name="owner"
                                            className="form-control small"
                                            onChange={(event) => { assignNewOwner(event) }} >
                                            <option value="">
                                                Select {animal.animalOwners?.length === 1 ? "another" : "an"} owner
                                            </option>
                                            {
                                                allOwners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)
                                            }
                                        </select>
                                        : null
                                }


                                {
                                    detailsOpen && "treatments" in currentAnimal
                                        ? <div className="small">
                                            <h6>Treatment History</h6>
                                            {
                                                currentAnimal.treatments.map(t => (
                                                    <div key={t.id}>
                                                        <p style={{ fontWeight: "bolder", color: "grey" }}>
                                                            {new Date(t.timestamp).toLocaleString("en-US")}
                                                        </p>
                                                        <p>{t.description}</p>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        : ""
                                }

                            </section>

                            {
                                isEmployee
                                    ? <button className="btn btn-warning mt-3 form-control small" onClick={() =>
                                        AnimalOwnerRepository
                                            .removeOwnersAndCaretakers(currentAnimal.id)
                                            .then(() => { }) // Remove animal
                                            .then(() => { }) // Get all animals
                                    }>Discharge</button>
                                    : ""
                            }

                        


                        {
                        isEmployee
                            ? <button id="treatmentBtn"
                             className="btn btn-warning mt-3 form-control small"
                             onClick={() => {history.push(`/animals/${currentAnimal.id}/newTreatment`)}}
                            >New Treatment</button> : null
                            }

                    </details>
                </div>
            </li>
        </>
    )
}
