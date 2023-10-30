<template>
  <div class="relative">
    <video ref="video"></video>
    <div v-if="!props.peerId" class="absolute bottom-0 right-0">
      <UBadge :ui="{ rounded: 'rounded-none' }">You</UBadge>
    </div>
  </div>
</template>

<script setup lang="ts">
import Peer from 'peerjs';

interface Props {
  peerId?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'peer-id', val: string): void;
}>();

const peer = ref<Peer>();
const video = ref();
const stream = ref<MediaStream>();

const playVideo = (streamData: MediaStream) => {
  video.value.addEventListener('loadedmetadata', async () => await video.value.play());
  video.value.srcObject = streamData;
};

const init = async () => {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });

    if (!props.peerId) {
      playVideo(stream.value);
    }

    const prefixId = (!props.peerId ? 'PARTICIPANT' : 'STREAMER') + '5752RULJ313HS1GDMU-';
    const id = prefixId + Array.from(Array(20), () => Math.floor(Math.random() * 36).toString(36)).join('');
    peer.value = new Peer(id, {
      host: location.hostname,
      port: 3001,
      path: '/peer'
    });

    peer.value.on('open', (id) => emit('peer-id', id));

    if (!props.peerId) {
      peer.value.on('call', (call) => call.answer(stream.value as MediaStream));
    }

    if (!!props.peerId) {
      const call = peer.value.call(props.peerId, stream.value);
      call.on('stream', (mediaStream) => playVideo(mediaStream));
    }
  } catch {
    // noop
  }
};

onMounted(init);

onBeforeUnmount(() => {
  peer.value?.disconnect();
  stream.value?.getTracks().forEach((t) => t.stop());
});
</script>
