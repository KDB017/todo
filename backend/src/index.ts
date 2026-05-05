import express from 'express'
import cors from 'cors'
import todosRouter from './routes/todos'
import membersRouter from './routes/members'

const app = express()
const port = process.env.PORT ?? 3000

app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/todos', todosRouter)
app.use('/api/members', membersRouter)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
