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

    async function resetDelegate(delegate_id) {
        loading.value = true

        // Reset the delegate object to its initial state, except for the id, represents, forum, role, school and ambassador fields
        delegate.value = {
            id: delegate_id,
            first_name: "",
            last_name: "",
            gender: "f",
            pronouns: null,
            email: null,
            mobile: null,
            picture: null,
            birthday: null,
            extras: null,
            data_consent_time: null,
            data_consent_ip: null,
            media_consent_time: null,
            media_consent_ip: null,
            first_timer: true,
        }

        await http.patch(`delegates/${delegate_id}/`, delegate.value).then(() => {
            let index = delegates.value.findIndex( (delegate) => delegate.id == delegate_id)
            delegates.value[index] = {...delegates.value[index], ...delegate.value} // update the delegate in the delegates array with the reset values
            
            loading.value = false
            toast.success('Delegate was reset successfully', {
                position: toast.POSITION.BOTTOM_CENTER,
                style: 'width: auto'
              })
        }).catch((error) => {
            toast.error('Resetting Delegate failed', {
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

    async function changeAmbassador(delegate_id){
        loading.value = true

        // turn ambassador role off for all delegates from this delegation
        let org_id = delegates.value.find( (delegate) => delegate.id == delegate_id).represents
        let ambassadors_from_org = delegates.value.filter( (delegate) => delegate.represents == org_id && delegate.ambassador)
        for (let ambassador of ambassadors_from_org) {
            if (ambassador.id != delegate_id) {
                await http.patch(`delegates/${ambassador.id}/`, {ambassador: false}).then( () => {
                    let index = delegates.value.findIndex( (delegate) => delegate.id == ambassador.id)
                    delegates.value[index].ambassador = false
                }).catch((error) => {
                    console.log(error)
                    toast.error('Unsetting Delegate as Ambassador failed', {
                        position: toast.POSITION.BOTTOM_CENTER
                      })
                    throw error; // rethrow the error to be caught at the point where this function is called
                })
            }
        }
        
        // turn ambassador role on for the selected delegate
        await http.patch(`delegates/${delegate_id}/`, {ambassador: true}).then( () => {
            let index = delegates.value.findIndex( (delegate) => delegate.id == delegate_id)
            delegates.value[index].ambassador = true
            loading.value = false
            toast.success('Delegate was successfully set as Ambassador', {
                position: toast.POSITION.BOTTOM_CENTER,
                style: 'width: auto'
              })
        }).catch((error) => {
            toast.error('Setting Delegate as Ambassador failed', {
                position: toast.POSITION.BOTTOM_CENTER
              })
              loading.value = false
            console.log(error)
            throw error; // rethrow the error to be caught at the point where this function is called
        })
        
    }
    
    
    return {delegates, delegate, loading, getDelegates, getDelegate, updateDelegate, createDelegate, resetDelegate, deleteDelegate, assignSchool, changeAmbassador}

})