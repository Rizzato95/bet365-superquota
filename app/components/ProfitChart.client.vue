<script setup lang="ts">
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Tooltip,
  Filler,
  type ChartDataset,
} from 'chart.js'
import type { Point } from '#shared/utils/analytics'
import { money, dateLabel } from '#shared/utils/format'
Chart.register(LineController, LineElement, PointElement, LinearScale, Tooltip, Filler)
const props = defineProps<{ points: Point[]; original?: Point[] }>()
const canvas = ref<HTMLCanvasElement | null>(null)
let chart: Chart<'line'> | undefined
function render() {
  if (!canvas.value) return
  chart?.destroy()
  const dateFromTimestamp = (value: number) => new Date(value).toISOString().slice(0, 10)
  const plotPoints = (points: Point[]) =>
    points.map((p) => ({ x: Date.parse(p.date), y: p.profit }))
  const datasets: ChartDataset<'line'>[] = [
    {
      label: 'Quota maggiorata',
      data: plotPoints(props.points),
      borderColor: '#45dbac',
      borderWidth: 2.5,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: '#45dbac',
      tension: 0.15,
      fill: true,
      backgroundColor(context) {
        const { ctx, chartArea } = context.chart
        if (!chartArea) return 'rgba(69,219,172,0.08)'
        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
        gradient.addColorStop(0, 'rgba(69,219,172,0.22)')
        gradient.addColorStop(1, 'rgba(69,219,172,0.005)')
        return gradient
      },
    },
  ]
  if (props.original) {
    datasets.push({
      label: 'Quota originale',
      data: plotPoints(props.original),
      borderColor: '#e2e992',
      borderWidth: 2,
      borderDash: [5, 5],
      pointRadius: 0,
      tension: 0.15,
      fill: false,
    })
  }
  chart = new Chart<'line'>(canvas.value, {
    type: 'line',
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        tooltip: {
          backgroundColor: '#28342e',
          titleColor: '#fff',
          bodyColor: '#d9e4df',
          padding: 12,
          displayColors: true,
          callbacks: {
            title: (items) =>
              items[0]?.parsed.x != null
                ? dateLabel(dateFromTimestamp(items[0].parsed.x), true)
                : '',
            label: (item) => ` ${item.dataset.label}: ${money(item.parsed.y ?? 0, true)}`,
          },
        },
      },
      scales: {
        x: {
          type: 'linear',
          min: props.points[0] ? Date.parse(props.points[0].date) : undefined,
          max: props.points.length
            ? Date.parse(props.points[props.points.length - 1]!.date)
            : undefined,
          grid: { display: false },
          border: { display: false },
          ticks: {
            color: '#7d8a83',
            maxTicksLimit: 6,
            maxRotation: 0,
            font: { size: 11 },
            callback: (value) => dateLabel(dateFromTimestamp(Number(value))),
          },
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(139,161,148,0.09)' },
          border: { display: false, dash: [4, 5] },
          ticks: {
            color: '#7d8a83',
            maxTicksLimit: 5,
            font: { size: 11 },
            callback: (value) =>
              `${new Intl.NumberFormat('it', { notation: 'compact', maximumFractionDigits: 1 }).format(Number(value))} €`,
          },
        },
      },
    },
  })
}
watch([canvas, () => props.points, () => props.original], render, {
  deep: true,
  flush: 'post',
})
onBeforeUnmount(() => chart?.destroy())
</script>
<template>
  <div
    class="mx-3 h-[235px] relative mt-3 mb-2.5 min-w-0 md:mx-5 md:h-[285px] md:mt-3 md:mb-3.5 lg:h-70 xl:h-[285px] 2xl:h-80"
  >
    <canvas
      ref="canvas"
      role="img"
      aria-label="Grafico del profitto cumulativo per giorno. I risultati sono riepilogati nei valori e nella tabella mensile."
    />
  </div>
</template>
