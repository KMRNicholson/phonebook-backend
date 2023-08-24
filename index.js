require('dotenv').config();
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const Person = require('./models/Person.js')

morgan.token('body', req => req.method === 'POST' ? JSON.stringify(req.body) : '')

app.use(express.json())
app.use(express.static('frontend'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

app.get('/info', (request, response) => {
  const data = {
    "time": new Date(),
    "count": persons.length
  }

  const html = `<p>Phonebook has info for ${data.count} people<br/>${data.time}</p>`
  response.send(html)
})

app.get('/', (request, response) => {
  const html = `<p>Welcome to the phonebook app backend. Please see endpoints:<br/>/info<br/>/api/persons</p>`
  response.send(html)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.post('/api/persons', (request, response) => {
  const data = request.body
  const id = Math.floor(Math.random() * 10000)

  const newPerson = {
    "id": id,
    "name": data.name,
    "number": data.number
  }

  if(!data.name | !data.number) {
    response.status(400).end()
  } else if(persons.find(person => person.name === data.name)) {
    response.status(409).end()
  } else {
    persons.push(newPerson)
    response.json(newPerson)
  }
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if(person){
    response.json(person)  
  }else{
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})