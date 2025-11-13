import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

export default function Chart() {
  const ref = useRef()

  useEffect(() => {
    const svg = d3.select(ref.current)
      .attr('width', 400)
      .attr('height', 200)

    const data = [25, 30, 45, 60, 20, 65, 75]

    const xScale = d3.scaleBand()
      .domain(data.map((_, i) => i))
      .range([0, 400])
      .padding(0.1)

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .range([200, 0])

    svg.selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', (_, i) => xScale(i))
      .attr('y', d => yScale(d))
      .attr('width', xScale.bandwidth())
      .attr('height', d => 200 - yScale(d))
      .attr('fill', '#69b3a2')

  }, [])

  return <svg ref={ref}></svg>
}
