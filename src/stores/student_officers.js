import { defineStore } from 'pinia'
import {inject, ref} from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export const useStudentOfficersStore = defineStore('student_officers', () => {
    const http = inject('backend_instance');
    const student_officers = ref([])
    const student_officer = ref(null)
    const loading = ref(false)

    
    async function getStudentOfficers() {
        loading.value = true
        await http.get("student-officers/").then( (res) => {
                student_officers.value = res.data
                loading.value = false
            }).catch((error) => {
                console.log(error)
                loading.value = false
                throw error; // rethrow the error to be caught at the point where this function is called
            })
        }

    async function getStudentOfficer(student_officer_id){  //notice the singular form of the function name
        loading.value = true
        await http.get(`student-officers/${student_officer_id}/`).then( (res) => {
            student_officer.value = res.data
            loading.value = false
        }).catch((error) => {
            console.log(error)
            loading.value = false
            throw error; // rethrow the error to be caught at the point where this function is called
        })
    }


    async function updateStudentOfficer(student_officer_id){
        loading.value = true
        await http.patch(`student-officers/${student_officer_id}/`, student_officer.value).then(() => {
            loading.value = false
            toast.success('Student Officer was updated successfully', {
                position: toast.POSITION.BOTTOM_CENTER,
                style: 'width: auto'
              })
        }).catch((error) => {
            toast.error('Updating Student Officer failed', {
                position: toast.POSITION.BOTTOM_CENTER
              })
            console.log(error)
            loading.value = false
            throw error; // rethrow the error to be caught at the point where this function is called
        })
    }

    async function createStudentOfficer(position_name, school_name, forum){
        loading.value = true
        await http.post("student-officers/", {position_name: position_name, school_name: school_name, forum: forum }).then( (res) => {
            student_officers.value.push(res.data)
            loading.value = false
            toast.success('Student Officer was added successfully', {
                position: toast.POSITION.BOTTOM_CENTER,
                style: 'width: auto'
              })
        }).catch((error) => {
            toast.error('Creating Student Officer failed', {
                position: toast.POSITION.BOTTOM_CENTER
              })
            console.log(error)
            loading.value = false
            throw error; // rethrow the error to be caught at the point where this function is called
        })
    }

    

    async function deleteStudentOfficer(student_officer_id){
        await http.delete(`student-officers/${student_officer_id}/`).then(() => {
            student_officers.value = student_officers.value.filter( (student_officer) => student_officer.id != student_officer_id) // keep all student officers that do not have the id of the deleted student officer
            toast.success('Student Officer was deleted successfully', {
                position: toast.POSITION.BOTTOM_CENTER,
                style: 'width: auto'
              })
        }).catch((error) => {
            toast.error('Deleting Student Officer failed', {
                position: toast.POSITION.BOTTOM_CENTER
              })
            console.log(error)
            throw error; // rethrow the error to be caught at the point where this function is called
        })    
    }

    return {student_officers, student_officer, loading, getStudentOfficers, getStudentOfficer, updateStudentOfficer, createStudentOfficer, deleteStudentOfficer}
})