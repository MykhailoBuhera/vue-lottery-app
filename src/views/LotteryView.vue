<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Participant } from '@/types/Participant'
import WinnersList from '@/components/WinnersList.vue'
import RegistrationForm from '@/components/RegistrationForm.vue'
import ParticipantsTable from '@/components/ParticipantsTable.vue'

const STORAGE_KEY = 'vue-lottery-participants'

function loadParticipants(): Participant[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Participant[]) : []
  } catch {
    return []
  }
}

const participants = ref<Participant[]>(loadParticipants())

watch(
  participants,
  (value) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  },
  { deep: true },
)

const winnerIds = ref<number[]>([])

const winners = computed(() =>
  winnerIds.value
    .map((id) => participants.value.find((p) => p.id === id))
    .filter((p): p is Participant => Boolean(p)),
)

const availableForWinning = computed(() =>
  participants.value.filter((p) => !winnerIds.value.includes(p.id)),
)

const canPickWinner = computed(
  () => winnerIds.value.length < 3 && availableForWinning.value.length > 0,
)

function pickWinner(): void {
  if (!canPickWinner.value) {
    return
  }

  const pool = availableForWinning.value
  const randomIndex = Math.floor(Math.random() * pool.length)
  const chosen = pool[randomIndex]

  if (!chosen) {
    return
  }

  winnerIds.value.push(chosen.id)
}

function removeWinner(id: number): void {
  winnerIds.value = winnerIds.value.filter((winnerId) => winnerId !== id)
}

function registerParticipant(participant: Participant): void {
  participants.value.push(participant)
}

function updateParticipant(updated: Participant): void {
  const index = participants.value.findIndex((p) => p.id === updated.id)
  if (index !== -1) {
    participants.value[index] = updated
  }
}

function deleteParticipant(id: number): void {
  participants.value = participants.value.filter((p) => p.id !== id)
  winnerIds.value = winnerIds.value.filter((winnerId) => winnerId !== id)
}
</script>

<template>
  <div class="lottery">
    <WinnersList
      :winners="winners"
      :can-pick-winner="canPickWinner"
      @pick="pickWinner"
      @remove="removeWinner"
    />

    <RegistrationForm :participants="participants" @register="registerParticipant" />

    <ParticipantsTable
      :participants="participants"
      @update="updateParticipant"
      @delete="deleteParticipant"
    />
  </div>
</template>
