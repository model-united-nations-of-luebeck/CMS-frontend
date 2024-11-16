<script setup>
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()

const props = defineProps({
  consent_time: String,
  consent_ip: String,
  prepend_icon: String,
  label_consent_type: String
})

const emit = defineEmits(['update:consent_time', 'update:consent_ip'])

const updateConsent = (value) => {
  if (value) {
    //consent given
    fetch('https://api.ipify.org?format=json')
      .then((response) => response.json())
      .then((data) => {
        emit('update:consent_time', new Date().toISOString())
        emit('update:consent_ip', data.ip)
      })
      .catch((error) => {
        console.error('Error fetching IP address:', error)
        emit('update:consent_time', new Date().toISOString())
        emit('update:consent_ip', null)
      })
  } else {
    //consent removed
    emit('update:consent_time', null)
    emit('update:consent_ip', null)
  }
}
</script>

<template>
  <v-checkbox
    v-if="props.consent_time"
    :model-value="props.consent_time != null"
    @update:modelValue="updateConsent"
    :label="`${props.label_consent_type} Consent (given on ${new Date(
      props.consent_time
    ).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: 'h12'
    })})`"
    :density="mobile ? 'compact' : 'default'"
    :prepend-icon="props.prepend_icon"
    color="primary"
  ></v-checkbox>
  <v-checkbox
    v-else
    :model-value="props.consent_time != null"
    @update:modelValue="updateConsent"
    :label="`${props.label_consent_type} Consent not given`"
    :density="mobile ? 'compact' : 'default'"
    :prepend-icon="props.prepend_icon"
    color="primary"
  ></v-checkbox>
</template>
