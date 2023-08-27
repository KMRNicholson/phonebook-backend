require('dotenv').config();
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const Person = require('./models/Person.js')

morgan.token('body', req => req.method === 'POST' ? JSON.stringify(req.body) : '')

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  next(error)
}

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

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
  .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const data = request.body
  if(!data.name | !data.number) {
    response.status(400).end()
  }

  Person.find({ name: data.name }).then(result => {
    if(result.length > 0){
      response.status(409).end()
    }
  })
  .catch(error => next(error))

  const person = new Person({
    name: data.name,
    number: data.number
  })

  person.save().then(result => {
    console.log('person saved!')
    response.json(person)
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const data = request.body

  Person.findByIdAndUpdate(request.params.id, { name: data.name, number: data.number }).then(result => {
    console.log('person updated!')
    response.status(204).end()
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => Person.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error)))

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})