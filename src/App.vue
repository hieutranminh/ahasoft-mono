<template>
  <!-- Global Toast for notifications -->
  <Toast />

  <!-- Global ConfirmDialog for confirmations -->
  <ConfirmDialog />

  <!-- Error dialog (supports simple messages and API errors with expandable details) -->
  <AppErrorDialog />

  <!-- Global loading overlay (auto-tracks API requests via axios interceptors) -->
  <AppGlobalLoading />

  <!-- PWA update notification banner -->
  <AppPwaUpdate />

  <RouterView />

  <ExamplesHost />
</template>

<script setup lang="ts">
// AppPwaUpdate is auto-imported from src/components/common/
</script>

<style scoped></style>
