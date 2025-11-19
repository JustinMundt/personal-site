
// data.observations -> array of { date, value }
import React, {
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
} from 'react';
import Button from '@mui/material/Button';
import * as d3 from 'd3';

type FredObservationRaw = {
  date: string;
  value: string;
};

export default function Fed() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const [fedReserve, setFedReserve] = useState<FredObservationRaw[]>([]);
  const [size, setSize] = useState({ width: 4000, height: 500 });
  const [logScale, setLogScale] = useState(false);

  // Fetch FRED data
  useEffect(() => {
    async function fetchData() {
      try {
        const resp = await fetch('/api/fred?series_id=CPIAUCSL');
        const data = await resp.json();
        setFedReserve(data.observations || []);
        console.log('DATA', data.observations);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }
    fetchData();
  }, []);

  // Measure container width
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const element = containerRef.current;

    const measure = () => {
      const { width } = element.getBoundingClientRect();
      const height = size.height; // keep fixed, or read from rect if you want
      setSize({
        width: width || size.width,
        height,
      });
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);

    return () => observer.disconnect();
  }, [size.height]);

  // Draw chart
  useEffect(() => {
    if (!fedReserve.length) return;
    const { width, height } = size;
    if (!width || !height) return;

    const margin = { top: 20, right: 20, bottom: 60, left: 80 };
    const svg = d3.select(svgRef.current);
    const tooltip = tooltipRef.current;

    svg.attr('width', width).attr('height', height);
    svg.selectAll('*').remove();

    // Parse and clean data
    const data = fedReserve
      .map((d) => ({
        date: new Date(d.date),
        valueNum: Number(d.value),
      }))
      .filter((d) => !Number.isNaN(d.valueNum));

    if (!data.length) return;

    // X scale (time)
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date) as [Date, Date])
      .range([margin.left, width - margin.right]);

    // Y scale (linear or log)
    const yMax = d3.max(data, (d) => d.valueNum)!;
    const yMin = d3.min(data, (d) => d.valueNum)!;

    const yScale = logScale
      ? d3
          .scaleLog()
          .domain([Math.max(1, yMin), yMax])
          .range([height - margin.bottom, margin.top])
          .nice()
      : d3
          .scaleLinear()
          .domain([0, yMax])
          .range([height - margin.bottom, margin.top])
          .nice();

    // Line generator
    const line = d3
      .line<{ date: Date; valueNum: number }>()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.valueNum))
      .curve(d3.curveMonotoneX);

    // Draw line
    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#69b3a2')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Axes
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    // Circles + tooltip
    svg
      .selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', (d) => xScale(d.date))
      .attr('cy', (d) => yScale(d.valueNum))
      .attr('r', 3)
      .attr("fill", "transparent")
      .style('cursor', 'pointer')
      .on('mouseover', (event, d) => {
        if (!tooltip) return;
        tooltip.style.display = 'block';
        tooltip.innerHTML = `
          <strong>${d.date.toISOString().slice(0, 10)}</strong><br/>
          CPI: ${d.valueNum.toFixed(3)}
        `;
      })
      .on('mousemove', (event) => {
        if (!tooltip) return;
        tooltip.style.left = event.offsetX + 15 + 'px';
        tooltip.style.top = event.offsetY + 15 + 'px';
      })
      .on('mouseout', () => {
        if (!tooltip) return;
        tooltip.style.display = 'none';
      });
  }, [fedReserve, size, logScale]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '400vw',
        minHeight: 300,
        position: 'relative', // needed for tooltip positioning
      }}
    >
      <svg
        ref={svgRef}
        width={size.width}
        height={size.height}
        style={{ display: 'block' }}
      />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          background: 'rgba(0,0,0,0.75)',
          color: 'white',
          padding: '6px 10px',
          borderRadius: '4px',
          fontSize: '12px',
          display: 'none',
          zIndex: 10,
        }}
      />

      <Button onClick={() => setLogScale((v) => !v)}>
        {logScale ? 'LinearScale' : 'LogScale'}
      </Button>
    </div>
  );
}

