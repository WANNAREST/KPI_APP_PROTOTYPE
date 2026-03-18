const Sparkline = ({ score }) => {
  const data = [Math.max(0, score - 20), Math.max(0, score - 10), Math.max(0, score + 5), score];
  const min = 0; 
  const max = 120;
  const range = max - min || 1;
  const width = 60;
  const height = 24;
  const points = data.map((d, i) => `${(i / (data.length - 1)) * width},${height - ((d - min) / range) * height}`).join(' ');
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={width} height={height} className="overflow-visible">
        <polyline points={points} fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((d, i) => (
          <circle key={i} cx={(i / (data.length - 1)) * width} cy={height - ((d - min) / range) * height} r="2" fill={i === data.length - 1 ? "#fff" : "#818cf8"} />
        ))}
      </svg>
      <span className="text-[10px] text-stone-500">Gần đây</span>
    </div>
  )
}

export default Sparkline;


