import { defineStore } from "pinia";
import { inject, ref } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export const useAdvisorsStore = defineStore("advisors", () => {
  const http = inject("backend_instance");
  const advisors = ref([]);
  const advisor = ref(null);
  const loading = ref(false);

  function initializeAdvisor() {
    advisor.value = {
      gender: "f",
      pronouns: "",
      first_name: "",
      last_name: "",
      mobile: "",
      email: "",
      extras: "",
      picture: "",
      availability: "",
      car: false,
      experience: "",
      help: [],
      consent_data: true,
      consent_media: true,
    };
  }

  async function getAdvisors() {
    loading.value = true;
    await http
      .get("advisors/")
      .then((res) => {
        advisors.value = res.data.map((advisor) => {
          advisor.help =
            advisor.help && advisor.help?.trim() !== ""
              ? advisor.help
                  .split(",")
                  .map((item) => item.trim())
                  .filter((item) => item !== "")
              : [];
          return advisor;
        });
        loading.value = false;
      })
      .catch((error) => {
        console.error(error);
        loading.value = false;
        throw error; // rethrow the error to be caught at the point where this function is called
      });
  }

  async function getAdvisor(advisor_id) {
    //notice the singular form of the function name
    loading.value = true;
    await http
      .get(`advisors/${advisor_id}/`)
      .then((res) => {
        advisor.value = res.data;
        advisor.value.help =
          advisor.value.help && advisor.value.help?.trim() !== ""
            ? advisor.value.help
                .split(",")
                .map((item) => item.trim())
                .filter((item) => item !== "")
            : [];
        loading.value = false;
      })
      .catch((error) => {
        console.error(error);
        loading.value = false;
        throw error; // rethrow the error to be caught at the point where this function is called
      });
  }

  async function updateAdvisor(advisor_id) {
    loading.value = true;
    advisor.value.help = advisor.value.help.filter((item) => item.trim() !== "").join(", ");
    await http
      .patch(`advisors/${advisor_id}/`, advisor.value)
      .then(() => {
        const index = advisors.value.findIndex((a) => a.id === advisor_id);
        if (index !== -1) {
          advisor.value.help =
            advisor.value.help && advisor.value.help?.trim() !== ""
              ? advisor.value.help
                  .split(",")
                  .map((item) => item.trim())
                  .filter((item) => item !== "")
              : [];
          advisors.value[index] = { ...advisors.value[index], ...advisor.value };
        }
        loading.value = false;
        toast.success("Advisor was updated successfully", {
          position: toast.POSITION.BOTTOM_CENTER,
          style: "width: auto",
        });
      })
      .catch((error) => {
        if (
          error.response.status === 400 &&
          error.response.data.email[0] === "participant with this E-Mail already exists."
        ) {
          toast.error("Updating Advisor failed. An advisor with this email already exists.", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        } else {
          toast.error("Updating Advisor failed. Please ask admin for help.", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
        console.error(error);
        loading.value = false;
        throw error; // rethrow the error to be caught at the point where this function is called
      });
  }

  async function createAdvisor() {
    loading.value = true;
    if (Array.isArray(advisor.value.help)) {
      advisor.value.help = advisor.value.help.filter((item) => item.trim() !== "").join(", ");
    }
    await http
      .post("advisors/", advisor.value)
      .then((res) => {
        advisors.value.push(res.data);
        loading.value = false;
        toast.success("Advisor was added successfully", {
          position: toast.POSITION.BOTTOM_CENTER,
          style: "width: auto",
        });
      })
      .catch((error) => {
        if (
          error.response.status === 400 &&
          error.response.data.email[0] === "participant with this E-Mail already exists."
        ) {
          toast.error("Adding Advisor failed. An advisor with this email already exists.", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        } else {
          toast.error("Adding Advisor failed. Please ask admin for help.", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
        console.error(error);
        loading.value = false;
        throw error; // rethrow the error to be caught at the point where this function is called
      });

    if (typeof advisor.value.help === "string") {
      advisor.value.help = advisor.value.help
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "");
    }
  }

  async function deleteAdvisor(advisor_id) {
    await http
      .delete(`advisors/${advisor_id}/`)
      .then(() => {
        advisors.value = advisors.value.filter((advisor) => advisor.id != advisor_id); // keep all advisors that do not have the id of the deleted advisor
        toast.success("Advisor was deleted successfully", {
          position: toast.POSITION.BOTTOM_CENTER,
          style: "width: auto",
        });
      })
      .catch((error) => {
        toast.error("Deleting Advisor failed. Please ask admin for help.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        console.error(error);
        throw error; // rethrow the error to be caught at the point where this function is called
      });
  }

  return {
    advisors,
    advisor,
    loading,
    getAdvisors,
    getAdvisor,
    updateAdvisor,
    initializeAdvisor,
    createAdvisor,
    deleteAdvisor,
  };
});

export const predefined_help_keywords = [
  "awareness team",
  "IT",
  "resolution booklet",
  "organizational stuff",
  "crisis",
  "guest management",
  "mental support",
  "speech writing",
  "BBQ master",
  "proxy server",
  "showing around sponsors",
];
