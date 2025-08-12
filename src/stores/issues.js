import { defineStore } from 'pinia'
import { inject, ref } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export const useIssuesStore = defineStore('issues', () => {
    const http = inject('backend_instance');
    const issues = ref([])
    const issue = ref(null)
    const loading = ref(false)

    function initializeIssue() {
        issue.value = {            
            name: '',
            forum: ''
        }
    }

    async function getIssues() {
        loading.value = true
        await http.get("issues/").then((res) => {
            issues.value = res.data
            loading.value = false
        }).catch((error) => {
            console.error(error)
            loading.value = false
            throw error;
        })
    }

    async function getIssue(issue_id) {
        loading.value = true
        await http.get(`issues/${issue_id}/`).then((res) => {
            issue.value = res.data
            loading.value = false
        }).catch((error) => {
            console.error(error)
            loading.value = false
            throw error;
        })
    }

    async function updateIssue(issue_id) {
        loading.value = true
        await http.patch(`issues/${issue_id}/`, issue.value).then(() => {
            let index = issues.value.findIndex((issue) => issue.id == issue_id)
            if (index !== -1) {
                issues.value[index] = { ...issues.value[index], ...issue.value }
            }
            loading.value = false
            toast.success('Issue was updated successfully', {
                position: toast.POSITION.BOTTOM_CENTER,
                style: 'width: auto'
            })
        }).catch((error) => {
            toast.error('Updating Issue failed. Please ask admin for help.', {
                position: toast.POSITION.BOTTOM_CENTER
            })
            console.error(error)
            loading.value = false
            throw error;
        })
    }

    async function createIssue() {
        loading.value = true
        await http.post("issues/", issue.value).then((res) => {
            issues.value.push(res.data)
            loading.value = false
            toast.success('Issue was added successfully', {
                position: toast.POSITION.BOTTOM_CENTER,
                style: 'width: auto'
            })
        }).catch((error) => {
            toast.error('Adding Issue failed. Please ask admin for help.', {
                position: toast.POSITION.BOTTOM_CENTER
            })
            console.error(error)
            loading.value = false
            throw error;
        })
    }

    async function deleteIssue(issue_id) {
        await http.delete(`issues/${issue_id}/`).then(() => {
            issues.value = issues.value.filter((issue) => issue.id != issue_id)
            toast.success('Issue was deleted successfully', {
                position: toast.POSITION.BOTTOM_CENTER,
                style: 'width: auto'
            })
        }).catch((error) => {
            toast.error('Deleting Issue failed. Please ask admin for help.', {
                position: toast.POSITION.BOTTOM_CENTER
            })
            console.error(error)
            throw error;
        })
    }

    return { issues, issue, loading, getIssues, getIssue, updateIssue, initializeIssue, createIssue, deleteIssue }
})
