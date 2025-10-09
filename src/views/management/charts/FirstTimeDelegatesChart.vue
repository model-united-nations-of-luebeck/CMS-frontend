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
    height: 400,
  },
  title: {
    text: null,
  },
  xAxis: {
    categories: [],
    title: {
      text: "Forum",
    },
  },
  tooltip: {
    headerFormat: "<b>{point.category}</b><br/>",
    pointFormatter: function () {
      return (
        this.series.name + ": " + ((this.y * 100) / this.total).toFixed(0) + "%"
      );
    },
  },
  yAxis: {
    min: 0,
    max: 100,
    title: {
      text: "Fraction of First Time Delegates",
    },
    labels: {
      formatter: function () {
        return this.value + "%";
      },
    },
  },
  plotOptions: {
    series: {
      stacking: "percent",
      pointPadding: 0.1,
      groupPadding: 0.1,
    },
    bar: {
      dataLabels: {
        enabled: true,
        formatter: function () {
          return this.y;
        },
      },
    },
  },
  legend: {
    reversed: true,
  },
  series: [
    {
      name: "Returning Delegates",
      data: [],
      color: "green",
    },
    {
      name: "First Time Delegates",
      data: [],
      color: "orange",
    },
  ],
});

function updateSeries(data) {
  const categories = [];
  const firstTime = [];
  const returning = [];
  for (const forum of Object.keys(data)) {
    const total = data[forum].total || 0;
    const first = data[forum].first_time || 0;
    const ret = total - first;
    categories.push(data[forum].abbreviation);
    firstTime.push(first);
    returning.push(ret);
  }
  chartOptions.value.xAxis.categories = categories;
  chartOptions.value.series[1].data = firstTime;
  chartOptions.value.series[0].data = returning;
}

watch(
  () => props.data,
  (newData) => {
    if (newData) updateSeries(newData);
  },
  { immediate: true },
);
</script>
