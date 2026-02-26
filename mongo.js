const dns = require('node:dns/promises');
dns.setServers(['1.1.1.1', '8.8.8.8']);

const mongoose = require('mongoose')
let name;
let number;
if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
} else if (process.argv.length === 5) {
  name = process.argv[3]
  number = process.argv[4]
}

const password = process.argv[2]
const url = `mongodb+srv://fullstack_db_user:${password}@cluster0.jw3ene3.mongodb.net/phoneBookApp?appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (name && number) {
  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(result => {
    console.log('Added ' + result.name + ' number ' + result.number + ' to phonebook')
    mongoose.connection.close()
  })
} else {
  Person.find({}).then(result => {
    console.log('Phonebook:');
    result.forEach(person => {
      console.log(person.name + " " + person.number)
    })
    mongoose.connection.close()
  })
}
