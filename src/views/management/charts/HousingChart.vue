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
  chart: { type: "column" },
  title: { text: null },
  xAxis: { categories: ["Delegates", "MUN-Directors", "Schools"] },
  yAxis: {
    min: 0,
    visible: false,
    title: { text: null },
    stackLabels: {
      enabled: true,
      style: { fontWeight: "bold", color: "gray" },
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
      dataLabels: { enabled: true },
      colorByPoint: false,
    },
  },
  series: [
    { name: "Guest family", data: [0, 0, 0] },
    { name: "Hostel", data: [0, 0, 0] },
    { name: "Other/self-arranged", data: [0, 0, 0] },
  ],
});

const updateSeries = (data) => {
  chartOptions.value.series[0].data = [
    data.delegates.guest_family,
    data.mun_directors.guest_family,
    data.schools.guest_family,
  ];
  chartOptions.value.series[1].data = [
    data.delegates.hostel,
    data.mun_directors.hostel,
    data.schools.hostel,
  ];
  chartOptions.value.series[2].data = [
    data.delegates.other,
    data.mun_directors.other,
    data.schools.other,
  ];
};

watch(
  () => props.data,
  (newData) => {
    if (newData) updateSeries(newData);
  },
  { immediate: true },
);
</script>
