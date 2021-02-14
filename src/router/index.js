import Vue from "vue";
import Router from "vue-router";
import Management from "@/components/Management";
import Home from "@/components/management/Home";
import Schools from "@/components/management/Schools";
import Delegates from "@/components/management/Delegates";
import Issues from "@/components/management/Issues";
import Advisors from "@/components/management/Advisors";
import MemberOrganizations from "@/components/management/MemberOrganizations";
import Locations from "@/components/management/Locations";
import Registration from "@/components/Registration";
import PreRegistration from "@/components/registration/PreRegistration";
import Processing from "@/components/registration/Processing";
import FinalRegistration from "@/components/registration/FinalRegistration";

Vue.use(Router);

/**
 * Top level routes support metadata which will affect the navbar
 * meta.hideTabs {Boolean} will hide tabs for child routes
 * meta.enumerateTabs {Boolean} will prepend the index of the child routes (1. FirstTab, 2. SecondTab)
 */
export default new Router({
  routes: [
    {
      path: "/manage",
      name: "Conference Management System",
      component: Management,
      meta: { hideTabs: true },
      children: [
        {
          path: "schools",
          name: "Schools",
          component: Schools,
        },
        {
          path: "delegates",
          name: "Delegates",
          component: Delegates,
        },
        {
          path: "issues",
          name: "Issues",
          component: Issues,
        },
        {
          path: "advisors",
          name: "Advisors",
          component: Advisors,
        },
        {
          path: "member-organizations",
          name: "MemberOrganizations",
          component: MemberOrganizations,
        },
        {
          path: "locations",
          name: "Locations",
          component: Locations,
        },
        {
          path: "",
          name: "Home",
          component: Home,
        },
      ],
    },
    {
      path: "/registration",
      name: "Registration MUNOL",
      component: Registration,
      meta: {
        enumerateTabs: true,
      },
      children: [
        {
          path: "",
          name: "Pre Registration",
          component: PreRegistration,
        },
        {
          path: "processing",
          name: "Processing",
          component: Processing,
        },
        {
          path: "final",
          name: "Final Registration",
          component: FinalRegistration,
        },
      ],
    },
    {
      path: "/",
      redirect: "/registration",
    },
  ],
  mode: "history",
});
