<script setup>
const props = defineProps({
  data_consent_time: String,
  data_consent_ip: String,
  media_consent_time: String,
  media_consent_ip: String,
});
</script>

<template>
  <h2>Consent Information</h2>

  <h3>Data consent</h3>
  <div v-if="props.data_consent_time">
    <p>
      <b>Time:</b>
      {{ new Date(props.data_consent_time).toLocaleString() }}
    </p>
    <p><b>IP-Address:</b> {{ props.data_consent_ip }}</p>
  </div>
  <div v-else>
    <p>Data consent not given yet</p>
  </div>
  <br />
  <h3>Media consent</h3>
  <div v-if="props.media_consent_time">
    <p>
      <b>Time:</b>
      {{ new Date(props.media_consent_time).toLocaleString() }}
    </p>
    <p><b>IP-Address:</b> {{ props.media_consent_ip }}</p>
  </div>
  <div v-else>
    <p>Media consent not given</p>
  </div>
</template>
