const { application } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())

app.use(morgan('tiny'));
morgan.token('type', function (req, res) { return req.body })

app.use(express.json())


let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
      },
      {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
      },
      {
        name: "Dan abramov",
        number: "12-43-234345",
        id: 3
      },
      {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
      }
]



app.get('/api/persons', (req, res) => {
    res.json(persons)
})
app.get('/info', (req, res) => {
    const info = new Date()
    console.log(info)
    const date = new Date(info).toUTCString()
    console.log(date)

    res.json([`Phonebook has ${persons.length} persons`, date])
      
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'name or number missing' 
      })
    }
    const found = persons.find(element => element.name === body.name)
    if(found) {
        return response.status(400).json({ 
            error: 'name must be unique' 
          })
    }
  
    const person = {
      name: body.name,
      number: body.number,
      id: Math.floor(Math.random() * 10000),
    }
  console.log(person)
    persons = persons.concat(person)
  
    response.json(person)
  })
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})