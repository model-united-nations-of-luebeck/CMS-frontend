import { defineStore } from 'pinia'
import {inject, ref} from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export const useStaffsStore = defineStore('staffs', () => {
    const http = inject('backend_instance');
    const staffs = ref([])
    const staff = ref(null)
    const loading = ref(false)

    
    async function getStaffs() {
        loading.value = true
        await http.get("staffs/").then( (res) => {
                staffs.value = res.data
                loading.value = false
            }).catch((error) => {
                console.log(error)
                loading.value = false
                throw error; // rethrow the error to be caught at the point where this function is called
            })
        }

    async function getStaff(staff_id){  //notice the singular form of the function name
        loading.value = true
        await http.get(`staffs/${staff_id}/`).then( (res) => {
            staff.value = res.data
            loading.value = false
        }).catch((error) => {
            console.log(error)
            loading.value = false
            throw error; // rethrow the error to be caught at the point where this function is called
        })
    }


    async function updateStaff(staff_id){
        loading.value = true
        await http.patch(`staffs/${staff_id}/`, staff.value).then(() => {
            let index = staffs.value.findIndex( (staff) => staff.id == staff_id)
            if (index !== -1) {
                staffs.value[index] = {...staffs.value[index], ...staff.value}
            }
            loading.value = false
            toast.success('Staff was updated successfully', {
                position: toast.POSITION.BOTTOM_CENTER,
                style: 'width: auto'
              })
        }).catch((error) => {
            toast.error('Updating Staff failed', {
                position: toast.POSITION.BOTTOM_CENTER
              })
            console.log(error)
            loading.value = false
            throw error; // rethrow the error to be caught at the point where this function is called
        })
    }

    async function createStaff(position_name){
        loading.value = true
        await http.post("staffs/", {position_name: position_name}).then( (res) => {
            staffs.value.push(res.data)
            loading.value = false
            toast.success('Staff was added successfully', {
                position: toast.POSITION.BOTTOM_CENTER,
                style: 'width: auto'
              })
        }).catch((error) => {
            toast.error('Creating Staff failed', {
                position: toast.POSITION.BOTTOM_CENTER
              })
            console.log(error)
            loading.value = false
            throw error; // rethrow the error to be caught at the point where this function is called
        })
    }

    async function deleteStaff(staff_id){
        await http.delete(`staffs/${staff_id}/`).then(() => {
            staffs.value = staffs.value.filter( (staff) => staff.id != staff_id) // keep all staffs that do not have the id of the deleted staff
            toast.success('Staff was deleted successfully', {
                position: toast.POSITION.BOTTOM_CENTER,
                style: 'width: auto'
              })
        }).catch((error) => {
            toast.error('Deleting Staff failed', {
                position: toast.POSITION.BOTTOM_CENTER
              })
            console.log(error)
            throw error; // rethrow the error to be caught at the point where this function is called
        })    
    }

    return {staffs, staff, loading, getStaffs, getStaff, updateStaff, createStaff, deleteStaff}
})