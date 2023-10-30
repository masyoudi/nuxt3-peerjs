<template>
  <NuxtLayout>
    <NuxtPage></NuxtPage>
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (title) => String(title ? title + ' | ' : '').concat('Nuxt3 PeerJS'),
  bodyAttrs: {
    class: 'relative w-full h-full overflow-hidden'
  }
});
</script>
