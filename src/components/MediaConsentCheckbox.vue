<script setup>
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()

const props = defineProps({
  media_consent_time: String,
  media_consent_ip: String
})

const emit = defineEmits(['update:media_consent_time'])

const updateMediaConsent = (value) => {
  if (value) {
    //consent given
    fetch('https://api.ipify.org?format=json')
      .then((response) => response.json())
      .then((data) => {
        emit('update:media_consent_time', new Date().toISOString())
        emit('update:media_consent_ip', data.ip)
      })
      .catch((error) => {
        console.error('Error fetching IP address:', error)
        emit('update:media_consent_time', new Date().toISOString())
        emit('update:media_consent_ip', null)
      })
  } else {
    //consent removed
    emit('update:media_consent_time', null)
    emit('update:media_consent_ip', null)
  }
}
</script>

<template>
  <v-checkbox
    v-if="props.media_consent_time"
    :model-value="props.media_consent_time != null"
    @update:modelValue="updateMediaConsent"
    :label="`Media Consent (given on ${new Date(props.media_consent_time).toLocaleDateString(
      'en-GB',
      {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: 'h12'
      }
    )})`"
    :density="mobile ? 'compact' : 'default'"
    prepend-icon="mdi-multimedia"
    color="primary"
  ></v-checkbox>
  <v-checkbox
    v-else
    :model-value="props.media_consent_time != null"
    @update:modelValue="updateMediaConsent"
    label="Media Consent not given"
    :density="mobile ? 'compact' : 'default'"
    prepend-icon="mdi-multimedia"
    color="primary"
  ></v-checkbox>
</template>
