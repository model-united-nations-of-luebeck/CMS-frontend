import { defineStore } from 'pinia'
import {inject, ref} from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export const useForumsStore = defineStore('forums', () => {
    const http = inject('backend_instance');
    const forums = ref([])
    const forum = ref(null)
    const loading = ref(false)

    function initializeForum(){
        forum.value = {
            abbreviation: '',
            name: '',
            subtitle: '',
            plenary: '',
            email: ''
            }
    }

    async function getForums() {
        loading.value = true
        
        await http.get("forums/").then( (res) => {
            forums.value = res.data
            loading.value = false
        }).catch((error) => {
            console.error(error)
            loading.value = false
            throw error; // rethrow the error to be caught at the point where this function is called
        })
    }

    async function getForum(forum_id){  //notice the singular form of the function name
        loading.value = true
        await http.get(`forums/${forum_id}/`).then( (res) => {
            forum.value = res.data
            loading.value = false
        }).catch((error) => {
            console.error(error)
            loading.value = false
            throw error; // rethrow the error to be caught at the point where this function is called
        })
    }


    async function updateForum(forum_id){
        loading.value = true
        await http.patch(`forums/${forum_id}/`, forum.value).then(() => {
            let index = forums.value.findIndex( (forum) => forum.id == forum_id)
            if (index !== -1) {
                forums.value[index] = {...forums.value[index], ...forum.value}
            }
            loading.value = false
            toast.success('Forum was updated successfully', {
                position: toast.POSITION.BOTTOM_CENTER,
                style: 'width: auto'
              })
        }).catch((error) => {
            toast.error('Updating Forum failed', {
                position: toast.POSITION.BOTTOM_CENTER
              })
            console.error(error)
            loading.value = false
            throw error; // rethrow the error to be caught at the point where this function is called
        })
    }

    async function createForum(){
        loading.value = true
        await http.post("forums/", forum.value).then( (res) => {
            forums.value.push(res.data)
            loading.value = false
            toast.success('Forum was added successfully', {
                position: toast.POSITION.BOTTOM_CENTER,
                style: 'width: auto'
              })
        }).catch((error) => {
            toast.error('Adding Forum failed', {
                position: toast.POSITION.BOTTOM_CENTER
              })
            console.error(error)
            loading.value = false
            throw error; // rethrow the error to be caught at the point where this function is called
        })
    }

    async function deleteForum(forum_id){
        await http.delete(`forums/${forum_id}/`).then(() => {
            forums.value = forums.value.filter( (forum) => forum.id != forum_id) // keep all forums that do not have the id of the deleted forum
            toast.success('Forum was deleted successfully', {
                position: toast.POSITION.BOTTOM_CENTER,
                style: 'width: auto'
              })
        }).catch((error) => {
            toast.error('Deleting Forum failed', {
                position: toast.POSITION.BOTTOM_CENTER
              })
            console.error(error)
            throw error; // rethrow the error to be caught at the point where this function is called
        })    
    }

    return {forums, forum, loading, getForums, getForum, updateForum, initializeForum, createForum, deleteForum}
})
