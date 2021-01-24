const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

const url = process.env.MONGODB_URL

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(response => {
        console.log('connected to MongoDB')
    })
    .catch(err=> {
        console.log('connecting to MongoDB failed', err.message)
    })

const todoSchema = new mongoose.Schema({
    task: {
        type: String,
        minlength: 5,
        unique: true,
        uniqueCaseInsensitive: true,
        required: true
    },
    done: Boolean
})

todoSchema.plugin(uniqueValidator)

todoSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Todo', todoSchema)