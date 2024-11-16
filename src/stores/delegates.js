import { defineStore } from 'pinia'
import {inject, ref} from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export const useDelegatesStore = defineStore('delegates', () => {
    const http = inject('backend_instance');
    const delegates = ref([])
    const delegate = ref(null)
    const loading = ref(false)
    
    async function getDelegates() {
        loading.value = true
        await http.get("delegates/").then( (res) => {
                delegates.value = res.data
                loading.value = false
            }).catch((error) => {
                console.log(error)
                loading.value = false
                throw error; // rethrow the error to be caught at the point where this function is called
            })
        }

    async function getDelegate(delegate_id){  //notice the singular form of the function name
        loading.value = true
        await http.get(`delegates/${delegate_id}/`).then( (res) => {
            delegate.value = res.data
            loading.value = false
        }).catch((error) => {
            console.log(error)
            loading.value = false
            throw error; // rethrow the error to be caught at the point where this function is called
        })
    }

    async function updateDelegate(delegate_id){
        loading.value = true
        await http.patch(`delegates/${delegate_id}/`, delegate.value).then(() => {
            loading.value = false
            toast.success('Delegate was updated successfully', {
                position: toast.POSITION.BOTTOM_CENTER,
                style: 'width: auto'
              })
        }).catch((error) => {
            toast.error('Updating Delegate failed', {
                position: toast.POSITION.BOTTOM_CENTER
              })
            console.log(error)
            loading.value = false
            throw error; // rethrow the error to be caught at the point where this function is called
        })
    }

    async function createDelegate(forum_id, org_id) {
        loading.value = true
        await http.post("delegates/", {forum: forum_id, represents: org_id}).then( (res) => {
                delegates.value.push(res.data)
                loading.value = false
                toast.success('Delegate was added successfully', {
                    position: toast.POSITION.BOTTOM_CENTER,
                    style: 'width: auto'
                  })
            }).catch((error) => {
                toast.error('Adding Delegate failed', {
                    position: toast.POSITION.BOTTOM_CENTER
                  })
                console.log(error)
                loading.value = false
                throw error; // rethrow the error to be caught at the point where this function is called
            })
        }

    async function deleteDelegate(delegate_id) {
        loading.value = true
        await http.delete(`delegates/${delegate_id}/`).then(() => {
            delegates.value = delegates.value.filter( (delegate) => delegate.id != delegate_id) // keep all delegates that do not have the id of the deleted delegate
            loading.value = false
            toast.success('Delegate was deleted successfully', {
                position: toast.POSITION.BOTTOM_CENTER,
                style: 'width: auto'
              })
        }).catch((error) => {
            toast.error('Deleting Delegate failed', {
                position: toast.POSITION.BOTTOM_CENTER
              })
            console.log(error)
            loading.value = false
            throw error; // rethrow the error to be caught at the point where this function is called
        })
    }

    async function assignSchool(delegate_id, school_id) {
        loading.value = true
        await http.patch(`delegates/${delegate_id}/`, {school: school_id}).then( (res) => {
            let index = delegates.value.findIndex( (delegate) => delegate.id == delegate_id)
            delegates.value[index] = res.data
            loading.value = false
            toast.success('School was selected successfully', {
                position: toast.POSITION.BOTTOM_CENTER,
                style: 'width: auto'
              })
        }).catch((error) => {
            toast.error('Selecting School failed', {
                position: toast.POSITION.BOTTOM_CENTER
              })
            console.log(error)
            loading.value = false
            throw error; // rethrow the error to be caught at the point where this function is called
        })
    }
    
    
    return {delegates, delegate, loading, getDelegates, getDelegate, updateDelegate, createDelegate, deleteDelegate, assignSchool}

})