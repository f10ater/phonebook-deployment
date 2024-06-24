import mongoose from 'mongoose'

const url = process.env.MONGODB_URL

mongoose.set('strictQuery', false)

mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB')
    })
    .catch(error => {
        console.log('Error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        minLength: 8,
        validate: {
            validator: (phone) => {
                function isNumeric(str) {
                    return !isNaN(parseInt(str, 10)) && !isNaN(str);
                  }
                
                const hyphenLoc = phone.indexOf('-')
                let hypenCorrect = false
                if (hyphenLoc !== -1 && (hyphenLoc === 2 || hyphenLoc === 3) && hyphenLoc === phone.lastIndexOf('-'))
                    hypenCorrect = true

                if (hypenCorrect && phone.split('-').every(str => isNumeric(str)))
                    return true
                return false
            },
            message: 'Not a vaid phone number'
        }
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
      } 
})

const Person = mongoose.model('Person', personSchema)

export default Person