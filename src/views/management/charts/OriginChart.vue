<template>
  <div>
    <highcharts class="hc" :options="chartOptions" ref="chart"></highcharts>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  data: Object,
});

const chartOptions = ref({
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
    { name: "TMS", data: [0, 0, 0] },
    { name: "Lübeck", data: [0, 0, 0] },
    { name: "Germany", data: [0, 0, 0] },
    { name: "International", data: [0, 0, 0] },
  ],
});

function updateSeries(data) {
  chartOptions.value.series[0].data = [
    data.delegate.tms,
    data.mundirector.tms,
    data.school.tms,
  ];
  chartOptions.value.series[1].data = [
    data.delegate.luebeck,
    data.mundirector.luebeck,
    data.school.luebeck,
  ];
  chartOptions.value.series[2].data = [
    data.delegate.national,
    data.mundirector.national,
    data.school.national,
  ];
  chartOptions.value.series[3].data = [
    data.delegate.international,
    data.mundirector.international,
    data.school.international,
  ];
}

watch(
  () => props.data,
  (newData) => {
    if (newData) updateSeries(newData);
  },
  { immediate: true },
);
</script>
