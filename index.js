import 'dotenv/config'
import express, { request, response } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import Person from './models/person.js'

const app = express()

morgan.token('body', (request) => JSON.stringify(request.body))
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if(!body.name || !body.phone)
        return response.status(400).json({ error: 'both name and phone must be provided'})
    
    new Person({
        name: body.name,
        phone: body.phone
    })
    .save()
    .then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      phone: body.phone,
    }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    Person.findById(id)
        .then(person => {
            response.json(person)
        })
        .catch(error => {
            next(error)
        })

})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
    
    Person.find({})
    .then(persons => {
        response.send(`<p>Phonebook has info for ${persons.length} people</p>
            <p>${new Date()}`)
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
      } 
    else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
      }
    
    response.status(404).end()
  }
  
  // handler of requests with result to errors
  app.use(errorHandler)

const PORT = process.env.PORT || 3001 

app.listen(PORT, () => {
    console.log(`Server up and running on port ${PORT}`)
})