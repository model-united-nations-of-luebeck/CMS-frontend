import { defineStore } from 'pinia'
import {inject, ref} from 'vue'
import { useConferenceStore } from "./conference";
const conferenceStore = useConferenceStore();
conferenceStore.getCurrentConference();


export function getAge(birth_date) {
  const start_date = new Date(conferenceStore.conference?.start_date);
  const birth_date_date = new Date(birth_date);
  let age = start_date.getFullYear() - birth_date_date.getFullYear();
  const month = start_date.getMonth() - birth_date_date.getMonth();
  if (
    month < 0 ||
    (month === 0 && start_date.getDate() < birth_date_date.getDate())
  ) {
    age--;
  }
  return age;
}

export function sortParticipantsByName(a, b) {
  if (a && b && a.first_name && b.first_name) {
    return a.first_name.localeCompare(b.first_name);
  }
  return 0;
}

export function sortParticipantsByAge(a, b) {
  if (a && b && a.birthday && b.birthday) {
    const age_a = getAge(a.birthday);
    const age_b = getAge(b.birthday);
    return age_a - age_b;
  }
  return 0;
}

export const useParticipantsStore = defineStore('participants', () => {
    const http = inject('backend_instance');
    const participants = ref([])
    const participant = ref(null)
    const loading = ref(false)

    async function getParticipants() {
        loading.value = true
        await http.get("participants/").then( (res) => {
            participants.value = res.data
            loading.value = false
        })
    }

    return {
        participants,
        participant,
        loading,
        getParticipants
    }
})
