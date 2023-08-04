import React, { useEffect, useRef, useState } from "react";
import {
  axisBottom,
  axisLeft,
  axisRight,
  curveCardinal,
  line,
  scaleLinear,
  select,
} from "d3";

const LineChart = () => {
  const [data, setData] = useState([25, 30, 45, 60, 20, 65, 75]);
  const svgRef = useRef();
  const width = 300;
  const height = 150;

  useEffect(() => {
    const svg = select(svgRef.current);

    const xScale = scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width]);

    const yScale = scaleLinear().domain([0, 150]).range([height, 0]);

    const xAxis = axisBottom(xScale)
      .ticks(data.length)
      .tickFormat((index) => index + 1);
    svg
      .select(".x-axis")
      .style("transform", `translateY(${height}px)`)
      .call(xAxis);

    const yAxis = axisRight(yScale);
    svg.select(".y-axis").style("transform", "translateX(300px)").call(yAxis);

    const myLine = line()
      .x((value, index) => xScale(index))
      .y((value) => yScale(value))
      .curve(curveCardinal);

    svg
      .selectAll(".line")
      .data([data])
      .join("path")
      .attr("class", "line")
      .attr("d", myLine)
      .attr("fill", "none")
      .attr("stroke", "blue");

    // Adding animations
    svg
      .selectAll(".dot")
      .data(data)
      .join("circle")
      .attr("class", "dot")
      .attr("cx", (value, index) => xScale(index))
      .attr("cy", yScale(0))
      .attr("r", 5)
      .attr("fill", "blue")
      .transition()
      .duration(1000)
      .attr("cy", (value) => yScale(value));

    // Adding tooltips
    svg
      .selectAll(".dot")
      .on("mouseover", (event, value) => {
        const tooltip = select(".tooltip");
        tooltip.transition().style("opacity", 1);
        tooltip
          .html(`Value: ${value}`)
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => {
        select(".tooltip").transition().style("opacity", 0);
      });
  }, [data]);

  return (
    <>
      <svg ref={svgRef} width={width} height={height} className="mx-4">
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
      <div className="tooltip" style={{ opacity: 0 }}></div>
    </>
  );
};

export default LineChart;
