import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import "./App.css";

export default function App() {
  const [data, setData] = useState([25, 50, 35, 15, 94, 10]);
  const svgRef = useRef();

  useEffect(() => {
    const w = 400;
    const h = 400;

    const svg = d3.select(svgRef.current)
      .attr("width", w)
      .attr("height", h)
      .style('overflow', 'visible');

    const xScale = d3.scaleBand()
      .domain(data.map((val, i) => i))
      .range([0, w])
      .padding(0.5);

      console.log(xScale)

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .range([h, 0]);

      console.log(yScale)

    const xAxis = d3.axisBottom(xScale).ticks(data.length);
    const yAxis = d3.axisLeft(yScale).ticks(5);

    svg.append('g')
      .call(xAxis)
      .attr('transform', `translate(0,${h})`);
    svg.append('g').call(yAxis);

    svg.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', (val, i) => xScale(i))
      .attr('y', h)
      .attr('width', xScale.bandwidth())
      .attr('height', 0)
      .attr('fill', (val) => (val >= 50 ? 'red' : val >= 30 ? 'yellow' : 'orange'))
      .transition()
      .duration(1000)
      .delay((val, i) => i * 300) // Delay each bar by 300ms
      .attr('y', val => yScale(val))
      .attr('height', val => h - yScale(val));

  }, [data]);

  // Update the data after 5 seconds


  return (
    <>
      <main className="container mx-auto p-10 ">
        <svg ref={svgRef}></svg>
      </main>
    </>
  );
}
