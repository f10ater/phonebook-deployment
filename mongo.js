import mongoose from 'mongoose'

if (process.argv.length < 3) {
    console.log('Please provide the password')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://anonymoussquirel9203:${password}@fullstackopen.ztd2yqg.mongodb.net/phonebook?retryWrites=true&w=majority&appName=FullStackOpen`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    phone: String
})

const Person = mongoose.model('Person', personSchema)

switch (process.argv.length) {
    case 3:
        Person.find({}).then(result => {
            result.forEach(person => {
                console.log(person)
            })
            mongoose.connection.close()
        })
        break
    
    case 5:
        const person = new Person({
            name: process.argv[3],
            phone: process.argv[4]
        })
        
        person.save().then(result => {
            console.log('Note Saved')
            mongoose.connection.close()
        })
        break

    default:
        console.log('Invalid usage')
}


