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
                console.error(error)
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
            console.error(error)
            loading.value = false
            throw error; // rethrow the error to be caught at the point where this function is called
        })
    }

    async function updateDelegate(delegate_id){
        loading.value = true
        await http.patch(`delegates/${delegate_id}/`, delegate.value).then(() => {
            let index = delegates.value.findIndex( (delegate) => delegate.id == delegate_id)
            if (index !== -1) {
                delegates.value[index] = {...delegates.value[index], ...delegate.value}
            }
            loading.value = false
            toast.success('Delegate was updated successfully', {
                position: toast.POSITION.BOTTOM_CENTER,
                style: 'width: auto'
              })
        }).catch((error) => {
            if(error.response && error.response.status === 400 && error.response.data.email) {
                toast.error('Updating Delegate failed. An delegate with this email already exists.', {
                    position: toast.POSITION.BOTTOM_CENTER
                  })
            } else {
                toast.error('Updating Delegate failed. Please ask admin for help.', {
                    position: toast.POSITION.BOTTOM_CENTER
                  })
            }
            console.error(error)
            loading.value = false
            throw error; // rethrow the error to be caught at the point where this function is called
        })
    }

    async function createDelegate(forum_id, org_id) {
        loading.value = true
        await http.post("delegates/", {forum: forum_id, represents: org_id}).then( (res) => {
                delegates.value.push(res.data)
                loading.value = false
            }).catch((error) => {
                toast.error('Creating Delegate failed. Please ask admin for help.', {
                    position: toast.POSITION.BOTTOM_CENTER
                  })
                console.error(error)
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
            if (index !== -1) {
                delegates.value[index] = {...delegates.value[index], ...delegate.value} 
            }
            loading.value = false
            toast.success('Delegate was reset successfully', {
                position: toast.POSITION.BOTTOM_CENTER,
                style: 'width: auto'
              })
        }).catch((error) => {
            toast.error('Resetting Delegate failed. Please ask admin for help.', {
                position: toast.POSITION.BOTTOM_CENTER
              })
            console.error(error)
            loading.value = false
            throw error; // rethrow the error to be caught at the point where this function is called
        })
    }

    async function deleteDelegate(delegate_id) {
        loading.value = true
        await http.delete(`delegates/${delegate_id}/`).then(() => {
            delegates.value = delegates.value.filter( (delegate) => delegate.id != delegate_id) // keep all delegates that do not have the id of the deleted delegate
            loading.value = false 
        }).catch((error) => {
            toast.error('Deleting Delegate failed. Please ask admin for help.', {
                position: toast.POSITION.BOTTOM_CENTER
              })
            console.error(error)
            loading.value = false
            throw error; // rethrow the error to be caught at the point where this function is called
        })
    }

    async function assignSchool(delegate_id, school_id) {
        // check delegates can only be unassigned from a school if no data is filled in yet (checked by data consent time given)
        if (delegates.value.find( (delegate) => delegate.id == delegate_id).data_consent_time) {
            toast.error('Delegate has already filled in data, cannot unassign from school. Please reset delegate first.', {
                position: toast.POSITION.BOTTOM_CENTER
              })
            
        } else {
            loading.value = true
            await http.patch(`delegates/${delegate_id}/`, {school: school_id}).then( () => {
                let index = delegates.value.findIndex( (delegate) => delegate.id == delegate_id)
                if (index !== -1) {
                    delegates.value[index].school = school_id
                }
                loading.value = false
            }).catch((error) => {
                toast.error(`${school_id ? 'Assigning' : 'Unassigning'} School failed. Please ask admin for help.`, {
                    position: toast.POSITION.BOTTOM_CENTER
                })
                console.error(error)
                loading.value = false
                throw error; // rethrow the error to be caught at the point where this function is called
            })
        }
    }

    async function changeAmbassador(delegate_id){
        loading.value = true

        // turn ambassador role on for the selected delegate
        await http.patch(`delegates/${delegate_id}/`, {ambassador: true}).then( () => {
            let index = delegates.value.findIndex( (delegate) => delegate.id == delegate_id)
            if (index !== -1) {
                delegates.value[index].ambassador = true
            }

            // turn ambassador role off locally for all other delegates of the same member organization, this is also done by the backend but this way the UI updates immediately
            delegates.value.forEach( (delegate) => {
                if (delegate.id != delegate_id && delegate.represents == delegates.value[index].represents && delegate.ambassador) {
                    delegate.ambassador = false
                }
            })

            loading.value = false
            toast.success('Delegate was successfully set as Ambassador', {
                position: toast.POSITION.BOTTOM_CENTER,
                style: 'width: auto'
              })
        }).catch((error) => {
            toast.error('Setting Delegate as Ambassador failed. Please ask admin for help.', {
                position: toast.POSITION.BOTTOM_CENTER
              })
              loading.value = false
            console.error(error)
            throw error; // rethrow the error to be caught at the point where this function is called
        })
        
    }
    
    
    return {delegates, delegate, loading, getDelegates, getDelegate, updateDelegate, createDelegate, resetDelegate, deleteDelegate, assignSchool, changeAmbassador}

})