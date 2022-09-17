<template>
  <div>
    <highcharts class="hc" :options="chartOptions" ref="chart"></highcharts>
  </div>
</template>

<script>
export default {
  name: "HousingChart",
  props: { data: Object },
  data: () => ({
    chartOptions: {
      chart: {
        type: "column",
      },
      title: {
        text: null,
      },
      xAxis: {
        categories: ["Delegates", "Schools"],
      },
      yAxis: {
        min: 0,
        visible: false,
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
      colors: ["green", "red", "orange", "blue"],
      tooltip: {
        headerFormat: "<b>{point.x}</b><br/>",
        pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
      },
      plotOptions: {
        column: {
          stacking: "percent",
          dataLabels: {
            enabled: true,
          },
          colorByPoint: false,
        },
      },
      series: [
        {
          name: "Guest family",
          data: [40, 15],
        },
        {
          name: "Hostel",
          data: [35, 3],
        },
        {
          name: "Other/self-arranged",
          data: [120, 4],
        },
      ],
    },
  }),
  watch: {
    data(newData) {
      this.chartOptions.series[0].data = [
        newData.delegates.guest_family,
        newData.schools.guest_family,
      ];
      this.chartOptions.series[1].data = [
        newData.delegates.hostel,
        newData.schools.hostel,
      ];
      this.chartOptions.series[2].data = [
        newData.delegates.other,
        newData.schools.other,
      ];
    },
  },
  mounted() {
    this.chartOptions.series[0].data = [
      this.data.delegates.guest_family,
      this.data.schools.guest_family,
    ];
    this.chartOptions.series[1].data = [
      this.data.delegates.hostel,
      this.data.schools.hostel,
    ];
    this.chartOptions.series[2].data = [
      this.data.delegates.other,
      this.data.schools.other,
    ];
  },
};
</script>
