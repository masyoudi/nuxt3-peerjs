<template>
  <div class="relative w-full h-screen overflow-hidden">
    <div
      class="absolute top-0 lg:left-0 bottom-0 w-[265px] z-10 shadow-md bg-white dark:bg-black"
      :class="!openSidebar ? '-left-[265px]' : 'left-0'"
    >
      <div class="relative block w-full select-none p-4 mb-6">
        <div class="text-xl text-center font-semibold text-green-500">Nuxt3 PeerJS</div>
      </div>
      <div class="relative block w-full px-3">
        <UVerticalNavigation class="select-none" :links="links">
          <template #icon="{ link }">
            <UIcon v-if="link.label !== 'color-mode'" :name="link.icon" class="w-[1.25rem] h-[1.25rem]"></UIcon>
            <ClientOnly v-else>
              <UIcon :name="isDark ? 'i-ph-moon-fill' : 'i-ph-sun'" class="w-[1.25rem] h-[1.25rem]"></UIcon>
            </ClientOnly>
          </template>
          <template #default="{ link }">
            <span v-if="link.label !== 'color-mode'" class="relative truncate">{{ link.label }}</span>
            <ClientOnly v-else>
              <span class="relative truncate">Theme ({{ isDark ? 'Dark' : 'Light' }})</span>
            </ClientOnly>
          </template>
        </UVerticalNavigation>
      </div>
    </div>
    <div class="relative w-full h-full lg:pl-[265px]">
      <div class="relative flex w-full h-[4.5rem] bg-white dark:bg-black shadow py-1.5 px-6 select-none">
        <div class="relative inline-flex lg:hidden h-full items-center grow-0 shrink-0 cursor-pointer mr-3" @click="onToggleSidebar">
          <UIcon name="i-ph-list-bold" class="w-[1.25rem] h-[1.25rem]"></UIcon>
        </div>
        <div class="relative inline-flex grow h-full items-center shrink truncate">
          <span>{{ title }}</span>
        </div>
      </div>
      <div class="relative block w-full h-[calc(100vh_-_4.5rem)] overflow-y-auto">
        <slot></slot>
      </div>
    </div>
    <div v-if="openSidebar" class="fixed bg-black/40 dark:bg-black/50 lg:hidden inset-0 z-[9]" @click="onToggleSidebar"></div>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: () => (colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark')
});
const openSidebar = ref(false);
const title = ref('');
const links = [
  {
    label: 'Home',
    icon: 'i-ph-house-bold',
    to: '/'
  },
  {
    label: 'Join',
    icon: 'i-ph-users-three-bold',
    to: '/join'
  },
  {
    label: 'color-mode',
    icon: 'i-ph-users-three-bold',
    click: () => {
      if (!process.client) return;
      isDark.value = !isDark.value;
    }
  }
];

const rtrimLastChar = (val: string, char: string = '/', uppercased: boolean = false) => {
  const result = val.substring(0, val.lastIndexOf(char));
  return !uppercased ? result : result.toUpperCase();
};
const titleNormalizer = (val: string) => {
  const parsed = rtrimLastChar(val, '|').trim();

  return parsed ? parsed : val;
};

const titleWatcher = () => (title.value = titleNormalizer(document.title));

const onToggleSidebar = () => (openSidebar.value = !openSidebar.value);

onMounted(() => {
  title.value = titleNormalizer(document.title);

  const titleObserver = new MutationObserver(titleWatcher);
  titleObserver.observe(document.head.querySelector('title') as HTMLElement, { characterData: true, childList: true });
});
</script>
