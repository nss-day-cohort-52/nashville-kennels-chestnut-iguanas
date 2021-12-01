import React, { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import EmployeeRepository from "../../repositories/EmployeeRepository";
import useResourceResolver from "../../hooks/resource/useResourceResolver";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import person from "./person.png"
import "./Employee.css"
import { useHistory } from "react-router-dom"


export default ({ employee }) => {
    const [animalCount, setCount] = useState(0)
    const [location, markLocation] = useState({ name: "" })
    const [classes, defineClasses] = useState("card employee")
    const { employeeId } = useParams()
    const { getCurrentUser } = useSimpleAuth()
    const { resolveResource, resource } = useResourceResolver()
    const [isEmployee, setAuth] = useState(false)
    const history = useHistory()

    useEffect(() => {
        if (employeeId) {
            defineClasses("card employee--single")
        }
        setAuth(getCurrentUser().employee)
        resolveResource(employee, employeeId, EmployeeRepository.get)
        
    }, [])

    useEffect(() => {
        if (resource?.employeeLocations?.length > 0) {
            markLocation(resource.employeeLocations[0])
        }
    }, [resource])



    return (
        <article className={classes}>
            <section className="card-body">
                <img alt="Kennel employee icon" src={person} className="icon--person" />
                <h5 className="card-title">
                    {
                        employeeId
                            ? resource.name
                            : <Link className="card-link"
                                to={{
                                    pathname: `/employees/${resource.id}`,
                                    state: { employee: resource }
                                }}>
                                {resource.name}
                                
                            </Link>

                    }
                </h5>
                {
                    employeeId
                        ? <>
                            <section>
                            Caring for {resource.animals?.length || 0} animals
                            </section>
                            <section>
                            Working at {resource.locations?.map((each)=>{
                                return <div key={each.location.id}> {each.location.name}</div>
                            })}
                            </section>
                        </>
                        : ""
                }

                { isEmployee? 
                    <button className="btn--fireEmployee" onClick={() => {
                        EmployeeRepository.delete(parseInt(employeeId))
                        EmployeeRepository.delete(parseInt(resource.id))
                        .then(history.push("/employees"))
                    }}>Fire</button> : ""
                }

            </section>

        </article>
    )
}
