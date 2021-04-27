import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Schools from '@/components/Schools'
import Delegates from '@/components/Delegates'
import Issues from '@/components/Issues'
import Advisors from '@/components/advisors/Advisors'
import AdvisorDetails from '@/components/advisors/AdvisorDetails'
import MemberOrganizations from '@/components/MemberOrganizations'
<<<<<<< HEAD
import Locations from '@/components/Locations'
import Conference from '@/components/Conference'
=======
import Locations from '@/components/locations/Locations'
import LocationDetails from '@/components/locations/LocationDetails'
import RoomDetails from '@/components/locations/RoomDetails'
>>>>>>> fa12d60 (Added location management)

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