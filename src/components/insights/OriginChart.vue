<template>
  <div>
    <highcharts class="hc" :options="chartOptions" ref="chart"></highcharts>
  </div>
</template>

<script>
export default {
  name: "OriginChart",
  props: { male: Number, female: Number, diverse: Number, title: String },
  data: () => ({
    chartOptions: {
      chart: {
        type: "bar",
      },
      title: {
        text: null,
      },
      xAxis: {
        categories: [
          "Delegates",
          "Student Officers",
          "MUN-Directors",
          "Schools",
        ],
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
        bar: {
          stacking: "percent",
          dataLabels: {
            enabled: true,
          },
          colorByPoint: false,
        },
      },
      series: [
        {
          name: "TMS",
          data: [40, 15, 10, 1],
        },
        {
          name: "Lübeck",
          data: [35, 3, 7, 5],
        },
        {
          name: "Germany",
          data: [120, 4, 20, 18],
        },
        {
          name: "International",
          data: [125, 6, 24, 14],
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
