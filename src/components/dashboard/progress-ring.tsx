'use client';

interface ProgressRingProps {
  progress: number; // 0 to 100
}

const ProgressRing = ({ progress }: ProgressRingProps) => {
  const stroke = 12;
  const radius = 85;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getRingColor = (p: number) => {
    if (p > 70) return "hsl(var(--destructive))";
    if (p > 40) return "hsl(var(--chart-4))";
    return "hsl(var(--chart-1))"; // Using chart-1 for 'attend'
  };
  
  const getTextColorClass = (p: number) => {
    if (p > 70) return "text-destructive";
    if (p > 40) return "text-[hsl(var(--chart-4))]"; // chart-4 is yellowish
    return "text-[hsl(var(--chart-1))]";
  };
  
  const textColorClass = getTextColorClass(progress);

  return (
    <div className="relative" style={{width: radius*2, height: radius*2}}>
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle
          stroke="hsl(var(--muted))"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={getRingColor(progress)}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-5xl font-bold ${textColorClass}`}>
          {Math.round(progress)}%
        </span>
        <span className="text-base font-medium text-muted-foreground mt-1">No-Show Risk</span>
      </div>
    </div>
  );
};

export default ProgressRing;
