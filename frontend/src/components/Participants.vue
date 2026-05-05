<script setup lang="ts">
import type { MemberList } from '@/types/member'

const props = defineProps<{
    members: MemberList
}>()


</script>



<template>
    <section class="participants">
        <header>
            <h1>Participants</h1>
        </header>
        <ul class="members-information">
            <li v-for="member in props.members" :key="member.id" class="member-card">
                <div class="avatar">{{ member.avatarText }}</div>
                <div class="member-information">
                    <div class="name">{{ member.name }}</div>
                    <div class="completion-rate">
                        {{ member.completedCount }}/{{ member.totalCount }}
                    </div>
                </div>
            </li>
        </ul>
    </section>


</template>


<style scoped>
.member-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 12%);
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
}

.members-information {
  display: flex;
  flex-direction: column;
  gap: 12px;
  list-style: none;
  padding: 0;
  margin: 0;
  box-shadow: 0 2px 8px rgb(0 0 0 / 12%);
}

.member-information {
  display: flex;
  flex-direction: column;
}

.participants {
  padding: 16px;
}

</style>
