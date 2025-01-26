import { useConferenceStore } from "./conference";
const conferenceStore = useConferenceStore();
conferenceStore.getCurrentConference();

export function getAge(birth_date) {
    const start_date = new Date(conferenceStore.conference.start_date);
    const birth_date_date = new Date(birth_date);
    let age = start_date.getFullYear() - birth_date_date.getFullYear();
    const month = start_date.getMonth() - birth_date_date.getMonth();
    if (month < 0 || (month === 0 && start_date.getDate() < birth_date_date.getDate())) {
        age--;
    }
    return age;
}

export function getAgeColor(birth_date) {
    const age = getAge(birth_date);
    if (age < 16) {
        return "red";
    } else if (age < 18) {
        return "orange";
    } else if (age >= 18){
        return "green";
    } else {
        return "gray";
    }
}