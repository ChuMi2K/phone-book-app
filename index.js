const express = require("express");
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

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () => {
  return String(Math.floor(Math.random() * 1000));
}

app.get("/api/persons", (request, response) => {
    response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(note => note.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  // console.log('request ', request);
  
  const body = request.body
  // console.log('Body ', body);
  
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'The name or number is missing' 
    })
  } else {
    const names = persons.map(person => person.name)
    if (names.includes(body.name)) {
      return response.status(400).json({ 
        error: 'name must be unique' 
      })
    }
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }
  persons = persons.concat(person)
  response.json([person])
})

app.get("/info", (request, response) => {
    response.send(`Phonebook has info for ${persons.length} people ${new Date}`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});