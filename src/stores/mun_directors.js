import { defineStore } from 'pinia'
import {inject, ref} from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export const useMUNDirectorsStore = defineStore('mun-directors', () => {
    const http = inject('backend_instance');
    const mun_directors = ref([])
    const mun_director = ref(null)
    const loading = ref(false)
    
    async function getMUNDirectors() {
        loading.value = true
        await http.get("mun-directors/").then( (res) => {
            mun_directors.value = res.data
            loading.value = false
        })
    }

    async function getMUNDirector(mun_director_id){  //notice the singular form of the function name
        loading.value = true
        await http.get(`mun-directors/${mun_director_id}/`).then( (res) => {
            mun_director.value = res.data
            loading.value = false
        }).catch((error) => {
            console.error(error)
            loading.value = false
            throw error; // rethrow the error to be caught at the point where this function is called
        })
    }

    async function updateMUNDirector(mun_director_id){
        loading.value = true
        await http.patch(`mun-directors/${mun_director_id}/`, mun_director.value).then(() => {
            let index = mun_directors.value.findIndex( (mun_dir) => mun_dir.id == mun_director_id)
            if (index !== -1) {
                mun_directors.value[index] = {...mun_directors.value[index], ...mun_director.value}
            }
            loading.value = false
            toast.success('MUN-Director was updated successfully', {
                position: toast.POSITION.BOTTOM_CENTER,
                style: 'width: auto'
              })
        }).catch((error) => {
            toast.error('Updating MUN-Director failed. Please ask admin for help.', { position: toast.POSITION.BOTTOM_CENTER })
            console.error(error)
            loading.value = false
            throw error; // rethrow the error to be caught at the point where this function is called
        })
    }



    async function deleteMUNDirector(mun_director_id){
        loading.value = true
        await http.delete(`mun-directors/${mun_director_id}/`).then(() => {
            mun_directors.value = mun_directors.value.filter( (mun_dir) => mun_dir.id != mun_director_id) // keep all mun_directors that do not have the id of the deleted mun_director
            loading.value = false
            toast.success('MUN-Director was deleted successfully', {
                position: toast.POSITION.BOTTOM_CENTER,
                style: 'width: auto'
              })
        }).catch((error) => {
            toast.error('Deleting MUN-Director failed. Please ask admin for help.', { position: toast.POSITION.BOTTOM_CENTER })
            console.error(error)
            loading.value = false
            throw error; // rethrow the error to be caught at the point where this function is called
        })    
    }

    async function createEmptyMUNDirectorForSchool(school_id){
        loading.value = true 
        await http.post("mun-directors/", {'school': school_id}).then( (res) => {
            mun_directors.value.push(res.data)
            loading.value = false
            toast.success('MUN-Director was added successfully', {
                position: toast.POSITION.BOTTOM_CENTER,
                style: 'width: auto'
              })
        }).catch((error) => {
            toast.error('Adding MUN-Director failed. Please ask admin for help.', { position: toast.POSITION.BOTTOM_CENTER })
            console.error(error)
            loading.value = false
            throw error; // rethrow the error to be caught at the point where this function is called
        })
    }
    
    return {mun_directors, mun_director, loading, getMUNDirectors, getMUNDirector, updateMUNDirector, deleteMUNDirector, createEmptyMUNDirectorForSchool}
})
