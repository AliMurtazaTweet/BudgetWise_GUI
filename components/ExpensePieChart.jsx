import { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Target } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip);

const LABELS = ['Food', 'Transport', 'Shopping', 'Bills', 'Other'];
const COLORS = [
  '#4F46E5', // Indigo
  '#3B82F6', // Blue
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#10B981', // Emerald
];

export default function ExpensePieChart({ chartData, labels }) {
  const defaultData = [30, 20, 25, 15, 10];
  const defaultLabels = ['Food', 'Transport', 'Shopping', 'Bills', 'Other'];
  
  const activeData = chartData || defaultData;
  const actualLabels = labels || defaultLabels;
  
  const total = activeData.reduce((acc, curr) => acc + curr, 0);

  // We can track the hovered index to dynamically update the center text
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const data = {
    labels: actualLabels,
    datasets: [
      {
        data: activeData,
        backgroundColor: COLORS.slice(0, activeData.length),
        borderRadius: 20,
        borderWidth: 0,
        hoverOffset: 8,
        spacing: 5, // Creates gap between slices elegantly
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 350,
      easing: 'easeOutQuart'
    },
    onHover: (event, elements) => {
      if (elements && elements.length > 0) {
        setHoveredIndex(prev => prev !== elements[0].index ? elements[0].index : prev);
      } else {
        setHoveredIndex(prev => prev !== null ? null : prev);
      }
    },
    plugins: {
      legend: { display: false },
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
            const val = context.raw;
            const pct = total > 0 ? Math.round((val / total) * 100) : 0;
            return ` ${context.label}: ${pct}% ($${val})`;
          }
        }
      }
    },
    cutout: '78%' // Increased thickness slightly for better hover hit-box accuracy
  };

  const centerValue = hoveredIndex !== null ? (total > 0 ? Math.round((activeData[hoveredIndex] / total) * 100) : 0) : 100;
  const centerLabel = hoveredIndex !== null ? actualLabels[hoveredIndex] : 'Total';
  const centerColor = hoveredIndex !== null ? COLORS[hoveredIndex] : 'currentColor';

  return (
    <div className="bg-bg-surface rounded-[2.5rem] shadow-xl shadow-text-primary/5 border border-border-subtle flex flex-col h-full min-h-[440px] overflow-hidden transition-all duration-300">
      
      {/* Header */}
      <div className="px-8 pt-8 pb-3 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/10 shadow-inner">
            <Target className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-text-primary tracking-tight">Expenses</h3>
            <p className="text-[11px] font-bold text-text-secondary uppercase tracking-widest mt-1 opacity-60">Allocation Share</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-8 pb-8 flex flex-col items-center justify-center gap-8">
        
        {/* Chart Viewport */}
        <div className="relative w-40 h-40 shrink-0 group">
          <Doughnut data={data} options={options} />
          
          {/* Custom Center HTML Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-300">
             <span 
                className="text-2xl font-black tracking-tighter text-text-primary" 
                style={{ color: hoveredIndex !== null ? centerColor : undefined, transition: 'color 0.3s ease' }}
             >
               {centerValue}%
             </span>
             <span className="text-[10px] font-extrabold uppercase text-text-secondary tracking-widest mt-0.5 transition-opacity opacity-60 text-center px-2 truncate w-full">
               {centerLabel}
             </span>
          </div>
        </div>

        {/* Custom Legend & Progress Visuals */}
        <div className="flex flex-col flex-1 w-full gap-3 pt-4 sm:pt-0">
          {actualLabels.map((label, index) => {
            const val = activeData[index];
            const pct = total > 0 ? Math.round((val / total) * 100) : 0;
            const color = COLORS[index % COLORS.length];
            const isHovered = hoveredIndex === index;
            const isDimmed = hoveredIndex !== null && hoveredIndex !== index;

            return (
              <div 
                key={label} 
                className={`flex flex-col gap-1.5 transition-all duration-300 ${isDimmed ? 'opacity-30' : 'opacity-100'}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex justify-between items-center text-sm font-bold">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-text-secondary truncate max-w-[120px]">{label}</span>
                  </div>
                  <span className="text-text-primary">{pct}%</span>
                </div>
                {/* Micro Progress Bar */}
                <div className="w-full h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                   <div 
                     className="h-full rounded-full transition-all duration-700 ease-out" 
                     style={{ width: `${pct}%`, backgroundColor: color }} 
                   />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
