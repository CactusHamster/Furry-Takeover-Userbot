const random = (max) =>  Math.floor(Math.random() * max)

let Species: Array<string> = [
    "fox",
    "doggo",
    "dragon",
    "foxxo",
    "cat",
    "kitten",
    "axolotl",
    "wolf",
    "tiger",
    "crow",
    "macaw",
    "lion",
    "keidran"
]

let Names: Array<Function | string> = [
    "Bluebell",
    "Periwinkle",
    "Biscuit",
    "Kitty",
    "Jade",
    "Fluffy",
    "Rowan",
    "Remy",
    "Kit",
    "Sawyer",
    "Azriel",
    "Ash",
    "Avery",
    "Finley",
    "Artemis",
    "Wren",
    "Ira"
]

function capitalize (string): string {
    return string.split(" ").map((str: string) => str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase()).join(" ")
}

export default function generateName (index) {
    let species = Species[random(Species.length)]
    let name = Names[index % Names.length]
    if (name instanceof Function) name = name()
    species = capitalize(species)
    name = capitalize(name)
    return `${name} the ${species}`
}