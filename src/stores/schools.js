import { defineStore } from "pinia";
import { inject, ref } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export const useSchoolsStore = defineStore("schools", () => {
  const http = inject("backend_instance");
  const schools = ref([]);
  const school = ref(null);
  const loading = ref(false);

  async function getSchools() {
    loading.value = true;
    await http
      .get("schools/")
      .then((res) => {
        schools.value = res.data;
        loading.value = false;
      })
      .catch((error) => {
        console.error(error);
        loading.value = false;
        throw error;
      });
  }

  async function getSchool(school_id) {
    //notice the singular form of the function name
    loading.value = true;
    await http
      .get(`schools/${school_id}/`)
      .then((res) => {
        school.value = res.data;
        loading.value = false;
      })
      .catch((error) => {
        console.error(error);
        loading.value = false;
        throw error;
      });
  }

  async function createSchool(school_name, username, password) {
    // create user first, then create school with user id
    loading.value = true;
    await http
      .post("schools/register/", { name: school_name, username: username, password: password })
      .then((res) => {
        schools.value.push(res.data);
        loading.value = false;
        toast.success("School was added successfully", {
          position: toast.POSITION.BOTTOM_CENTER,
          style: "width: auto",
        });
      })
      .catch((error) => {
        toast.error("Adding School failed. Please ask admin for help.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        console.error(error);
        loading.value = false;
        throw error; // rethrow the error to be caught at the point where this function is called
      });
  }

  async function updateSchool(school_id) {
    loading.value = true;
    await http
      .patch(`schools/${school_id}/`, school.value)
      .then(() => {
        let index = schools.value.findIndex((school) => school.id == school_id);
        if (index !== -1) {
          schools.value[index] = { ...schools.value[index], ...school.value };
        }
        loading.value = false;
        toast.success("School was updated successfully", {
          position: toast.POSITION.BOTTOM_CENTER,
          style: "width: auto",
        });
      })
      .catch((error) => {
        toast.error("Updating School failed. Please ask admin for help.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        console.error(error);
        loading.value = false;
        throw error; // rethrow the error to be caught at the point where this function is called
      });
  }

  async function deleteSchool(school_id) {
    await http
      .delete(`schools/${school_id}/`)
      .then(() => {
        schools.value = schools.value.filter((school) => school.id !== school_id);
        toast.success("School was deleted successfully", {
          position: toast.POSITION.BOTTOM_CENTER,
          style: "width: auto",
        });
      })
      .catch((error) => {
        toast.error("Deleting School failed. Please ask admin for help.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        console.error(error);
        throw error; // rethrow the error to be caught at the point where this function is called
      });
  }

  return {
    schools,
    school,
    loading,
    getSchools,
    getSchool,
    createSchool,
    updateSchool,
    deleteSchool,
  };
});

export const housing_options = [
  { text: "hostel", value: "hostel", icon: "mdi-bed" },
  { text: "guest family", value: "guest family", icon: "mdi-home-heart" },
  { text: "self-organized", value: "other", icon: "mdi-home" },
  { text: "not selected", value: "", icon: "mdi-home-outline" },
];

export const registration_status_options = [
  {
    value: "WAITING_FOR_PRE_REGISTRATION",
    text: "waiting for pre-registration",
    color: "red",
  },
  { value: "PRE_REGISTRATION_DONE", text: "pre-registration done", color: "orange" },
  {
    value: "WAITING_FOR_FINAL_REGISTRATION",
    text: "waiting for final registration",
    color: "purple",
  },
  { value: "FINAL_REGISTRATION_DONE", text: "final registration done", color: "green" },
  { value: "CANCELED", text: "canceled", color: "grey" },
];

export function getRegistrationStatusTitle(status) {
  return registration_status_options.find((option) => option.value === status)?.text;
}

export function getRegistrationStatusColor(status) {
  return registration_status_options.find((option) => option.value === status)?.color;
}

export function getHousingIcon(housing) {
  return housing_options.find((option) => option.value === housing)?.icon;
}

export function getHousingText(housing) {
  return housing_options.find((option) => option.value === housing)?.text;
}
