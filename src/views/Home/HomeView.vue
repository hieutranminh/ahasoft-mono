<template>
  <main>
    <h3>{{ $t('common.welcome') }}</h3>
    <Button severity="success" :label="$t('common.click')" />
    <LanguageSwitcher />
  </main>
</template>

<script setup lang="ts">
import { useSignalR } from '@/modules/signalr/composables/useSignalR'
import { SIGNALR_EVENTS } from '@/modules/signalr/constants/signalrEvents'

const { onEvent } = useSignalR()

onEvent(SIGNALR_EVENTS.BOOKINGS_CREATED, (data) => {
  // TODO: Remove debug log after confirming SignalR works
  console.warn('[SignalR DEBUG] Booking created:', data)
})
</script>

<style scoped lang="scss"></style>
