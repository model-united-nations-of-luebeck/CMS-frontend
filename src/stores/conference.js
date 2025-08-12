import { defineStore } from 'pinia'
import { inject, ref } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export const useConferenceStore = defineStore('conference', () => {
    const http = inject('backend_instance') 
    const conference = ref(null)
    const loading = ref(false)

    const validationRules = {
        yearRules: [
            (y) => !!y || 'Year is required',
            (y) =>
                (y && 2000 < y && y < 2100) || 'Please give the year in YYYY format between 2000 and 2100'
        ],
        annualSessionRules: [(as) => !!as || 'Annual session is required', (as) => as > 0 || 'Annual session must be greater than 0'],
        startDateRules: [(sd) => !!sd || 'Start date is required', (sd) => new Date(sd) <= new Date(conference.value.end_date) || 'Start date must be earlier than end date', (sd) => new Date(sd).getFullYear() == conference.value.year || 'Start date must be in the same year as the conference'],
        endDateRules: [(ed) => !!ed || 'End date is required', (ed) => new Date(ed) >= new Date(conference.value.start_date) || 'End date must be later than start date', (ed) => new Date(ed).getFullYear() == conference.value.year || 'End date must be in the same year as the conference'],
        associationRules: [(a) => !!a || 'Board members are required']
    }
    
    
    async function getCurrentConference() {
        loading.value = true
        
        await http.get("conferences/").then( (res) => {
            [conference.value] = res.data
            loading.value = false
        })
    }

    async function updateConferenceSettings() {
        loading.value = true
        await http.put(`conferences/${conference.value.id}/`, conference.value).then( (res) => {
            conference.value = res.data
            loading.value = false
            toast.success('Conference settings were updated successfully', {
                position: toast.POSITION.BOTTOM_CENTER,
                style: 'width: auto'
              })
        }).catch( (error) => {
            console.error(error)
            loading.value = false
            toast.error('Updating conference settings failed. Please ask admin for help.', {
                position: toast.POSITION.BOTTOM_CENTER
              })
            throw error
        })
    }

    return { conference, loading, validationRules, getCurrentConference, updateConferenceSettings}
})

