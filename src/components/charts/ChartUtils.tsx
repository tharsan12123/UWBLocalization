import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  ScatterController,
} from 'chart.js';

// Register all needed components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController,      // <– Required for line drawing
  ScatterController
);

// Common chart options with square grid
export const getDefaultOptions = (title: string) => ({
  responsive: true,
  maintainAspectRatio: false,
  aspectRatio: 1,

  plugins: {
    legend: {
      position: 'top',
      labels: {
        font: { size: 12 },
        boxWidth: 12,
      },
    },
    title: {
      display: true,
      text: title,
      font: { size: 16 },
    },
  },

  scales: {
    x: {
      type: 'linear',
      title: {
        display: true,
        text: 'X [m]',
        font: { size: 14 },
      },
      min: -0.6,
      max: 12,
      ticks: {
        stepSize: 0.6,
        font: { size: 12 },
      },
      grid: {
        color: '#cccccc',
        lineWidth: 1,
        drawTicks: true,
      },
    },
    y: {
      type: 'linear',
      title: {
        display: true,
        text: 'Y [m]',
        font: { size: 14 },
      },
      min: -0.6,
      max: 7.6,
      ticks: {
        stepSize: 0.6,
        font: { size: 12 },
      },
      grid: {
        color: '#cccccc',
        lineWidth: 1,
        drawTicks: true,
      },
    },
  },
});

// Random color utility
export const getRandomColor = () => {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgba(${r}, ${g}, ${b}, 0.7)`;
};

// ✅ Draws line-connected trail of tag positions
export const createHistoryDataset = (
  history: Array<[number, number]>,
  label: string,
  color: string
) => {
  return {
    label,
    type: 'line', // <– Force line type to ensure it connects
    data: history.map(([x, y]) => ({ x, y })),
    backgroundColor: color,
    borderColor: color,
    borderWidth: 2,
    pointRadius: 3,
    pointHoverRadius: 5,
    fill: false,
    tension: 0.3,
    showLine: true,
  };
};

// Draws current position as large point
export const createPositionDataset = (
  x: number,
  y: number,
  label: string,
  color: string
) => {
  return {
    label,
    type: 'scatter', // <– just point
    data: [{ x, y }],
    backgroundColor: color,
    borderColor: color,
    borderWidth: 2,
    pointRadius: 8,
    pointHoverRadius: 10,
    showLine: false,
  };
};

// Anchors with triangle icons
export const createAnchorDatasets = (
  anchors: { [key: string]: [number, number] }
) => {
  const colors = {
    A1: 'rgba(54, 162, 235, 1)',
    A2: 'rgba(75, 192, 192, 1)',
    A3: 'rgba(153, 102, 255, 1)',
  };

  return Object.entries(anchors).map(([key, [x, y]]) => ({
    label: `Anchor ${key}`,
    type: 'scatter',
    data: [{ x, y }],
    backgroundColor: colors[key as keyof typeof colors] || 'rgba(201, 203, 207, 1)',
    borderColor: colors[key as keyof typeof colors] || 'rgba(201, 203, 207, 1)',
    borderWidth: 2,
    pointRadius: 10,
    pointHoverRadius: 12,
    pointStyle: 'triangle',
    showLine: false,
  }));
};
