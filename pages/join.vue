<template>
  <div class="relative w-full px-6 pt-8 pb-20">
    <ClientOnly>
      <div class="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <VideoStream v-for="id in peers" :peer-id="id" :key="id"></VideoStream>
        <VideoStream @peer-id="onOpenConnection"></VideoStream>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Join'
});

const peers = ref<string[]>([]);
const eventSource = ref<EventSource>();

const onOpenConnection = (id: string) => {
  eventSource.value = new EventSource(`${location.protocol}//${location.hostname}:3001/subscribe`);
  eventSource.value.addEventListener('peer:current', (evt) => {
    const clients = (JSON.parse(evt.data).clients as string[]).filter((v) => v !== id);
    peers.value = clients;
  });

  eventSource.value.addEventListener('peer:connection', (evt) => {
    const client = JSON.parse(evt.data).client as string;
    if (client === id) {
      return;
    }

    peers.value.push(client);
  });
  eventSource.value.addEventListener('peer:disconnect', (evt) => {
    const client = JSON.parse(evt.data).client as string;
    peers.value = peers.value.filter((p) => p !== client);
  });
};

onBeforeUnmount(() => {
  eventSource.value?.close();
});
</script>
