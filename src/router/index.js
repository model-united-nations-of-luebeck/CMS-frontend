import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Schools from '@/components/Schools'
import Delegates from '@/components/Delegates'
import Issues from '@/components/Issues'
import Advisors from '@/components/Advisors'
import MemberOrganizations from '@/components/MemberOrganizations'
import Locations from '@/components/Locations'
import Conference from '@/components/Conference'

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
  ],
  mode: 'history'
})