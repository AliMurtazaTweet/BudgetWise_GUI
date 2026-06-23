import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function CategoryBarChart({ data = [] }) {
  const chartData = {
    labels: data.map(d => d.category),
    datasets: [
      {
        label: 'Spent',
        data: data.map(d => d.spent),
        backgroundColor: '#4F46E5', // Indigo
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: 'Limit',
        data: data.map(d => d.limit),
        backgroundColor: '#E5E7EB', // Gray-200
        borderRadius: 6,
        borderSkipped: false,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          font: { family: "'Inter', sans-serif", size: 13 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        padding: 16,
        titleFont: { size: 13, family: "'Inter', sans-serif", weight: 'bold' },
        titleColor: '#94A3B8',
        bodyFont: { size: 14, family: "'Inter', sans-serif", weight: 'bold' },
        bodyColor: '#F8FAFC',
        borderColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        cornerRadius: 16,
        boxPadding: 8,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            return ` ${context.dataset.label}: $${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(241, 245, 249, 1)', // slate-100
          drawBorder: false,
          borderDash: [5, 5],
        },
        ticks: {
          font: { family: "'Inter', sans-serif", weight: '500' },
          color: '#94A3B8',
          callback: function(value) {
            return '$' + value;
          },
          padding: 10,
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          font: { family: "'Inter', sans-serif", weight: '500' },
          color: '#94A3B8',
          padding: 10,
        }
      }
    }
  };

  return (
    <div className="bg-bg-surface p-6 rounded-[2.5rem] shadow-xl shadow-text-primary/5 border border-border-subtle flex flex-col h-full min-h-[400px]">
      <div className="mb-4">
        <h3 className="text-lg font-extrabold text-text-primary tracking-tight">Budget vs Spent</h3>
        <p className="text-[11px] font-bold text-text-secondary uppercase tracking-widest mt-1 opacity-60">Category breakdown</p>
      </div>
      <div className="flex-1 w-full relative">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
