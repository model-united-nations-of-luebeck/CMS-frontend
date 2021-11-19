<template>
  <div>
    <v-container>
      <!-- Header with actions -->
      <v-card-title>
        MUN-Directors

        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="closeAll"
          color="primary"
          v-if="this.expanded.length != 0"
        >
          <tooltipped-icon
            icon="mdi-unfold-less-horizontal"
            text="close all rows"
            position="top"
        /></v-btn>
        <v-btn
          icon
          @click="openAll"
          color="primary"
          v-if="this.expanded.length < this.mundirectors.length"
          ><tooltipped-icon
            icon="mdi-unfold-more-horizontal"
            text="expand all rows"
            position="top"
        /></v-btn>
        <v-btn
          icon
          :href="download"
          download="data.json"
          color="primary"
          v-if="this.selected.length != 0"
          ><tooltipped-icon
            icon="mdi-download"
            text="download data of selected mundirectors as JSON"
            position="top"
        /></v-btn>
        <v-btn icon color="primary" v-if="this.selected.length != 0"
          ><download-csv :data="selected">
            <tooltipped-icon
              icon="mdi-file-delimited"
              text="download data of selected mundirectors as CSV"
              position="top"
            /> </download-csv
        ></v-btn>
        <v-btn icon color="primary" v-if="this.selected.length != 0"
          ><download-excel :data="selected">
            <tooltipped-icon
              icon="mdi-microsoft-excel"
              text="download data of selected mundirectors as Excel file (xls)"
              position="top"
            /> </download-excel
        ></v-btn>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          autofocus
        ></v-text-field>
      </v-card-title>

      <!-- Table with mundirectors -->
      <v-data-table
        :headers="headers"
        :items="mundirectors"
        class="elevation-1"
        show-expand
        :expanded.sync="expanded"
        show-select
        v-model="selected"
        :search="search"
        :itemsPerPage="-1"
        :footer-props="{
          showFirstLastPage: true,
          itemsPerPageOptions: [5, 15, -1],
          itemsPerPageText: 'MUN-Directors per page:',
          showCurrentPage: true,
        }"
      >
        <template v-slot:[`footer.page-text`]="props"
          >MUN-Directors {{ props.pageStart }} - {{ props.pageStop }} of
          {{ props.itemsLength }}</template
        >
        <template v-slot:top> </template>
        <template v-slot:[`item.name`]="{ item }">
          {{ `${item.first_name} ${item.last_name}` }}
        </template>
        <template v-slot:[`item.gender`]="{ item }">
          <tooltipped-icon
            v-if="item.gender == 'm'"
            icon="mdi-gender-male"
            text="male"
            position="bottom"
            color="blue"
          />
          <tooltipped-icon
            v-if="item.gender == 'f'"
            icon="mdi-gender-female"
            text="female"
            position="bottom"
            color="pink"
          />
          <tooltipped-icon
            v-if="item.gender == 'o'"
            icon="mdi-gender-male-female"
            text="other"
            position="bottom"
            color="green"
          />
        </template>

        <template v-slot:[`item.email`]="{ item }">
          <tooltipped-icon
            v-if="item.email"
            icon="mdi-email"
            :text="item.email + ' (click to copy)'"
            position="bottom"
            @clicked="copyToClipboard(item.email)"
          />
        </template>
        <template v-slot:[`item.mobile`]="{ item }">
          <tooltipped-icon
            v-if="item.mobile"
            icon="mdi-phone"
            :text="item.mobile + ' (click to copy)'"
            position="bottom"
            @clicked="copyToClipboard(item.mobile)"
          />
        </template>
        <template v-slot:[`item.landline_phone`]="{ item }">
          <tooltipped-icon
            v-if="item.landline_phone"
            icon="mdi-phone-classic"
            :text="item.landline_phone + ' (click to copy)'"
            position="bottom"
            @clicked="copyToClipboard(item.landline_phone)"
          />
        </template>
        <template v-slot:[`item.diet`]="{ item }">
          <tooltipped-icon
            v-if="item.diet == 'meat'"
            icon="mdi-food-steak"
            text="meat"
            color="red"
            position="bottom"
          />
          <tooltipped-icon
            v-if="item.diet == 'vegetarian'"
            icon="mdi-egg"
            color="#ffbb00"
            text="vegetarian"
            position="bottom"
          />
          <tooltipped-icon
            v-if="item.diet == 'vegan'"
            icon="mdi-sprout"
            color="green"
            text="vegan"
            position="bottom"
          />
        </template>
        <template v-slot:[`item.english_teacher`]="{ item }">
          <tooltipped-icon
            v-if="item.english_teacher"
            icon="mdi-human-male-board"
            text="this MUN-Director teaches English"
            position="bottom"
          />
        </template>
        <template v-slot:[`item.extras`]="{ item }">
          <tooltipped-icon
            v-if="item.extras"
            icon="mdi-information-variant"
            :text="item.extras"
            position="bottom"
          />
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            small
            icon
            :to="{ name: 'MUNDirectorDetails', params: { id: item.id } }"
          >
            <v-icon small color="primary">
              mdi-pencil
            </v-icon>
          </v-btn>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <v-row>
              <v-col sm="3"
                ><v-img
                  contain
                  max-height="100"
                  max-width="250"
                  :src="item.picture"
                ></v-img> </v-col
            ></v-row>
          </td>
        </template>
        <template v-slot:no-data>
          <span>No MUN-Directors available!</span>
        </template>
      </v-data-table>

      <toast-message
        ref="copiedToClipboardSnackbar"
        message="Copied to clipboard!"
        prepend_icon="mdi-content-copy"
      />
    </v-container>
  </div>
