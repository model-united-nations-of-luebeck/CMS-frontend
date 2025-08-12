import { defineStore } from 'pinia'
import {inject, ref} from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export const usePlenariesStore = defineStore('plenaries', () => {
    const http = inject('backend_instance');
    const plenaries = ref([])
    const plenary = ref(null)
    const loading = ref(false)

    function initializePlenary(){
        plenary.value = {
            abbreviation: '',
            name: '',
            location: '',
            }
    }
    
    async function getPlenaries() {
        loading.value = true
        await http.get("plenaries/").then( (res) => {
                plenaries.value = res.data
                loading.value = false
            }).catch((error) => {
                console.log(error)
                loading.value = false
                throw error; // rethrow the error to be caught at the point where this function is called
            })
        }

    async function getPlenary(plenary_id){  //notice the singular form of the function name
        loading.value = true
        await http.get(`plenaries/${plenary_id}/`).then( (res) => {
            plenary.value = res.data
            loading.value = false
        }).catch((error) => {
            console.log(error)
            loading.value = false
            throw error; // rethrow the error to be caught at the point where this function is called
        })
    }


    async function updatePlenary(plenary_id){
        loading.value = true
        await http.patch(`plenaries/${plenary_id}/`, plenary.value).then(() => {
            let index = plenaries.value.findIndex( (plenary) => plenary.id == plenary_id)
            if (index !== -1) {
                plenaries.value[index] = {...plenaries.value[index], ...plenary.value}
            }
            loading.value = false
            toast.success('Plenary was updated successfully', {
                position: toast.POSITION.BOTTOM_CENTER,
                style: 'width: auto'
              })
        }).catch((error) => {
            toast.error('Updating Plenary failed', {
                position: toast.POSITION.BOTTOM_CENTER
              })
            console.log(error)
            loading.value = false
            throw error; // rethrow the error to be caught at the point where this function is called
        })
    }

    async function createPlenary(){
        loading.value = true
        await http.post("plenaries/", plenary.value).then( (res) => {
            plenaries.value.push(res.data)
            loading.value = false
            toast.success('Plenary was added successfully', {
                position: toast.POSITION.BOTTOM_CENTER,
                style: 'width: auto'
              })
        }).catch((error) => {
            toast.error('Adding Plenary failed', {
                position: toast.POSITION.BOTTOM_CENTER
              })
            console.log(error)
            loading.value = false
            throw error; // rethrow the error to be caught at the point where this function is called
        })
    }

    async function deletePlenary(plenary_id){
        await http.delete(`plenaries/${plenary_id}/`).then(() => {
            plenaries.value = plenaries.value.filter( (plenary) => plenary.id != plenary_id) // keep all plenaries that do not have the id of the deleted plenary
            toast.success('Plenary was deleted successfully', {
                position: toast.POSITION.BOTTOM_CENTER,
                style: 'width: auto'
              })
        }).catch((error) => {
            toast.error('Deleting Plenary failed', {
                position: toast.POSITION.BOTTOM_CENTER
              })
            console.log(error)
            throw error; // rethrow the error to be caught at the point where this function is called
        })    
    }

    return {plenaries, plenary, loading, getPlenaries, getPlenary, updatePlenary, initializePlenary, createPlenary, deletePlenary}
})
