import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

export default function Chart() {
  const ref = useRef()
  const [countries, setCountries] = useState([]);
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

  useEffect(() => {
    if (!countries.length) return;

    // const width = 4000;
    // const height = 300;
    const { width, height } = ref.current.getBoundingClientRect()
    const margin = { top: 20, right: 20, bottom: 80, left: 80 };

    const svg = d3
      .select(ref.current)
      .attr('width', width)
      .attr('height', height);

    // Clear old content (for re-renders)
    svg.selectAll('*').remove();

    // X = country names
    const xScale = d3
      .scaleBand()
      .domain(countries.map(d => d.name.common))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    // Y = population
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(countries, d => d.population)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Bars
    svg
      .selectAll('rect')
      .data(countries)
      .join('rect')
      .attr('x', d => xScale(d.name.common))
      .attr('y', d => yScale(d.population))
      .attr('width', xScale.bandwidth())
      .attr('height', d => (height - margin.bottom) - yScale(d.population))
      .attr('fill', '#69b3a2');

    // X axis
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    // Y axis
    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

  }, [countries]);
  return <svg ref={ref}></svg>
}
