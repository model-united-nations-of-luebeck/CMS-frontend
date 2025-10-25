import { createRouter, createWebHistory } from "vue-router";

/**
 * The meta property allows to add additional information like the title.
 * This will be used to set the HTML header title.
 */

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
  routes: [
    {
      path: "/management/",
      name: "conference-management-system",
      meta: {
        title: `${import.meta.env.VITE_CONFERENCE_ABBREVIATION} Conference Management System`,
      },
      component: () => import("../views/management/ManagementView.vue"),
      children: [
        {
          path: "",
          name: "startpage",
          component: () => import("../views/management/StartpageView.vue"),
        },
        {
          path: "conference",
          name: "conference",
          component: () => import("../views/management/ConferenceView.vue"),
        },
         {
          path: "schools/:school_id/view",
          name: "school-view",
          component: () => import("../views/management/SchoolView.vue"),
        },
        {
          path: "schools/:school_id",
          name: "school-detail",
          component: () => import("../views/management/SchoolDetailView.vue"),
        },
        {
          path: "schools",
          name: "schools",
          component: () => import("../views/management/SchoolsView.vue"),
        },
        {
          path: "member-organizations/:member_organization_id",
          name: "member-organization-detail",
          component: () =>
            import("../views/management/MemberOrganizationDetailView.vue"),
        },
        {
          path: "member-organizations",
          name: "member-organizations",
          component: () =>
            import("../views/management/MemberOrganizationsView.vue"),
        },
        {
          path: "forums/:forum_id",
          name: "forum-detail",
          component: () => import("../views/management/ForumDetailView.vue"),
        },
        {
          path: "forums",
          name: "forums",
          component: () => import("../views/management/ForumsView.vue"),
        },
        {
          path: "plenaries/:plenary_id",
          name: "plenary-detail",
          component: () => import("../views/management/PlenaryDetailView.vue"),
        },
        {
          path: "issues/:issue_id",
          name: "issue-detail",
          component: () => import("../views/management/IssueDetailView.vue"),
        },
        {
          path: "issues",
          name: "issues",
          component: () => import("../views/management/IssuesView.vue"),
        },
        {
          path: "country-allocation",
          name: "country-allocation",
          component: () =>
            import("../views/management/CountryAllocationView.vue"),
        },
        {
          path: "delegates/:delegate_id",
          name: "delegate-detail",
          component: () => import("../views/management/DelegateDetailView.vue"),
        },
        {
          path: "delegates",
          name: "delegates",
          component: () => import("../views/management/DelegatesView.vue"),
        },
        {
          path: "mun-directors/:mun_director_id",
          name: "mun-director-detail",
          component: () =>
            import("../views/management/MUNDirectorDetailView.vue"),
        },
        {
          path: "mun-directors",
          name: "mun-directors",
          component: () => import("../views/management/MUNDirectorsView.vue"),
        },
        {
          path: "executives/:executive_id",
          name: "executive-detail",
          component: () =>
            import("../views/management/ExecutiveDetailView.vue"),
        },
        {
          path: "executives",
          name: "executives",
          component: () => import("../views/management/ExecutivesView.vue"),
        },
        {
          path: "student-officers/:student_officer_id",
          name: "student-officer-detail",
          component: () =>
            import("../views/management/StudentOfficerDetailView.vue"),
        },
        {
          path: "student-officers",
          name: "student-officers",
          component: () =>
            import("../views/management/StudentOfficersView.vue"),
        },
        {
          path: "staffs/:staff_id",
          name: "staff-detail",
          component: () => import("../views/management/StaffDetailView.vue"),
        },
        {
          path: "staffs",
          name: "staffs",
          component: () => import("../views/management/StaffsView.vue"),
        },
        {
          path: "advisors/:advisor_id",
          name: "advisor-detail",
          component: () => import("../views/management/AdvisorDetailView.vue"),
        },
        {
          path: "advisors",
          name: "advisors",
          component: () => import("../views/management/AdvisorsView.vue"),
        },
        {
          path: "insights",
          name: "insights",
          component: () => import("../views/management/InsightsView.vue"),
        },
        {
          path: "participant-search",
          name: "participant-search",
          component: () => import("../views/management/ParticipantSearchView.vue"),
        }
      ],
    },
    {
      path: "/school-registration/", 
      name: "school-registration",
      meta: {
        title: `${import.meta.env.VITE_CONFERENCE_ABBREVIATION} Registration`,
      },
      component: () => import("../views/registration/SchoolRegistrationView.vue"),
      children: [
        {
          path: ":school_id/", // school_id is a parameter that should be passed to the registration view
          name: "registration-startpage",
          component: () =>
            import("../views/registration/RegistrationStartpageView.vue"),
        },
        {
          path: ":school_id/pre-registration",
          name: "pre-registration",
          component: () =>
            import("../views/registration/PreRegistrationView.vue"),
        },
        {
          path: ":school_id/final-registration",
          name: "final-registration",
          component: () =>
            import("../views/registration/FinalRegistrationView.vue"),
        },
      ],
    },
    {
      path: "/registration/",
      name: "registration",
      meta: {
        title: `${import.meta.env.VITE_CONFERENCE_ABBREVIATION} Registration`,
      },
      component: () => import("../views/registration/RegistrationView.vue"),
      children: [
        {
          path: "advisors/:advisor_id",
          name: "advisor-registration",
          meta: {
            title: "Advisor Registration",
          },
          component: () =>
            import("../views/registration/AdvisorRegistrationView.vue"),
        },
        {
          path: "staffs/:staff_id",
          name: "staff-registration",
          meta: {
            title: "Staff Registration",
          },
          component: () =>
            import("../views/registration/StaffRegistrationView.vue"),
        },
        {
          path: "executives/:executive_id",
          name: "executive-registration",
          meta: {
            title: "Executive Registration",
          },
          component: () =>
            import("../views/registration/ExecutiveRegistrationView.vue"),
        },
        {
          path: "student-officers/:student_officer_id",
          name: "student-officer-registration",
          meta: {
            title: "Student Officer Registration",
          },
          component: () =>
            import("../views/registration/StudentOfficerRegistrationView.vue"),
        },
        {
          path: "final-registration-delegate/:delegate_id",
          name: "final-registration-delegate",
          meta: {
            title: "Delegate Registration",
          },
          component: () =>
            import("../views/registration/FinalRegistrationDelegateView.vue"),
        },
        {
          path: "final-registration-mun-director/:mun_director_id",
          name: "final-registration-mun-director",
          meta: {
            title: "MUN-Director Registration",
          },
          component: () =>
            import("../views/registration/FinalRegistrationMUNDirectorView.vue"),
        },
        {
          path: "privacy-policy",
          name: "privacy-policy",
          meta: {
            title: "Privacy Policy",
          },
          component: () =>
            import("../views/registration/PrivacyPolicyView.vue"),
        }
      ],
    },
    {
      // Sets the default path to the registration
      path: "/",
      redirect: "/registration",
    },
    {
      // catch all path to avoid 404 errors, redirects to /
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

// Sets the title depending on the route (e.g Conference Registration for /registration), defaults to Conference Management System
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || `${import.meta.env.VITE_CONFERENCE_ABBREVIATION} Conference Management System`; 

  // gives the page a bit of time to render the UI, e.g. closing the nav drawer into rail mode, before actually loading the new page
  setTimeout(() => {
    next();
  }, 500);
});

export default router;
