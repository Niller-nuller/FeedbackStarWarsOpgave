let entries = [
    {
    id: 1,
    name: "Luke Skywalker",
    role: "Jedi",
    planet: "Tatooine"
    }
]

let nextId = 2;

function getNextId() {
    return nextId++;
}

module.exports = {jedis: entries, getNextId};