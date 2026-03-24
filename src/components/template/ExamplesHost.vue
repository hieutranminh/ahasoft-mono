<template>
  <Panel header="Template Examples">
    <div class="examples-container">
      <div class="examples-selector">
        <Select
          v-model="selectedExample"
          :options="exampleOptions"
          option-label="label"
          option-value="value"
          placeholder="Select an example"
        />
      </div>
      <Panel>
        <component :is="exampleComponents[selectedExample]" v-if="selectedExample" />
      </Panel>
    </div>
  </Panel>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent, type Component } from 'vue'

const exampleComponents: Record<string, Component> = {
  LuxonAndTimezoneExamples: defineAsyncComponent(() => import('./LuxonAndTimezoneExamples.vue')),
  ThemeExamples: defineAsyncComponent(() => import('./ThemeExamples.vue')),
  AlertAndDialogExamples: defineAsyncComponent(() => import('./AlertAndDialogExamples.vue')),
  FormExamples: defineAsyncComponent(() => import('./FormExamples.vue')),
  ValidationExamples: defineAsyncComponent(() => import('./ValidationExamples.vue')),
  NavigatorInfoExample: defineAsyncComponent(() => import('./NavigatorInfoExample.vue')),
  EnvironmentInfoExample: defineAsyncComponent(() => import('./EnvironmentInfoExample.vue')),
  ViewportInfoExample: defineAsyncComponent(() => import('./ViewportInfoExample.vue')),
  DatatableExample: defineAsyncComponent(() => import('./DatatableExample.vue')),
  SignalRExample: defineAsyncComponent(() => import('./SignalRExample.vue')),
}

const exampleOptions = [
  { label: 'Luxon & Timezone Examples', value: 'LuxonAndTimezoneExamples' },
  { label: 'Theme Examples', value: 'ThemeExamples' },
  { label: 'Alert & Dialog Examples', value: 'AlertAndDialogExamples' },
  { label: 'Form Examples', value: 'FormExamples' },
  { label: 'Validation Examples', value: 'ValidationExamples' },
  { label: 'Navigator Info Example', value: 'NavigatorInfoExample' },
  { label: 'Environment Info Example', value: 'EnvironmentInfoExample' },
  { label: 'Viewport Info Example', value: 'ViewportInfoExample' },
  { label: 'Datatable Example', value: 'DatatableExample' },
  { label: 'SignalR Example', value: 'SignalRExample' },
]

const selectedExample = ref<string>('LuxonAndTimezoneExamples')
</script>

<style lang="scss" scoped>
.examples-selector {
  margin-bottom: 1rem;
}

.examples-content {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}
</style>
