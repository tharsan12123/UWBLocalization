import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ScatterController,
  ChartOptions,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ScatterController
);

// Common chart options
export const getDefaultOptions = (title: string): ChartOptions<'scatter'> => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            return `${label}: (${context.parsed.x.toFixed(2)}, ${context.parsed.y.toFixed(2)})`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'X Position (m)',
        },
        ticks: {
          callback: function(value) {
            return typeof value === 'number' ? value.toFixed(1) : value;
          }
        },
      },
      y: {
        title: {
          display: true,
          text: 'Y Position (m)',
        },
        ticks: {
          callback: function(value) {
            return typeof value === 'number' ? value.toFixed(1) : value;
          }
        },
      },
    },
  };
};

// Utility to generate random colors
export const getRandomColor = () => {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgba(${r}, ${g}, ${b}, 0.7)`;
};

// Create history data for time-series visualization
export const createHistoryDataset = (
  history: Array<[number, number]>,
  label: string,
  color: string
) => {
  return {
    label,
    data: history.map(([x, y]) => ({ x, y })),
    backgroundColor: color,
    borderColor: color,
    borderWidth: 1,
    pointRadius: 3,
    pointHoverRadius: 5,
    pointStyle: 'circle',
    showLine: true,
    tension: 0.4,
  };
};

// Create position dataset for scatter plots
export const createPositionDataset = (
  x: number,
  y: number,
  label: string,
  color: string
) => {
  return {
    label,
    data: [{ x, y }],
    backgroundColor: color,
    borderColor: color,
    borderWidth: 2,
    pointRadius: 8,
    pointHoverRadius: 10,
  };
};

// Create anchor dataset
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
    data: [{ x, y }],
    backgroundColor: colors[key as keyof typeof colors] || 'rgba(201, 203, 207, 1)',
    borderColor: colors[key as keyof typeof colors] || 'rgba(201, 203, 207, 1)',
    borderWidth: 2,
    pointRadius: 10,
    pointStyle: 'triangle',
    pointHoverRadius: 12,
  }));
};
