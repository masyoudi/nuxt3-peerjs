<template>
  <div class="relative w-full p-6">
    <div class="text-xl font-bold">Current joined room: {{ peers.length }}</div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Home'
});

const peers = ref<string[]>([]);
const eventSource = ref<EventSource>();

const init = () => {
  eventSource.value = new EventSource(`${location.protocol}//${location.hostname}:3001/subscribe`);
  eventSource.value.addEventListener('peer:current', (evt) => {
    const clients = JSON.parse(evt.data).clients as string[];
    peers.value = clients;
  });

  eventSource.value.addEventListener('peer:connection', (evt) => {
    const client = JSON.parse(evt.data).client as string;

    peers.value.push(client);
  });
  eventSource.value.addEventListener('peer:disconnect', (evt) => {
    const client = JSON.parse(evt.data).client as string;
    peers.value = peers.value.filter((p) => p !== client);
  });
};

onMounted(init);

onBeforeUnmount(() => {
  eventSource.value?.close();
});
</script>
