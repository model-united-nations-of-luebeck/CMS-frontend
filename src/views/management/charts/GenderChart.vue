<template>
  <div>
    <highcharts class="hc" :options="chartOptions"></highcharts>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  male: Number,
  female: Number,
  other: Number,
  title: String,
});

const chartOptions = ref({
  colors: ["deepskyblue", "deeppink", "limegreen"],
  chart: { type: "pie" },
  title: { text: props.title || "All Participants" },
  tooltip: {
    formatter: function () {
      return `${this.point.name}: ${this.y} (${Math.round((100 * this.y) / this.total)}%)`;
    },
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: "pointer",
      dataLabels: {
        enabled: true,
        formatter: function () {
          return `${this.point.name}: ${this.y} (${Math.round((100 * this.y) / this.total)}%)`;
        },
      },
      showInLegend: true,
    },
  },
  series: [
    {
      name: "Amount",
      colorByPoint: true,
      innerSize: "50%",
      data: [
        { name: "Male", y: props.male || 0 },
        { name: "Female", y: props.female || 0 },
        { name: "Diverse", y: props.other || 0 },
      ],
    },
  ],
});

// Watch for prop changes and update chart data
watch(
  () => props.male,
  (val) => {
    chartOptions.value.series[0].data[0].y = val;
  },
);

watch(
  () => props.female,
  (val) => {
    chartOptions.value.series[0].data[1].y = val;
  },
);

watch(
  () => props.other,
  (val) => {
    chartOptions.value.series[0].data[2].y = val;
  },
);

watch(
  () => props.title,
  (val) => {
    chartOptions.value.title.text = val;
  },
);
</script>
