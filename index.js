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

app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
        .catch((error) => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            response.json(person)
        })
        .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch((error) => next(error))
})

app.get('/info', (request, response, next) => {
    Person.find({}).then(persons => {
        let timenow = new Date()
        let info = `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${timenow}</p>
        `
        response.send(info)
    })
        .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const person = request.body
    if (!person.name || !person.number) {
        const message = { "error": 'The name or number is missing' }
        response.status(400).json(message)
    }
    else {
        const newPerson = new Person({
            name: person.name,
            number: person.number
        })
        newPerson.save()
            .then(savedPerson => {
                response.json(savedPerson)
            })
            .catch((error) => next(error))
    }
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => { response.json(updatedPerson) })
        .catch(error => next(error))

})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})