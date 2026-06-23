import { useState, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, Minus, PiggyBank } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const ALL_DATA = [
  { month: 'Jul', savings: 9000 },
  { month: 'Aug', savings: 10500 },
  { month: 'Sep', savings: 9800 },
  { month: 'Oct', savings: 11000 },
  { month: 'Nov', savings: 11500 },
  { month: 'Dec', savings: 10800 },
  { month: 'Jan', savings: 13000 },
  { month: 'Feb', savings: 12000 },
  { month: 'Mar', savings: 10000 },
  { month: 'Apr', savings: 12000 },
  { month: 'May', savings: 14000 },
  { month: 'Jun', savings: 12000 },
];

const RANGES = [
  { label: '3M', count: 3 },
  { label: '6M', count: 6 },
  { label: '1Y', count: 12 },
];

export default function SavingsTrendChart({ data = [] }) {
  const [range, setRange] = useState('6M');
  const chartRef = useRef(null);

  // merge prop data with defaults for the display window
  const allData = data.length > 0 ? data.map((d, i) => ({ month: d.month, savings: d.savings })) : ALL_DATA;
  const activeCount = RANGES.find(r => r.label === range)?.count ?? 6;
  const slicedData = allData.slice(-activeCount);

  const labels = slicedData.map(d => d.month);
  const values = slicedData.map(d => d.savings);

  const peak = Math.max(...values);
  const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  const first = values[0];
  const last = values[values.length - 1];
  const growthPct = first > 0 ? (((last - first) / first) * 100).toFixed(1) : 0;
  const isGrowing = last >= first;

  // Find the index of the peak for annotation
  const peakIndex = values.indexOf(peak);

  // Custom annotation plugin — draws a vertical dashed line + label at peak
  const peakAnnotationPlugin = {
    id: 'peakAnnotation',
    afterDraw(chart) {
      const { ctx, scales } = chart;
      if (!scales.x || !scales.y) return;
      const x = scales.x.getPixelForValue(peakIndex);
      const yTop = scales.y.top;
      const yBottom = scales.y.bottom;

      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.moveTo(x, yTop);
      ctx.lineTo(x, yBottom);
      ctx.stroke();

      // Peak badge
      const badgeW = 62, badgeH = 22, radius = 6;
      const bx = x - badgeW / 2;
      const by = yTop - 2;
      ctx.setLineDash([]);
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.moveTo(bx + radius, by);
      ctx.lineTo(bx + badgeW - radius, by);
      ctx.quadraticCurveTo(bx + badgeW, by, bx + badgeW, by + radius);
      ctx.lineTo(bx + badgeW, by + badgeH - radius);
      ctx.quadraticCurveTo(bx + badgeW, by + badgeH, bx + badgeW - radius, by + badgeH);
      ctx.lineTo(bx + radius, by + badgeH);
      ctx.quadraticCurveTo(bx, by + badgeH, bx, by + badgeH - radius);
      ctx.lineTo(bx, by + radius);
      ctx.quadraticCurveTo(bx, by, bx + radius, by);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('▲ PEAK', x, by + badgeH / 2);
      ctx.restore();
    }
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Savings',
        data: values,
        borderColor: '#10B981',
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
          gradient.addColorStop(0.6, 'rgba(16, 185, 129, 0.1)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
          return gradient;
        },
        borderWidth: 3,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#10B981',
        pointBorderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: '#10B981',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 3,
        fill: true,
        tension: 0.45,
      }
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
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.97)',
        padding: { top: 14, bottom: 14, left: 18, right: 18 },
        titleFont: { size: 12, family: "'Inter', sans-serif", weight: 'bold' },
        titleColor: '#64748B',
        bodyFont: { size: 15, family: "'Inter', sans-serif", weight: 'bold' },
        bodyColor: '#F8FAFC',
        borderColor: 'rgba(16, 185, 129, 0.25)',
        borderWidth: 1,
        cornerRadius: 14,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          title: (items) => items[0].label,
          label: (context) => {
            const val = context.raw;
            const prev = context.dataIndex > 0 ? context.dataset.data[context.dataIndex - 1] : null;
            const diff = prev !== null ? val - prev : null;
            const sign = diff !== null ? (diff >= 0 ? '+' : '') : '';
            const diffStr = diff !== null ? ` (${sign}$${Math.abs(diff).toLocaleString()})` : '';
            return ` $${val.toLocaleString()}${diffStr}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        min: Math.max(0, Math.min(...values) - 1500),
        grid: {
          color: 'rgba(241, 245, 249, 0.9)',
          drawBorder: false,
          borderDash: [5, 5],
        },
        ticks: {
          font: { family: "'Inter', sans-serif", weight: '500', size: 11 },
          color: '#94A3B8',
          padding: 12,
          maxTicksLimit: 5,
          callback: (value) => `$${(value / 1000).toFixed(0)}k`,
        },
        border: { display: false }
      },
      x: {
        grid: { display: false, drawBorder: false },
        ticks: {
          font: { family: "'Inter', sans-serif", weight: '500', size: 11 },
          color: '#94A3B8',
          padding: 10,
        },
        border: { display: false }
      }
    }
  };

  return (
    <div className="bg-bg-surface rounded-[2.5rem] shadow-xl shadow-text-primary/5 border border-border-subtle flex flex-col h-full min-h-[420px] overflow-hidden">
      {/* Header */}
      <div className="px-8 pt-8 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/10 shadow-inner">
              <PiggyBank className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-text-primary tracking-tight">Savings Trend</h3>
              <p className="text-[11px] font-bold text-text-secondary uppercase tracking-widest mt-0.5 opacity-60">Monthly savings velocity</p>
            </div>
          </div>

          {/* Range Selector */}
          <div className="flex items-center bg-bg-elevated/50 rounded-2xl p-1 gap-0.5 border border-border-subtle">
            {RANGES.map(r => (
              <button
                key={r.label}
                onClick={() => setRange(r.label)}
                className={`px-4 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wide transition-all duration-300 ${
                  range === r.label
                    ? 'bg-bg-surface text-text-primary shadow-sm border border-border-subtle'
                    : 'text-text-secondary opacity-40 hover:opacity-100'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 mx-8 mb-5 gap-3">
        <div className="bg-bg-elevated/30 border border-border-subtle rounded-2xl p-4">
          <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-widest mb-1 opacity-60">Avg / Month</p>
          <p className="text-base font-extrabold text-text-primary tracking-tight">${avg.toLocaleString()}</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/10 rounded-2xl p-4">
          <p className="text-[10px] font-extrabold text-emerald-500 uppercase tracking-widest mb-1 opacity-60">Peak</p>
          <p className="text-base font-extrabold text-emerald-600 tracking-tight">${peak.toLocaleString()}</p>
        </div>
        <div className={isGrowing ? "bg-emerald-500/10 border border-emerald-500/10 rounded-2xl p-4" : "bg-rose-500/10 border border-rose-500/10 rounded-2xl p-4"}>
          <p className={`text-[10px] font-extrabold uppercase tracking-widest mb-1 opacity-60 ${isGrowing ? "text-emerald-500" : "text-rose-500"}`}>Growth</p>
          <div className={`flex items-center gap-1 text-base font-extrabold tracking-tight ${isGrowing ? "text-emerald-600" : "text-rose-600"}`}>
            {isGrowing ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {growthPct}%
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 px-4 pb-6 relative">
        <Line ref={chartRef} data={chartData} options={options} plugins={[peakAnnotationPlugin]} />
      </div>

      {/* Footer Tip */}
      <div className={`mx-8 mb-6 mt-1 flex items-center gap-2 px-4 py-3 border rounded-2xl ${isGrowing ? "bg-emerald-500/10 border-emerald-500/20" : "bg-rose-500/10 border-rose-500/20"}`}>
        <div className={`w-2 h-2 rounded-full animate-pulse shrink-0 ${isGrowing ? "bg-emerald-500" : "bg-rose-500"}`} />
        <p className={`text-[11px] font-bold ${isGrowing ? "text-emerald-600" : "text-rose-600"}`}>
          {isGrowing
            ? `Savings grew by ${growthPct}% over the selected period. Keep it up!`
            : `Savings dropped ${Math.abs(growthPct)}% over this period. Review your spending habits.`}
        </p>
      </div>
    </div>
  );
}
