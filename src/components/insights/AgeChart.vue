<template>
  <div>
    <highcharts class="hc" :options="chartOptions" ref="chart"></highcharts>
  </div>
</template>

<script>
export default {
  name: "AgeChart",
  props: { age_stats: Object },
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
  watch: {
    age_stats(newStats) {
      this.chartOptions.series[0].data = [
        newStats.delegate["not defined"],
        newStats.delegate["under_16"],
        newStats.delegate["16_to_18"],
        newStats.delegate["over_18"],
      ];
      this.chartOptions.series[1].data = [
        newStats.staff["not defined"],
        newStats.staff["under_16"],
        newStats.staff["16_to_18"],
        newStats.staff["over_18"],
      ];
      this.chartOptions.series[2].data = [
        newStats.executive["not defined"],
        newStats.executive["under_16"],
        newStats.executive["16_to_18"],
        newStats.executive["over_18"],
      ];
      this.chartOptions.series[3].data = [
        newStats.studentofficer["not defined"],
        newStats.studentofficer["under_16"],
        newStats.studentofficer["16_to_18"],
        newStats.studentofficer["over_18"],
      ];
      this.chartOptions.series[4].data = [
        newStats.mundirector["not defined"],
        newStats.mundirector["under_16"],
        newStats.mundirector["16_to_18"],
        newStats.mundirector["over_18"],
      ];
      this.chartOptions.series[5].data = [
        newStats.advisor["not defined"],
        newStats.advisor["under_16"],
        newStats.advisor["16_to_18"],
        newStats.advisor["over_18"],
      ];
    },
  },
  mounted() {
    // query API here for data
    if (this.age_stats != undefined) {
      this.chartOptions.series[0].data = [
        this.age_stats.delegate["not defined"],
        this.age_stats.delegate["under_16"],
        this.age_stats.delegate["16_to_18"],
        this.age_stats.delegate["over_18"],
      ];
      this.chartOptions.series[1].data = [
        this.age_stats.staff["not defined"],
        this.age_stats.staff["under_16"],
        this.age_stats.staff["16_to_18"],
        this.age_stats.staff["over_18"],
      ];
      this.chartOptions.series[2].data = [
        this.age_stats.executive["not defined"],
        this.age_stats.executive["under_16"],
        this.age_stats.executive["16_to_18"],
        this.age_stats.executive["over_18"],
      ];
      this.chartOptions.series[3].data = [
        this.age_stats.studentofficer["not defined"],
        this.age_stats.studentofficer["under_16"],
        this.age_stats.studentofficer["16_to_18"],
        this.age_stats.studentofficer["over_18"],
      ];
      this.chartOptions.series[4].data = [
        this.age_stats.mundirector["not defined"],
        this.age_stats.mundirector["under_16"],
        this.age_stats.mundirector["16_to_18"],
        this.age_stats.mundirector["over_18"],
      ];
      this.chartOptions.series[5].data = [
        this.age_stats.advisor["not defined"],
        this.age_stats.advisor["under_16"],
        this.age_stats.advisor["16_to_18"],
        this.age_stats.advisor["over_18"],
      ];
    } else {
      this.chartOptions.series[0].data = [0, 0, 0, 0];
      this.chartOptions.series[1].data = [0, 0, 0, 0];
      this.chartOptions.series[2].data = [0, 0, 0, 0];
      this.chartOptions.series[3].data = [0, 0, 0, 0];
      this.chartOptions.series[4].data = [0, 0, 0, 0];
      this.chartOptions.series[5].data = [0, 0, 0, 0];
    }
  },
};
</script>
