<script setup>
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()

const props = defineProps({
  data_consent_time: String,
  data_consent_ip: String
})

const emit = defineEmits(['update:data_consent_time'])

const updateDataProtectionConsent = (value) => {
  if (value) {
    //consent given
    fetch('https://api.ipify.org?format=json')
      .then((response) => response.json())
      .then((data) => {
        emit('update:data_consent_time', new Date().toISOString())
        emit('update:data_consent_ip', data.ip)
      })
      .catch((error) => {
        console.error('Error fetching IP address:', error)
        emit('update:data_consent_time', new Date().toISOString())
        emit('update:data_consent_ip', null)
      })
  } else {
    //consent removed
    emit('update:data_consent_time', null)
    emit('update:data_consent_ip', null)
  }
}
</script>

<template>
  <v-checkbox
    v-if="props.data_consent_time"
    :model-value="props.data_consent_time != null"
    @update:modelValue="updateDataProtectionConsent"
    :label="`Data Protection Consent (given on ${new Date(
      props.data_consent_time
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
    prepend-icon="mdi-shield-check"
    color="primary"
  ></v-checkbox>
  <v-checkbox
    v-else
    :model-value="props.data_consent_time != null"
    @update:modelValue="updateDataProtectionConsent"
    label="Data Protection Consent not given"
    :density="mobile ? 'compact' : 'default'"
    prepend-icon="mdi-shield-check"
    color="primary"
  ></v-checkbox>
</template>
