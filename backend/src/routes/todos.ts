import { Router } from 'express'

const router = Router()

const todos = [
  { id: '1', text: 'Vueのコンポーネント責務を整理する', completed: true },
  { id: '2', text: 'TODO一覧を表示する', completed: true },
  { id: '3', text: '今日の達成数を表示する', completed: false },
]

router.get('/', (_req, res) => {
  res.json(todos)
})

export default router
