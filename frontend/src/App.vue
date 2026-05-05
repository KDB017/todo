<script setup lang="ts">
import Mytodo from './components/Mytodo.vue'
import Participants from './components/Participants.vue'
import type { TodoList } from '@/types/todo'
import type { MemberList } from '@/types/member'
import { ref, onMounted } from 'vue'

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

const todoList = ref<TodoList>([])
const memberList = ref<MemberList>([])
const isMyTodoOpen = ref(false)

onMounted(async () => {
  const [todosRes, membersRes] = await Promise.all([
    fetch(`${apiUrl}/api/todos`),
    fetch(`${apiUrl}/api/members`),
  ])
  todoList.value = await todosRes.json()
  memberList.value = await membersRes.json()
})

function toggleMyTodo() {
  isMyTodoOpen.value = !isMyTodoOpen.value
}
</script>

<template>
  <div class="app-screen">
    <div class="app-header">
      <h1>Todo App</h1>
    </div>
    <div class="app-content">
      <div class="member-layer">
        <Participants :members="memberList" />
      </div>

      <div v-show="isMyTodoOpen" class="todo-layer">
        <Mytodo :todos="todoList" />
      </div>
    </div>
    <div class="app-footer">
      <button @click="toggleMyTodo">MyTodoを {{ isMyTodoOpen ? '非表示' : '表示' }}</button>
      <p>© 2026 Todo App. All rights reserved.</p>
    </div>
  </div>
</template>

<style scoped>
.app-screen {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-content {
  position: relative;
  flex: 1;
}

.todo-layer {
  position: absolute;
  inset: 0;
  background-color: white;
}
</style>
