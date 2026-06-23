import { useState, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Activity, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ALL_DATA = [
  { month: 'Jul', income: 4000, expense: 2900 },
  { month: 'Aug', income: 4300, expense: 3200 },
  { month: 'Sep', income: 4100, expense: 3100 },
  { month: 'Oct', income: 4600, expense: 3300 },
  { month: 'Nov', income: 4900, expense: 3500 },
  { month: 'Dec', income: 4400, expense: 3400 },
  { month: 'Jan', income: 4200, expense: 3100 },
  { month: 'Feb', income: 4800, expense: 3600 },
  { month: 'Mar', income: 4100, expense: 3200 },
  { month: 'Apr', income: 5200, expense: 4100 },
  { month: 'May', income: 5000, expense: 2800 },
  { month: 'Jun', income: 6800, expense: 3200 },
];

const RANGES = [
  { label: '3M', count: 3 },
  { label: '6M', count: 6 },
  { label: '1Y', count: 12 },
];

export default function MonthlyLineChart({ chartData = null }) {
  const [range, setRange] = useState('6M');
  const chartRef = useRef(null);

  // Use provided data or fallback, then slice based on range
  const baseData = chartData || ALL_DATA;
  // If chartData was passed and it's short, we don't crash
  const activeCount = RANGES.find(r => r.label === range)?.count ?? 6;
  const slicedData = baseData.slice(Math.max(0, baseData.length - activeCount));

  const labels = slicedData.map(d => d.month || d.label);
  const incomeValues = slicedData.map(d => d.income || 0);
  const expenseValues = slicedData.map(d => d.expense || d.expenses || 0);

  // Calculate metrics
  const avgIncome = Math.round(incomeValues.reduce((a, b) => a + b, 0) / incomeValues.length) || 0;
  const avgExpense = Math.round(expenseValues.reduce((a, b) => a + b, 0) / expenseValues.length) || 0;
  const netFlow = avgIncome - avgExpense;
  const isPositiveFlow = netFlow >= 0;

  const chartDataConfig = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeValues,
        borderColor: '#4F46E5', // Indigo-600
        backgroundColor: (context) => {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(79, 70, 229, 0.45)');
          gradient.addColorStop(0.7, 'rgba(79, 70, 229, 0.05)');
          gradient.addColorStop(1, 'rgba(79, 70, 229, 0.0)');
          return gradient;
        },
        borderWidth: 3,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#4F46E5',
        pointBorderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.45,
      },
      {
        label: 'Expenses',
        data: expenseValues,
        borderColor: '#EF4444', // Red-500
        backgroundColor: (context) => {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(239, 68, 68, 0.3)');
          gradient.addColorStop(0.8, 'rgba(239, 68, 68, 0.0)');
          gradient.addColorStop(1, 'rgba(239, 68, 68, 0.0)');
          return gradient;
        },
        borderWidth: 3,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#EF4444',
        pointBorderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.45,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false, // We'll build a custom HTML legend instead
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.98)',
        padding: { top: 16, bottom: 16, left: 20, right: 20 },
        titleFont: { size: 13, family: "'Inter', sans-serif", weight: 'bold' },
        titleColor: '#94A3B8', // slate-400
        bodyFont: { size: 15, family: "'Inter', sans-serif", weight: 'bold' },
        bodyColor: '#F8FAFC',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        cornerRadius: 16,
        boxPadding: 8,
        usePointStyle: true,
        footerFont: { size: 14, family: "'Inter', sans-serif", weight: 'bold' },
        footerColor: '#10B981',
        footerMarginTop: 10,
        callbacks: {
          label: (context) => {
            return ` ${context.dataset.label}: $${context.raw.toLocaleString()}`;
          },
          footer: (tooltipItems) => {
            if (tooltipItems.length === 2) {
              const inc = tooltipItems[0].raw;
              const exp = tooltipItems[1].raw;
              const net = inc - exp;
              return `Net Flow: ${net >= 0 ? '+' : '-'}$${Math.abs(net).toLocaleString()}`;
            }
            return '';
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)', // slate-400 with opacity
          drawBorder: false,
          borderDash: [5, 5],
        },
        ticks: {
          font: { family: "'Inter', sans-serif", weight: '600', size: 11 },
          color: '#94A3B8',
          maxTicksLimit: 6,
          padding: 12,
          callback: function(value) {
            return value >= 1000 ? '$' + (value / 1000) + 'k' : '$' + value;
          }
        },
        border: { display: false }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          font: { family: "'Inter', sans-serif", weight: '600', size: 12 },
          color: '#94A3B8',
          padding: 12,
        },
        border: { display: false }
      }
    }
  };

  return (
    <div className="bg-bg-surface rounded-[2.5rem] shadow-xl shadow-text-primary/5 border border-border-subtle flex flex-col h-full min-h-[440px] overflow-hidden transition-all duration-300">
      
      {/* Header & Controls */}
      <div className="px-8 pt-8 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-accent-primary/10 border border-accent-primary/10 shadow-inner">
            <Activity className="w-5 h-5 text-accent-primary" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-text-primary tracking-tight">Income vs Expenses</h3>
            <p className="text-[11px] font-bold text-text-secondary uppercase tracking-widest mt-1 opacity-60">Cash Flow Velocity</p>
          </div>
        </div>

        {/* Range Selector & Custom Legend */}
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center bg-bg-elevated/50 rounded-2xl p-1 gap-0.5 border border-border-subtle">
            {RANGES.map(r => (
              <button
                key={r.label}
                onClick={() => setRange(r.label)}
                className={`px-4 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all duration-300 ${
                  range === r.label
                    ? 'bg-bg-surface text-text-primary shadow-sm border border-border-subtle'
                    : 'text-text-secondary opacity-60 hover:opacity-100'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 px-2">
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent-primary border-2 border-accent-primary/20" />
                <span className="text-xs font-bold text-text-secondary opacity-80">Income</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500 border-2 border-rose-500/20" />
                <span className="text-xs font-bold text-text-secondary opacity-80">Expenses</span>
             </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 mx-8 mb-6 gap-4">
        <div className="bg-bg-elevated/30 border border-border-subtle rounded-3xl p-4 transition-all hover:bg-bg-surface hover:shadow-lg hover:shadow-accent-primary/5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-widest opacity-60">Avg Income</p>
            <ArrowUpRight className="w-3.5 h-3.5 text-accent-primary" />
          </div>
          <p className="text-xl font-extrabold text-text-primary tracking-tight">${avgIncome.toLocaleString()}</p>
        </div>
        
        <div className="bg-bg-elevated/30 border border-border-subtle rounded-3xl p-4 transition-all hover:bg-bg-surface hover:shadow-lg hover:shadow-rose-500/5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-widest opacity-60">Avg Expense</p>
            <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <p className="text-xl font-extrabold text-text-primary tracking-tight">${avgExpense.toLocaleString()}</p>
        </div>

        <div className={`${isPositiveFlow ? 'bg-accent-primary/10 border-accent-primary/20' : 'bg-rose-500/10 border-rose-500/20'} border rounded-3xl p-4 transition-all shadow-sm`}>
          <div className="flex items-center justify-between mb-2">
            <p className={`text-[10px] font-extrabold uppercase tracking-widest ${isPositiveFlow ? 'text-accent-primary' : 'text-rose-600'}`}>Net Flow</p>
            <TrendingUp className={`w-3.5 h-3.5 ${isPositiveFlow ? 'text-accent-primary' : 'text-rose-600'}`} />
          </div>
          <p className={`text-xl font-extrabold tracking-tight ${isPositiveFlow ? 'text-accent-primary' : 'text-rose-600'}`}>
            {isPositiveFlow ? '+' : '-'}${Math.abs(netFlow).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 px-5 pb-6 relative w-full h-[300px]">
        <Line ref={chartRef} data={chartDataConfig} options={options} />
      </div>

    </div>
  );
}
