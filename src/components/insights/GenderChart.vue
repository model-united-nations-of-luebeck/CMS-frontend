<template>
  <div>
    <highcharts class="hc" :options="chartOptions" ref="chart"></highcharts>
  </div>
</template>

<script>
export default {
  name: "GenderChart",
  props: { male: Number, female: Number, other: Number, title: String },
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
    // whenever male changes, this function will run
    male(newValue) {
      this.chartOptions.series[0].data[0].y = newValue;
    },
    female(newValue) {
      this.chartOptions.series[0].data[1].y = newValue;
    },
    other(newValue) {
      this.chartOptions.series[0].data[2].y = newValue;
    },
    title(newValue) {
      this.chartOptions.title.text = newValue;
    },
  },
  mounted() {
    this.chartOptions.series[0].data[0].y = this.male;
    this.chartOptions.series[0].data[1].y = this.female;
    this.chartOptions.series[0].data[2].y = this.other;
    this.chartOptions.title.text = this.title;
  },
};
</script>
