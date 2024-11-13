import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: 'top' as const,
    },
    title: {
      display: false,
      text: 'Chart.js Bar Chart',
    },
  },
  scales: {
    xAxes: {
      ticks: {
        fontColor: 'rgba(255, 255, 255, 1)',
      },
      grid: {
        display: false,
        drawBorder: false,
      },
    },
  },
}

const labels = new Array(15).fill(null).map((o, index) => (index + 3).toString())

export const data = {
  labels,
  datasets: [
    {
      data: [10, 20, 15, 11, 8, 5, 9, 11, 15, 14, 17, 18, 22, 32],
      label: '',
      fill: true,
      backgroundColor: 'rgba(129, 140, 248, 0.9)',
      tension: 0,
      pointRadius: 0,
      pointHoverRadius: 3,
      pointBackgroundColor: 'rgb(99, 102, 241)',
    },
  ],
}

const Statics: React.FC = () => {
  return (
    <div className="bg-whitepx-4 rounded-lg border border-gray-200 py-5 sm:px-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium leading-5 text-gray-900">Statics</h3>
        <span className="text-xs text-gray-400">Last 15 days</span>
      </div>
      <Bar data={data} />
    </div>
  )
}

export default Statics
