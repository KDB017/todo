import { Router } from 'express'

const router = Router()

const members = [
  { id: '1', name: 'Alice', avatarText: 'A', completedCount: 5, totalCount: 10 },
  { id: '2', name: 'Bob', avatarText: 'B', completedCount: 3, totalCount: 10 },
  { id: '3', name: 'Charlie', avatarText: 'C', completedCount: 7, totalCount: 11 },
]

router.get('/', (_req, res) => {
  res.json(members)
})

export default router
