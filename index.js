const express = require('express')
const morgan = require('morgan')
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
const cors = require('cors')
const app = express()
require('dotenv').config()
const Person = require('./models/person')

app
.use(express.static('dist'))
.use(cors())
.use(express.json())
.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let persons = [
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
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
    .then(person => {
        response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const idnumber = Number(request.params.id)
    const person = persons.find(person => person.id === idnumber)
    if (person) {
        persons = persons.filter(person => person.id !== idnumber)
        response.status(204).end()
    }
    else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    Person.find({}).then (persons => {
        let timenow = new Date()
        let info = `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${timenow}</p>
        `
        response.send(info)
    })
})

app.post('/api/persons', (request, response) => {
    const person = request.body
    if (!person.name || !person.number) {
        const message = { "error": 'The name or number is missing' }
        response.status(400).json(message)
    }
    else if (persons.map(x => x.name).includes(person.name)) {
        const message = { "error": 'The name already exists in the phonebook' }
        response.status(400).json(message)
    }
    else {
        person.id = Math.floor(Math.random() * 10000)
        persons = persons.concat(person)
        response.json(person)
    }

})

const PORT = process.env.port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})