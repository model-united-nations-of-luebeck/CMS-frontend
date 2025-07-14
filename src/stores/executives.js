import { defineStore } from 'pinia'
import {inject, ref} from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export const useExecutivesStore = defineStore('executives', () => {
    const http = inject('backend_instance');
    const executives = ref([])
    const executive = ref(null)
    const loading = ref(false)

    
    async function getExecutives() {
        loading.value = true
        await http.get("executives/").then( (res) => {
                executives.value = res.data
                loading.value = false
            }).catch((error) => {
                console.log(error)
                loading.value = false
                throw error; // rethrow the error to be caught at the point where this function is called
            })
        }

    async function getExecutive(executive_id){  //notice the singular form of the function name
        loading.value = true
        await http.get(`executives/${executive_id}/`).then( (res) => {
            executive.value = res.data
            loading.value = false
        }).catch((error) => {
            console.log(error)
            loading.value = false
            throw error; // rethrow the error to be caught at the point where this function is called
        })
    }


    async function updateExecutive(executive_id){
        loading.value = true
        await http.patch(`executives/${executive_id}/`, executive.value).then(() => {
            loading.value = false
            toast.success('Executive was updated successfully', {
                position: toast.POSITION.BOTTOM_CENTER,
                style: 'width: auto'
              })
        }).catch((error) => {
            toast.error('Updating Executive failed', {
                position: toast.POSITION.BOTTOM_CENTER
              })
            console.log(error)
            loading.value = false
            throw error; // rethrow the error to be caught at the point where this function is called
        })
    }

    async function createExecutive(position_name){
        loading.value = true
        await http.post("executives/", {position_name: position_name}).then( (res) => {
            executives.value.push(res.data)
            loading.value = false
            toast.success('Executive was added successfully', {
                position: toast.POSITION.BOTTOM_CENTER,
                style: 'width: auto'
              })
        }).catch((error) => {
            toast.error('Creating Executive failed', {
                position: toast.POSITION.BOTTOM_CENTER
              })
            console.log(error)
            loading.value = false
            throw error; // rethrow the error to be caught at the point where this function is called
        })
    }

    async function deleteExecutive(executive_id){
        await http.delete(`executives/${executive_id}/`).then(() => {
            executives.value = executives.value.filter( (executive) => executive.id != executive_id) // keep all executives that do not have the id of the deleted executive
            toast.success('Executive was deleted successfully', {
                position: toast.POSITION.BOTTOM_CENTER,
                style: 'width: auto'
              })
        }).catch((error) => {
            toast.error('Deleting Executive failed', {
                position: toast.POSITION.BOTTOM_CENTER
              })
            console.log(error)
            throw error; // rethrow the error to be caught at the point where this function is called
        })    
    }

    return {executives, executive, loading, getExecutives, getExecutive, updateExecutive, createExecutive, deleteExecutive}
})