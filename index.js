const express = require('express')
const app = express()


const persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const idnumber = Number(request.params.id)
    const person = persons.find(person=> person.id === idnumber)
    if (person)
    {
        response.json(person)
    }
    else{
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    let timenow = new Date()
    let info = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${timenow}</p>
    `
    response.send(info)
})

const PORT = 3001
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})