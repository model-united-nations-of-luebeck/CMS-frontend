import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Schools from '@/components/Schools'
import Delegates from '@/components/Delegates'
import Issues from '@/components/Issues'
import Advisors from '@/components/advisors/Advisors'
import AdvisorDetails from '@/components/advisors/AdvisorDetails'
import Executives from '@/components/executives/Executives'
import ExecutiveDetails from '@/components/executives/ExecutiveDetails'
import StudentOfficers from '@/components/studentofficers/StudentOfficers'
import StudentOfficerDetails from '@/components/studentofficers/StudentOfficerDetails'
import Staffs from '@/components/staffs/Staffs'
import StaffDetails from '@/components/staffs/StaffDetails'
import MemberOrganizations from '@/components/MemberOrganizations'
import Conference from '@/components/Conference'
import Locations from '@/components/locations/Locations'
import LocationDetails from '@/components/locations/LocationDetails'
import RoomDetails from '@/components/locations/RoomDetails'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/schools',
      name: 'Schools',
      component: Schools
    },
    {
      path: '/delegates',
      name: 'Delegates',
      component: Delegates
    },
    {
      path: '/issues',
      name: 'Issues',
      component: Issues
    },
    {
      path: '/advisors',
      name: 'Advisors',
      component: Advisors
    },
    {
      path: '/advisors/:id',
      name: 'AdvisorDetails',
      component: AdvisorDetails,
      props: true,
    },
    {
      path: '/executives',
      name: 'Executives',
      component: Executives
    },
    {
      path: '/executives/:id',
      name: 'ExecutiveDetails',
      component: ExecutiveDetails,
      props: true,
    },
    {
      path: '/student-officers',
      name: 'StudentOfficers',
      component: StudentOfficers
    },
    {
      path: '/student-officers/:id',
      name: 'StudentOfficerDetails',
      component: StudentOfficerDetails,
      props: true,
    },
    {
      path: '/staffs',
      name: 'Staffs',
      component: Staffs
    },
    {
      path: '/staffs/:id',
      name: 'StaffDetails',
      component: StaffDetails,
      props: true,
    },
    {
      path: '/member-organizations',
      name: 'MemberOrganizations',
      component: MemberOrganizations
    },
    {
      path: '/locations',
      name: 'Locations',
      component: Locations
    },
    {
      path: '/conference',
      name: 'Conference',
      component: Conference
    },
    {
      path: '/rooms',
      name: 'Rooms',
      component: Locations //TODO: automatically select rooms tab in Locations component
    },
    {
      path: '/locations/:id',
      name: 'LocationDetails',
      component: LocationDetails,
      props: true
    },
    {
      path: '/rooms/:id',
      name: 'RoomDetails',
      component: RoomDetails,
      props: true
    }
  ],
  mode: 'history'
})