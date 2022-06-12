<template>
  <div>
    <highcharts class="hc" :options="chartOptions" ref="chart"></highcharts>
  </div>
</template>

<script>
export default {
  name: "AgeChart",
  data: () => ({
    chartOptions: {
      chart: {
        type: "column",
      },
      title: {
        text: null,
      },
      xAxis: {
        categories: ["not determined", "under 16", "16 - 18", "over 18"],
      },
      yAxis: {
        min: 0,
        title: {
          text: null,
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: "bold",
            color: "gray",
          },
        },
      },
      colors: ["gray", "red", "orange", "green"],
      tooltip: {
        headerFormat: "<b>{point.x}</b><br/>",
        pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
      },
      plotOptions: {
        column: {
          stacking: "normal",
          dataLabels: {
            enabled: false,
          },
          colorByPoint: true,
        },
      },
      series: [
        {
          name: "Delegates",
          data: [0, 5, 30, 40],
        },
        {
          name: "Staff",
          data: [2, 50, 3, 3],
        },
        {
          name: "Executives",
          data: [0, 2, 6, 24],
        },
        {
          name: "Student Officers",
          data: [0, 1, 13, 14],
        },
        {
          name: "MUN-Directors",
          data: [0, 0, 0, 40],
        },
        {
          name: "Advisors",
          data: [0, 0, 0, 24],
        },
      ],
    },
  }),
  methods: {},
  mounted() {
    // query API here for data
    this.chartOptions.series[0].data = [0, 0, 0, 0];
    this.chartOptions.series[1].data = [0, 0, 0, 0];
    this.chartOptions.series[2].data = [0, 0, 0, 0];
    this.chartOptions.series[3].data = [0, 0, 0, 0];
    this.chartOptions.series[4].data = [0, 0, 0, 0];
    this.chartOptions.series[5].data = [0, 0, 0, 0];
    this.chartOptions.title.text = this.title;
  },
};
</script>
