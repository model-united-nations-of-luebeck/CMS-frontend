<template>
  <div>
    <highcharts class="hc" :options="chartOptions" ref="chart"></highcharts>
  </div>
</template>

<script>
export default {
  name: "DietChart",
  props: { male: Number, female: Number, diverse: Number, title: String },
  data: () => ({
    chartOptions: {
      colors: ["red", "orange", "limegreen"],
      chart: {
        type: "pie",
      },
      title: {
        text: "",
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
            distance: -50,
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

          data: [
            {
              name: "Meat",
              y: 0,
            },
            {
              name: "Vegetarian",
              y: 0,
            },
            {
              name: "Vegan",
              y: 0,
            },
          ],
        },
      ],
    },
  }),
  mounted() {
    this.chartOptions.series[0].data[0].y = this.male;
    this.chartOptions.series[0].data[1].y = this.female;
    this.chartOptions.series[0].data[2].y = this.diverse;
    this.chartOptions.title.text = this.title;
  },
};
</script>
