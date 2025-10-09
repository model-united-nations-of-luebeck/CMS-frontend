<script setup>
import { ref, watch, onMounted } from "vue";

const props = defineProps({
  age_stats: Object,
});

const chartOptions = ref({
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
    { name: "Delegates", data: [0, 5, 30, 40] },
    { name: "Staff", data: [2, 50, 3, 3] },
    { name: "Executives", data: [0, 2, 6, 24] },
    { name: "Student Officers", data: [0, 1, 13, 14] },
    { name: "MUN-Directors", data: [0, 0, 0, 40] },
    { name: "Advisors", data: [0, 0, 0, 24] },
  ],
});

function updateChartOptions(stats) {
  if (!stats) {
    for (let i = 0; i < 6; i++) {
      chartOptions.value.series[i].data = [0, 0, 0, 0];
    }
    return;
  }
  chartOptions.value.series[0].data = [
    stats.delegate?.["not defined"] ?? 0,
    stats.delegate?.["under_16"] ?? 0,
    stats.delegate?.["16_to_18"] ?? 0,
    stats.delegate?.["over_18"] ?? 0,
  ];
  chartOptions.value.series[1].data = [
    stats.staff?.["not defined"] ?? 0,
    stats.staff?.["under_16"] ?? 0,
    stats.staff?.["16_to_18"] ?? 0,
    stats.staff?.["over_18"] ?? 0,
  ];
  chartOptions.value.series[2].data = [
    stats.executive?.["not defined"] ?? 0,
    stats.executive?.["under_16"] ?? 0,
    stats.executive?.["16_to_18"] ?? 0,
    stats.executive?.["over_18"] ?? 0,
  ];
  chartOptions.value.series[3].data = [
    stats.studentofficer?.["not defined"] ?? 0,
    stats.studentofficer?.["under_16"] ?? 0,
    stats.studentofficer?.["16_to_18"] ?? 0,
    stats.studentofficer?.["over_18"] ?? 0,
  ];
  chartOptions.value.series[4].data = [
    stats.mundirector?.["not defined"] ?? 0,
    stats.mundirector?.["under_16"] ?? 0,
    stats.mundirector?.["16_to_18"] ?? 0,
    stats.mundirector?.["over_18"] ?? 0,
  ];
  chartOptions.value.series[5].data = [
    stats.advisor?.["not defined"] ?? 0,
    stats.advisor?.["under_16"] ?? 0,
    stats.advisor?.["16_to_18"] ?? 0,
    stats.advisor?.["over_18"] ?? 0,
  ];
}

watch(
  () => props.age_stats,
  (newStats) => {
    updateChartOptions(newStats);
  },
  { immediate: true },
);

onMounted(() => {
  updateChartOptions(props.age_stats);
});
</script>

<template>
  <div>
    <highcharts class="hc" :options="chartOptions" ref="chart"></highcharts>
  </div>
</template>
