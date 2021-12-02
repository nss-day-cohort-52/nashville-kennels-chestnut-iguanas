import Settings from "./Settings"
import { fetchIt } from "./Fetch"
import OwnerRepository from "./OwnerRepository"

const expandAnimalUser = (animal, users) => {
    animal.animalOwners = animal.animalOwners.map(ao => {
        ao.user = users.find(user => user.id === ao.userId)
        return ao
    })

    animal.animalCaretakers = animal.animalCaretakers.map(caretaker => {
        caretaker.user = users.find(user => user.id === caretaker.userId)
        return caretaker
    })

    return animal
}

export default {
    async get(id) {
        const users = await OwnerRepository.getAll()
        return await fetchIt(`${Settings.remoteURL}/animals/${id}?_embed=animalOwners&_embed=treatments&_embed=animalCaretakers`)
            .then(animal => {
                animal = expandAnimalUser(animal, users)
                return animal
            })
    },
    async getAll() {
        const users = await OwnerRepository.getAll()
        const animals = await fetchIt(`${Settings.remoteURL}/animals?_embed=animalOwners&_embed=treatments&_embed=animalCaretakers`)
            .then(data => {
                const embedded = data.map(animal => {
                    animal = expandAnimalUser(animal, users)
                    return animal
                })
                return embedded
            })
        return animals
    },
    async addTreatment(newTreatment) {
        return await fetchIt(
            `${Settings.remoteURL}/treatments`,
            "POST",
            JSON.stringify(newTreatment)
        )
    }
}
