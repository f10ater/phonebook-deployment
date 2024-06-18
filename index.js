import express, { request, response } from 'express'
import morgan from 'morgan'

const app = express()

morgan.token('body', (request) => JSON.stringify(request.body))

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      id: 1,
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: 2,
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: 3,
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: 4,
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body)
    const id = Math.floor(Math.random() * 999999)

    if(!body.name || !body.number)
        return response.status(400).json({ error: 'both name and number must be provided'})

    const person = persons.find(person =>  person.name === body.name )
    if(person)
        return response.status(400).json({error: 'person already in the data'})   
    
    persons = persons.concat(body)
    response.json(body)
})

app.get('/api/persons', (request, response) => {
    response.status(200).json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person)
        response.json(person)
    response.status(404).end()
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
                    <p>${new Date()}`)
})

const PORT = process.env.PORT || 3001 

app.listen(PORT, () => {
    console.log(`Server up and running on port ${PORT}`)
})