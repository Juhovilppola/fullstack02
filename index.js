require('dotenv').config()
const { application } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
app.use(express.static('build'))
const Person = require('./models/person')
app.use(cors())

app.use(morgan('tiny'));
morgan.token('type', function (req, res) { return req.body })

app.use(express.json())




app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
})
.catch(error => next(error))
})

app.get('/info', (request, response) => {
    const info = new Date()
    console.log(info)
    const date = new Date(info).toUTCString()
    console.log(date)

    Person.find({}).then(persons => {
      response.json(([`Phonebook has ${persons.length} persons`, date]))
  })
  .catch(error => next(error))
  })

    
      

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      console.log(person)
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})
app.post('/api/persons', (request, response, next) => {
  const body = request.body


  const person = new Person({
    name: body.name,
    number: body.number,
  
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error))
  
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: body.number })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })