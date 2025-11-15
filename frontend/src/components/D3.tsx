
import React, {
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
} from 'react';
import * as d3 from 'd3';

export default function Chart() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [countries, setCountries] = useState<any[]>([]);
  const [size, setSize] = useState({ width: 2000, height: 500 });

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      try {
        const resp = await fetch('/api/countries');
        const data = await resp.json();
        setCountries(data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }
    fetchData();
  }, []);

  // Measure container width (height we’ll just fix to 300 for now)
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const element = containerRef.current;

    const measure = () => {
      const { width, height } = element.getBoundingClientRect();
      setSize({
        width,
        height, // fixed height to avoid 0px issues
      });
    };

    measure();

    const observer = new ResizeObserver(() => measure());
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  // Draw chart
  useEffect(() => {
    if (!countries.length) return;
    const { width, height } = size;
    if (!width || !height) return;

    const margin = { top: 20, right: 20, bottom: 80, left: 80 };

    const svg = d3.select(svgRef.current);

    svg.attr('width', width).attr('height', height);
    svg.selectAll('*').remove();

    const xScale = d3
      .scaleBand()
      .domain(countries.map((d) => d.name.common))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(countries, (d) => d.population)!])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg
      .selectAll('rect')
      .data(countries)
      .join('rect')
      .attr('x', (d) => xScale(d.name.common)!)
      .attr('y', (d) => yScale(d.population))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => height - margin.bottom - yScale(d.population))
      .attr('fill', '#69b3a2');

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));
  }, [countries, size]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        // give the container *some* height so the svg can live
        // border: '1px solid lightgray', // debug: lets you see the box
      }}
    >
      <svg
        ref={svgRef}
        style={{
          display: 'block',
          // IMPORTANT: don’t force 100% height here;
          // let the `width`/`height` attributes we set in D3 control it.
          width: '100%',
        }}
      />
    </div>
  );
}

