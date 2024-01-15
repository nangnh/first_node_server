const http = require("http")
const express = require("express");

const app = express();

/**
 * Plugins
 */
app.use(express.json())

/**
 * Data
 */
let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can excute only JavaScript",
    important: true,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  }
]

/**Create app with http */
const app1 = http.createServer((request, response) => {
  response.writeHead(200, {
    'Content-Type': 'text/plain',
    'Accept': 'application/json'
  })
  response.end(JSON.stringify(notes))
})

/**Create app with express */
/**
 * GET COMMON
 * */
app.get('/', (request, response) => {
  response.send('<h1>Hello world!!!</h1>')
})

/**
 * GET all resources
 * */
app.get('/api/notes', (request, response) => {
  response.json(notes)
})

/**
 * GET a single resource
 * */
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => String(note.id) === String(id))

  if (note) {
    response.json(note)
    return
  }

  response.status(404).end()  
})

/**
 * DELETE a single resource
 */

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter(note => String(note.id) !== String(id))

  response.status(204).end()
})

/**
 * CREATE a single resource
 */
app.post('/api/notes', (request, response) => { 
  if (!request.body?.content) {
    return response.status(400).json({
      code: 100,
      message: 'The content is not missing.'
    })
  }

  const { body: { content = '', important = false } } = request;
  const note = {
    content,
    important: Boolean(important),
    id: generateId()
  }
  notes = notes.concat(note)

  response.json(note)
})

/**
 * Utils
*/
const generateId = () => {
  const maxId = notes.length ? Math.max(...notes.map(note => Number(note.id))) : 0

  return Number(maxId + 1)
}

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})