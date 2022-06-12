<template>
  <div>
    <highcharts class="hc" :options="chartOptions" ref="chart"></highcharts>
  </div>
</template>

<script>
export default {
  name: "GenderChart",
  props: { participants: Array, title: String },
  data: () => ({
    chartOptions: {
      colors: ["deepskyblue", "deeppink", "limegreen"],
      chart: {
        type: "pie",
      },
      title: {
        text: "All Participants",
      },
      tooltip: {
        formatter: function () {
          return `${this.point.name}: ${this.y} (${Math.round(
            (100 * this.y) / this.total
          )}%)`;
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            formatter: function () {
              return `${this.point.name}: ${this.y} (${Math.round(
                (100 * this.y) / this.total
              )}%)`;
            },
          },
          showInLegend: true,
        },
      },
      series: [
        {
          name: "Amount",
          colorByPoint: true,
          innerSize: "50%",
          data: [
            {
              name: "Male",
              y: 0,
            },
            {
              name: "Female",
              y: 0,
            },
            {
              name: "Diverse",
              y: 0,
            },
          ],
        },
      ],
    },
  }),
  methods: {},
  watch: {
    // whenever participants changes, this function will run
    participants(newParticipants) {
      if (newParticipants && newParticipants.length > 0) {
        this.chartOptions.series[0].data[0].y = newParticipants.filter(
          (p) => p.gender == "m"
        ).length;
        this.chartOptions.series[0].data[1].y = newParticipants.filter(
          (p) => p.gender == "f"
        ).length;
        this.chartOptions.series[0].data[2].y = newParticipants.filter(
          (p) => p.gender == "o"
        ).length;
      }
    },
    title(newValue) {
      this.chartOptions.title.text = newValue;
    },
  },
  mounted() {
    this.chartOptions.series[0].data[0].y = this.participants.filter(
      (p) => p.gender == "m"
    ).length;
    this.chartOptions.series[0].data[1].y = this.participants.filter(
      (p) => p.gender == "f"
    ).length;
    this.chartOptions.series[0].data[2].y = this.participants.filter(
      (p) => p.gender == "o"
    ).length;
    this.chartOptions.title.text = this.title;
  },
};
</script>
