import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const BarChart = () => {
  const data = [
    { label: "Category 1", value: 10 },
    { label: "Category 2", value: 20 },
    { label: "Category 3", value: 15 },
    { label: "Category 4", value: 25 },
    { label: "Category 5", value: 18 },
  ];
  const svgRef = useRef(null);

  useEffect(() => {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const updateChart = () => {
      const width = svgRef.current.parentElement.clientWidth;
      const height = 300;
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      // Update scales
      const xScale = d3
        .scaleBand()
        .domain(data.map((d) => d.label))
        .range([0, innerWidth])
        .padding(0.1);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.value)])
        .nice()
        .range([innerHeight, 0]);

      // Select the SVG container
      const svg = d3.select(svgRef.current);

      // Update the bars
      const bars = svg.selectAll("rect").data(data);

      bars
        .enter()
        .append("rect")
        .attr("x", (d) => xScale(d.label))
        .attr("y", innerHeight) // For initial animation, set the bars to start from the bottom of the chart
        .attr("width", xScale.bandwidth())
        .attr("height", 0) // For initial animation, set the height of the bars to 0
        .attr("fill", "steelblue")
        .merge(bars) // Merge enter and existing bars
        .transition() // Add animation
        .duration(1000) // Set the animation duration (in milliseconds)
        .attr("x", (d) => xScale(d.label))
        .attr("y", (d) => yScale(d.value))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => innerHeight - yScale(d.value));

      bars
        .exit() // Remove any bars that no longer have data
        .remove();

      // Update the x-axis
      svg
        .select(".x-axis")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale));

      // Update the y-axis
      svg.select(".y-axis").call(d3.axisLeft(yScale));
    };

    // Initial chart render
    updateChart();

    // Add event listener for window resize
    window.addEventListener("resize", updateChart);

    // Cleanup the event listener on unmount
    return () => window.removeEventListener("resize", updateChart);
  }, [data]);

  return (
    <div>
      <svg ref={svgRef} width="100%" height={300}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
};

export default BarChart;
