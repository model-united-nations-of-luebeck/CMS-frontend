import { defineStore } from 'pinia'
import {inject, ref} from 'vue'

export const useMemberOrganizationsStore = defineStore('member_organizations', () => {
    const http = inject('backend_instance');
    const member_organizations = ref([])
    const member_organization = ref(null)
    const loading = ref(false)

    function initializeMemberOrganization(){
        member_organization.value = {
            name: '',
            official_name: '',
            placard_name: '',
            status: 'member state',
            flag: '',
            active: true
            }
    }
    
    async function getMemberOrganizations() {
        loading.value = true
        await http.get("member-organizations/").then( (res) => {
                member_organizations.value = res.data
                loading.value = false
            }).catch((error) => {
                console.log(error)
                loading.value = false
                throw error; // rethrow the error to be caught at the point where this function is called
            })
        }

    async function getMemberOrganization(member_organization_id){  //notice the singular form of the function name
        loading.value = true
        await http.get(`member-organizations/${member_organization_id}/`).then( (res) => {
            member_organization.value = res.data
            loading.value = false
        }).catch((error) => {
            console.log(error)
            loading.value = false
            throw error; // rethrow the error to be caught at the point where this function is called
        })
    }

    async function toggleActive(member_organization_id){
        loading.value = true
        await http.patch(`member-organizations/${member_organization_id}/`, {'active': member_organizations.value.find( (org) => org.id == member_organization_id)?.active}).then(() => {
            let index = member_organizations.value.findIndex( (org) => org.id == member_organization_id)
            if (index !== -1) {
                member_organizations.value[index].active = !member_organizations.value[index].active
            }
            loading.value = false
        }).catch((error) => {
            console.log(error)
            loading.value = false
            throw error; // rethrow the error to be caught at the point where this function is called
        })
        
    }

    async function updateMemberOrganization(member_organization_id){
        loading.value = true
        await http.patch(`member-organizations/${member_organization_id}/`, member_organization.value).then(() => {
            let index = member_organizations.value.findIndex( (org) => org.id == member_organization_id)
            if (index !== -1) {
                member_organizations.value[index] = {...member_organizations.value[index], ...member_organization.value}
            }
            loading.value = false
            
        }).catch((error) => {
            console.log(error)
            loading.value = false
            throw error; // rethrow the error to be caught at the point where this function is called
        })
    }

    async function createMemberOrganization(){
        loading.value = true
        await http.post("member-organizations/", member_organization.value).then( (res) => {
            member_organizations.value.push(res.data)
            loading.value = false
        }).catch((error) => {
            console.log(error)
            loading.value = false
            throw error; // rethrow the error to be caught at the point where this function is called
        })
    }

    async function deleteMemberOrganization(member_organization_id){
        await http.delete(`member-organizations/${member_organization_id}/`).then(() => {
            member_organizations.value = member_organizations.value.filter( (org) => org.id != member_organization_id) // keep all member_organizations that do not have the id of the deleted member_organization
        }).catch((error) => {
            console.log(error)
            throw error; // rethrow the error to be caught at the point where this function is called
        })    
    }

    return {member_organizations, member_organization, loading, getMemberOrganizations, getMemberOrganization, toggleActive, updateMemberOrganization, initializeMemberOrganization, createMemberOrganization, deleteMemberOrganization}
})
