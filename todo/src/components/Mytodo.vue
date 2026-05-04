<script setup lang="ts">
import {  computed } from 'vue'
import type { TodoList } from '@/types/todo'

const props=defineProps<{
    todos: TodoList
}>()


const achievement = computed(() => {
    return props.todos.filter(todo => todo.completed).length
})

</script>



<template>
    <section>
        <header>
            <h1>My Todo List</h1>
            <p>今日の達成数: {{ achievement }}</p>
        </header>
    </section>

    <ul>
        <li v-for="todo in props.todos" :key="todo.id">
            {{ todo.text }}  {{ todo.completed ? ' (Completed)' : '(Not Completed)' }} 
        </li>
    </ul>
</template>


<style scoped>
h1 {
    color: black;
}
</style>
