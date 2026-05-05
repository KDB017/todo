<script setup lang="ts">
import Mytodo from './components/Mytodo.vue'
import Participants from './components/Participants.vue'
import type { TodoList } from '@/types/todo'
import type { MemberList } from '@/types/Member'
import { ref } from 'vue'

const todoList = ref<TodoList>([
  { id: '1', text: 'Vueのコンポーネント責務を整理する', completed: true },
  { id: '2', text: 'TODO一覧を表示する', completed: true },
  { id: '3', text: '今日の達成数を表示する', completed: false },
])

const memberList = ref<MemberList>([
  { id: '1', name: 'Alice', avatarText: 'A', completedCount: 5 },
  { id: '2', name: 'Bob', avatarText: 'B', completedCount: 3 },
  { id: '3', name: 'Charlie', avatarText: 'C', completedCount: 7 },
])

</script>

<template>
  <Mytodo :todos="todoList" />
  <Participants :members="memberList" />
</template>

<style scoped></style>
