<template>
  <v-app>
    <router-view />

    <DialogWrapper />
  </v-app>
</template>

<script setup lang="ts">
import { DialogWrapper } from 'vue3-promise-dialog';
</script>