</template>

<script>
import TooltippedIcon from "../generic/TooltippedIcon.vue";
import ToastMessage from "../generic/ToastMessage.vue";
export default {
  components: { TooltippedIcon, ToastMessage },
  name: "MUNDirectors",

  data: () => ({
    mundirectors: [],
    conference: null, // required to calculate age of participants at beginning of conference
    search: "",
    expanded: [],
    selected: [],
    editedIndex: null,
    editedItem: { first_name: "", last_name: "" },
    headers: [
      { text: "", value: "data-table-expand", groupable: false },
      {
        text: "Name",
        align: "start",
        sortable: true,
        value: "name",
        groupable: false,
      },
      { text: "Gender", value: "gender" },
      { text: "Email", value: "email", groupable: false },
      { text: "Mobile", value: "mobile", groupable: false },
      { text: "Landline", value: "landline_phone" },
      { text: "Diet", value: "diet" },
      { text: "English teacher", value: "english_teacher" },
      { text: "Extras", value: "extras", groupable: false },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        groupable: false,
      },
      { text: "", value: "data-table-select", groupable: false },
    ],
  }),
  async mounted() {
    // fetch required data for this page
    try {
      const [conference] = (
        await this.$http.get(
          "https://munoltom.pythonanywhere.com/api/conferences/"
        )
      ).data;
      this.conference = conference;
      const { data } = await this.$http.get(
        "https://munoltom.pythonanywhere.com/api/mun-directors/"
      );
      this.mundirectors = data;
    } catch (error) {
      alert(error);
    }
  },
  computed: {
    download() {
      // downloads selected items as JSON
      const json_encoded = JSON.stringify(this.selected, null, 4);
      const blob = new Blob([json_encoded], { type: "application/json" });
      return window.URL.createObjectURL(blob);
    },
  },
  methods: {
    closeAll() {
      console.log(this.expanded);
      this.expanded = [];
    },
    openAll() {
      this.expanded = this.mundirectors;
    },
    birthdayColor(dateString) {
      const date = new Date(dateString);
      const difference = new Date(this.conference.startdate) - date;
      const years = difference / (1000 * 60 * 60 * 24 * 365);
      if (years < 16) {
        return "red";
      } else if (years < 18) {
        return "orange";
      } else if (years >= 18) {
        return "green";
      } else {
        return "gray";
      }
    },
    copyToClipboard(text) {
      this.$copyText(text).then(() => {
        this.$refs.copiedToClipboardSnackbar.show();
      });
    },
  },
};
</script>
