const bins = [
  { lo: 1.4, hi: 1.6, entered: 1, armed: 14 },
  { lo: 1.2, hi: 1.4, entered: 3, armed: 22 },
  { lo: 1.0, hi: 1.2, entered: 6, armed: 28 },
  { lo: 0.8, hi: 1.0, entered: 14, armed: 18 },
  { lo: 0.6, hi: 0.8, entered: 26, armed: 9 },
  { lo: 0.4, hi: 0.6, entered: 22, armed: 4 },
  { lo: 0.2, hi: 0.4, entered: 12, armed: 2 },
  { lo: 0.0, hi: 0.2, entered: 5, armed: 1 },
];

export function SpreadChart() {
  const width = 1000, height = 300, left = 54, right = 20, top = 10, bottom = 20;
  const plotWidth = width - left - right, plotHeight = height - top - bottom;
  const rowHeight = plotHeight / bins.length, barHeight = rowHeight * 0.32;
  const now = 0.83, nowY = top + (1 - now / 1.6) * plotHeight;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" width="100%" height="100%" role="img" aria-label="예시 스프레드 구간별 진입 완료 및 대기 분포, 현재 예시값 0.83%">
      {bins.map((bin, index) => {
        const center = top + index * rowHeight + rowHeight / 2;
        return <g key={bin.lo}>
          <text className="sp-axis-txt" x={left - 10} y={center + 3} textAnchor="end">{bin.lo.toFixed(1)}~{bin.hi.toFixed(1)}</text>
          <rect className="sp-bar-e" x={left} y={center - barHeight - 2} width={bin.entered / 30 * plotWidth} height={barHeight} rx={2} />
          <rect className="sp-bar-a" x={left} y={center + 2} width={bin.armed / 30 * plotWidth} height={barHeight} rx={2} />
        </g>;
      })}
      <line className="sp-axis" x1={left} y1={top} x2={left} y2={top + plotHeight} />
      <text className="sp-axis-hint" x={left + 6} y={height - 6}>← 적음</text>
      <text className="sp-axis-hint" x={width - right} y={height - 6} textAnchor="end">많음 →</text>
      <line className="sp-now-line" x1={left} y1={nowY} x2={width - right} y2={nowY} />
      <text className="sp-now-tag" x={width - right} y={nowY - 5} textAnchor="end">현재 {now}%</text>
    </svg>
  );
}
