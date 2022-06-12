import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Schools from '@/components/Schools'
import Delegates from '@/components/delegates/Delegates'
import DelegateDetails from '@/components/delegates/DelegateDetails'
import MUNDirectors from '@/components/mundirectors/MUNDirectors'
import MUNDirectorDetails from '@/components/mundirectors/MUNDirectorDetails'
import Advisors from '@/components/advisors/Advisors'
import AdvisorDetails from '@/components/advisors/AdvisorDetails'
import Executives from '@/components/executives/Executives'
import ExecutiveDetails from '@/components/executives/ExecutiveDetails'
import StudentOfficers from '@/components/studentofficers/StudentOfficers'
import StudentOfficerDetails from '@/components/studentofficers/StudentOfficerDetails'
import Staffs from '@/components/staffs/Staffs'
import StaffDetails from '@/components/staffs/StaffDetails'
import MemberOrganizations from '@/components/MemberOrganizations'
import Forums from '@/components/forums/Forums'
import ForumDetails from '@/components/forums/ForumDetails'
import Issues from '@/components/issues/Issues'
import IssueDetails from '@/components/issues/IssueDetails'
import Conference from '@/components/Conference'
import Locations from '@/components/locations/Locations'
import LocationDetails from '@/components/locations/LocationDetails'
import RoomDetails from '@/components/locations/RoomDetails'
import Events from '@/components/events/Events'
import CountryAllocation from '@/components/countryallocation/CountryAllocation'
import Printing from '@/components/Printing'
import Insights from '@/components/insights/Insights'

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
      path: '/delegates',
      name: 'Delegates',
      component: Delegates
    },
    {
      path: '/delegates/:id',
      name: 'DelegateDetails',
      component: DelegateDetails,
      props: true,
    },
    {
      path: '/mun-directors',
      name: 'MUNDirectors',
      component: MUNDirectors
    },
    {
      path: '/mun-directors/:id',
      name: 'MUNDirectorDetails',
      component: MUNDirectorDetails,
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
      path: '/forums',
      name: 'Forums',
      component: Forums
    },
    {
      path: '/forums/:id',
      name: 'ForumDetails',
      component: ForumDetails,
      props: true,
    },
    {
      path: '/issues',
      name: 'Issues',
      component: Issues
    },
    {
      path: '/issues/:id',
      name: 'IssueDetails',
      component: IssueDetails,
      props: true,
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
    },{
      path: '/events',
      name: 'Events',
      component: Events,
    },{
      path: '/country-allocation',
      name: 'CountryAllocation',
      component: CountryAllocation,
    },
    {
      path: '/printing',
      name: 'Printing',
      component: Printing
    },
    {
      path: '/insights',
      name: 'Insights',
      component: Insights
    },
  ],
  mode: 'history',
  base: process.env.NODE_ENV === 'production'     
  ? '/trix/cms/'     
  : '/'
})