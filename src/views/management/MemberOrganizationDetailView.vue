<script setup>
import { useMemberOrganizationsStore } from '../../stores/member_organizations'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const route = useRoute()
const router = useRouter()
const memberOrganizationsStore = useMemberOrganizationsStore()

if (route.params.member_organization_id != 'add') {
  memberOrganizationsStore.getMemberOrganization(route.params.member_organization_id)
} else {
  memberOrganizationsStore.initializeMemberOrganization()
}

const MEMBER_STATE = 'member state'
const OBSERVER_STATE = 'observer state'
const FORMER_MEMBER = 'former member state'
const NON_GOVERNMENTAL_ORGANIZATION = 'non-governmental organization'
const INTER_GOVERNMENTAL_ORGANIZATION = 'inter-governmental organization'
const UN_SUB_BODY = 'UN sub-body'

const status_choices = [
  MEMBER_STATE,
  OBSERVER_STATE,
  FORMER_MEMBER,
  NON_GOVERNMENTAL_ORGANIZATION,
  INTER_GOVERNMENTAL_ORGANIZATION,
  UN_SUB_BODY
]

const updateMemberOrganization = (member_organization_id) => {
  if (member_organization_id == undefined) {
    // create new member organization
    memberOrganizationsStore
      .createMemberOrganization()
      .then(() => {
        toast.success('Member Organization was added successfully', {
          position: toast.POSITION.BOTTOM_CENTER,
          style: 'width: auto'
        })
        router.push({ name: 'member-organizations' })
      })
      .catch(() => {
        toast.error('Adding Member Organization failed', {
          position: toast.POSITION.BOTTOM_CENTER
        })
      })
  } else {
    // update existing member organization
    console.log('update member org' + member_organization_id)

    memberOrganizationsStore
      .updateMemberOrganization(member_organization_id)
      .then(() => {
        toast.success('Member Organization was updated successfully', {
          position: toast.POSITION.BOTTOM_CENTER,
          style: 'width: auto'
        })
        router.push({ name: 'member-organizations' })
      })
      .catch(() => {
        toast.error('Updating Member Organization failed', {
          position: toast.POSITION.BOTTOM_CENTER
        })
      })
  }
}
</script>

<template>
  <div class="">
    <v-breadcrumbs
      :items="[
        { title: 'Member Organizations', to: { name: 'member-organizations' } },
        { title: memberOrganizationsStore.member_organization.name }
      ]"
    >
      <template v-slot:prepend>
        <v-icon icon="mdi-flag-variant" size="small" start></v-icon>
      </template>
    </v-breadcrumbs>

    <v-form>
      <v-container>
        <v-row>
          <v-col cols="6">
            <v-text-field
              label="Name"
              prepend-icon="mdi-label"
              v-model="memberOrganizationsStore.member_organization.name"
              :loading="memberOrganizationsStore.loading"
              hint="Use common (short) version of the name, e.g. 'Russia' instead of 'Russian Federation' or 'EU' instead of 'European Union', so use abbreviations. This name is only used internally and thus allows to create Countries twice, e.g. China 1 and China 2 if the delegation is split between two schools."
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field
              label="Official Name"
              prepend-icon="mdi-bank"
              v-model="memberOrganizationsStore.member_organization.official_name"
              :loading="memberOrganizationsStore.loading"
              hint="Official name as stated on resolutions of the UN, e.g. 'Russian Federation' instead of Russia. No abbreviations allowed here."
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field
              label="Placard Name"
              prepend-icon="mdi-tag"
              v-model="memberOrganizationsStore.member_organization.placard_name"
              :loading="memberOrganizationsStore.loading"
              hint="The best readable compromise between no abbreviation but also not the full official name"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-select
              label="Status in the UN"
              :items="status_choices"
              v-model="memberOrganizationsStore.member_organization.status"
              prepend-icon="mdi-shield-star-outline"
              hint="The status might affect the placard color and voting rights."
            >
            </v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field
              label="Flag URL"
              prepend-icon="mdi-flag-variant"
              v-model="memberOrganizationsStore.member_organization.flag"
              :loading="memberOrganizationsStore.loading"
              clearable
              hint="URL to SVG Flag file of the Member Organization if it has one"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">
            <v-avatar
              :class="{ grayscale: !memberOrganizationsStore.member_organization.active }"
              :image="memberOrganizationsStore.member_organization.flag"
              rounded="0"
              size="x-large"
            >
            </v-avatar>
          </v-col>
          <v-col cols="3">
            <v-switch
              v-model="memberOrganizationsStore.member_organization.active"
              :label="`Active: ${
                memberOrganizationsStore.member_organization.active ? 'Yes' : 'No'
              }`"
              inset
              color="primary"
              prepend-icon="mdi-blank"
              :loading="memberOrganizationsStore.loading ? 'primary' : false"
            ></v-switch>
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-btn
            id="submit-btn"
            color="primary"
            prepend-icon="mdi-send"
            @click="updateMemberOrganization(memberOrganizationsStore.member_organization.id)"
            >{{ route.params.member_organization_id == 'add' ? 'add' : 'update' }} member
            organization</v-btn
          >
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<style>
.grayscale {
  filter: gray; /* IE6-9 */
  -webkit-filter: grayscale(1); /* Google Chrome, Safari 6+ & Opera 15+ */
  filter: grayscale(1); /* Microsoft Edge and Firefox 35+ */
}
</style>
