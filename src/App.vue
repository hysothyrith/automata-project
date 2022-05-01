<script setup lang="ts">
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { ref } from "vue";

const text = ref("");
</script>

<template>
  <InputText v-model="text"></InputText>
  <Button>Button</Button>
</template>
