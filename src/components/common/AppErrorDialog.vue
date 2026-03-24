<template>
  <Dialog
    v-model:visible="state.visible"
    :header="state.header"
    modal
    :closable="false"
    :style="dialogStyle"
    @hide="onHide"
  >
    <div class="error-dialog-content">
      <Message v-if="state.message" severity="error" :closable="false">
        {{ state.message }}
      </Message>

      <Message v-for="(err, index) in state.errors" :key="index" severity="error" :closable="false">
        {{ err.errorMessage }}
      </Message>

      <div v-if="hasErrorDetails" class="error-details-toggle" @click="showDetails = !showDetails">
        {{ showDetails ? 'Hide' : 'Show' }} Error Details
      </div>

      <div v-if="showDetails && hasErrorDetails" class="error-details-section">
        <Message
          v-for="(err, index) in state.errors"
          :key="`detail-${index}`"
          severity="warn"
          :closable="false"
        >
          <template #default>
            <div>
              <strong>{{ err.errorCode }}</strong>
              <div v-if="err.errorValues.length > 0" class="error-values">
                <strong>Error Values</strong>
                <ul>
                  <li v-for="(value, vIdx) in err.errorValues" :key="vIdx">{{ value }}</li>
                </ul>
              </div>
            </div>
          </template>
        </Message>
      </div>
    </div>

    <template #footer>
      <div class="error-dialog-footer">
        <Button :label="CLOSE_LABEL" severity="info" @click="closeDialog" />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import { errorDialogState } from '@/composables/useAlert'

const CLOSE_LABEL = 'Close'
const dialogStyle = { width: '600px', maxWidth: '95vw' }
const state = errorDialogState
const showDetails = ref(false)

const hasErrorDetails = computed<boolean>(() =>
  state.errors.some((err) => err.errorCode || err.errorValues.length > 0),
)

function closeDialog(): void {
  state.visible = false
}

function onHide(): void {
  state.onClose?.()
  showDetails.value = false
}
</script>

<style scoped lang="scss">
.error-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 2px;
}

.error-details-toggle {
  text-align: right;
  color: var(--p-text-muted-color);
  cursor: pointer;
  font-size: 0.85rem;
  user-select: none;

  &:hover {
    color: var(--p-primary-color);
  }
}

.error-details-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.error-values {
  margin-top: 0.5rem;

  ul {
    margin: 0.25rem 0 0 0;
    padding-left: 1.5rem;
    list-style: disc;

    li {
      margin-bottom: 0.125rem;
    }
  }
}

.error-dialog-footer {
  display: flex;
  justify-content: center;
}
</style>
