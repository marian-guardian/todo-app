require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const Todo = require('./models/todo')

app.use(express.static('build'))
app.use(morgan('tiny'))
app.use(cors())
app.use(express.json())


app.get('/api/todos', (req, res) => {
    Todo.find({}).then(todos => {
        res.json(todos)
    })
        .catch(err => {
            console.log('error while connecting to /api/todos')
        })
})

app.get('/api/todos/:id', (req, res, next) => {
    Todo.findById(req.params.id)
        .then(todo => {
            if (todo) {
                res.json(todo)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.post('/api/todos', (req, res, next) => {

    const newTodo = new Todo({
        task: req.body.task,
        done: req.body.done || false
    })

    newTodo.save()
        .then(savedTodo => {
            res.json(savedTodo)
        })
        .catch(error => next(error))
})

app.delete('/api/todos/:id', (req, res) => {
    Todo.findByIdAndRemove(req.params.id)
        .then(removedTodo => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/todos/:id', (req, res) => {

    const note = {
        task: req.body.task,
        done: req.body.done
    }

    Todo.findByIdAndUpdate(req.params.id, note, { new: true })
        .then(updatedNote => {
            res.json(updatedNote)
        })
        .catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return res.status(400).json({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})