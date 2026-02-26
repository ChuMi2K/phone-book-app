require('dotenv').config()
const express = require("express");
const Person = require('./models/person')
const morgan = require('morgan');
// const cors = require('cors')
const app = express();

app.use(express.json())

// Create custom token
morgan.token('body', (req) => {
  if (req.body) return JSON.stringify(req.body);
  if (req.params) return JSON.stringify(req.params);
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// app.use(cors())

app.use(express.static('dist'))

app.get("/api/persons", (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons);
  })
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      console.log('result ', result);
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'The name or number is missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})

app.get("/info", (request, response) => {
  Person.find({}).then(persons => {
    response.send(`Phonebook has info for ${persons.length} people ${new Date}`);
  })
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});