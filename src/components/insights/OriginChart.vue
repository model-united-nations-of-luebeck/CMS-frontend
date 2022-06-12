<template>
  <div>
    <highcharts class="hc" :options="chartOptions" ref="chart"></highcharts>
  </div>
</template>

<script>
export default {
  name: "OriginChart",
  props: { data: Object },
  data: () => ({
    chartOptions: {
      chart: {
        type: "bar",
      },
      title: {
        text: null,
      },
      xAxis: {
        categories: ["Delegates", "MUN-Directors", "Schools"],
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
          data: [40, 10, 1],
        },
        {
          name: "Lübeck",
          data: [35, 7, 5],
        },
        {
          name: "Germany",
          data: [120, 20, 18],
        },
        {
          name: "International",
          data: [125, 24, 14],
        },
      ],
    },
  }),
  watch: {
    data(newData) {
      this.chartOptions.series[0].data = [
        newData.delegate.tms,
        newData.mundirector.tms,
        newData.school.tms,
      ];
      this.chartOptions.series[1].data = [
        newData.delegate.luebeck,
        newData.mundirector.luebeck,
        newData.school.luebeck,
      ];
      this.chartOptions.series[2].data = [
        newData.delegate.national,
        newData.mundirector.national,
        newData.school.national,
      ];
      this.chartOptions.series[3].data = [
        newData.delegate.international,
        newData.mundirector.international,
        newData.school.international,
      ];
    },
  },
  mounted() {
    this.chartOptions.series[0].data = [
      this.data.delegate.tms,
      this.data.mundirector.tms,
      this.data.school.tms,
    ];
    this.chartOptions.series[1].data = [
      this.data.delegate.luebeck,
      this.data.mundirector.luebeck,
      this.data.school.luebeck,
    ];
    this.chartOptions.series[2].data = [
      this.data.delegate.national,
      this.data.mundirector.national,
      this.data.school.national,
    ];
    this.chartOptions.series[3].data = [
      this.data.delegate.international,
      this.data.mundirector.international,
      this.data.school.international,
    ];
  },
};
</script>
