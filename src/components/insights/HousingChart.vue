<template>
  <div>
    <highcharts class="hc" :options="chartOptions" ref="chart"></highcharts>
  </div>
</template>

<script>
export default {
  name: "HousingChart",
  props: { male: Number, female: Number, diverse: Number, title: String },
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
  mounted() {
    this.chartOptions.series[0].data[0].y = this.male;
    this.chartOptions.series[0].data[1].y = this.female;
    this.chartOptions.series[0].data[2].y = this.diverse;
    this.chartOptions.title.text = this.title;
  },
};
</script>
