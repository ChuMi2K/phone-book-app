const mongoose = require('mongoose')
const dns = require('node:dns/promises');
dns.setServers(['1.1.1.1', '8.8.8.8']);

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url, { family: 4 })
  .then(result => {
    console.log('connected to MongoDB ', result)
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3
  },
  number: {
    type: String,
    required: true,
    minLength: 8,
    match: [/^\d{2,3}-\d+$/, 'Phone number must be in format XX-XXXXXXX or XXX-XXXXXXX']
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)