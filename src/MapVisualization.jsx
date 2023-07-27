import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson";
import "./MapVisualization.css";

const LoadingAnimation = () => {
  return (
    <div className="loading-container">
      <div className="loading-animation">
        <div className="circle circle1"></div>
        <div className="circle circle2"></div>
        <div className="circle circle3"></div>
      </div>
    </div>
  );
};

const MapVisualization = () => {
  // State variables
  const [educationData, setEducationData] = useState(null);
  const [countryData, setCountryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Data URLs
    const educationUrl =
      "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
    const countryUrl =
      "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

    // Load data
    Promise.all([d3.json(educationUrl), d3.json(countryUrl)])
      .then(([eduData, countryData]) => {
        setEducationData(eduData);
        const countryFeatures = topojson.feature(
          countryData,
          countryData.objects.counties
        ).features;
        setCountryData(countryFeatures);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    // Create the legend when educationData and countryData are available
    if (educationData && countryData) {
      // Define a custom color scale with hex codes for 10 different colors
      const colorScale = d3
        .scaleThreshold()
        .domain([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60])
        .range([
          "#ffffcc",
          "#d9f0a3",
          "#addd8e",
          "#78c679",
          "#41ab5d",
          "#238443",
          "#006837",
          "#004529",
          "#002c1c",
          "#001514",
          "#000a0d",
          "#000000",
        ]);

      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      const canvas = d3.select("#canvas");
      if (canvas && countryData && educationData) {
        canvas
          .selectAll("path")
          .data(countryData)
          .enter()
          .append("path")
          .attr("d", d3.geoPath())
          .attr("class", "country")
          .attr("fill", (countryDataItem) => {
            const id = countryDataItem["id"];
            const country = educationData.find((item) => item["fips"] === id);
            const percentage = country["bachelorsOrHigher"];

            return colorScale(percentage);
          })
          .on("mouseover", (event, countryDataItem) => {
            const id = countryDataItem["id"];
            const country = educationData.find((item) => item["fips"] === id);
            const percentage = country["bachelorsOrHigher"];

            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip
              .html(
                `<strong>${country["area_name"]}, ${country["state"]}</strong><br />${percentage}%`
              )
              .style("left", event.pageX + 10 + "px")
              .style("top", event.pageY - 30 + "px");
          })
          .on("mouseout", () => {
            tooltip.transition().duration(200).style("opacity", 0);
          });
      }

      // Legend code
      const legend = d3.select("#legend");
      const legendWidth = 580;
      const legendHeight = 30;
      const legendPadding = 2;

      const legendScale = d3
        .scaleLinear()
        .domain([0, 60])
        .range([0, legendWidth]);

      const legendAxis = d3
        .axisBottom(legendScale)
        .tickValues(colorScale.domain())
        .tickFormat((d) => d + "%");

      legend
        .append("rect")
        .attr("width", legendWidth + legendPadding * 2)
        .attr("height", legendHeight + legendPadding * 2)
        .attr("fill", "white")
        .attr("opacity", 0.8)
        .attr("transform", "translate(-10, -10)");

      legend
        .append("g")
        .attr("transform", `translate(${legendPadding}, ${legendHeight})`)
        .call(legendAxis)
        .selectAll("text")
        .attr("fill", "black");

      const gradient = legend
        .append("defs")
        .append("linearGradient")
        .attr("id", "gradient")
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "0%")
        .attr("y2", "0%");

      gradient
        .selectAll("stop")
        .data(colorScale.range())
        .enter()
        .append("stop")
        .attr(
          "offset",
          (d, i) => (i * 100) / (colorScale.range().length - 1) + "%"
        )
        .attr("stop-color", (d) => d);

      legend
        .append("rect")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#gradient)")
        .attr("transform", `translate(${legendPadding}, ${legendPadding})`);

      legend
        .append("text")
        .text("0%")
        .attr("x", legendPadding)
        .attr("y", legendHeight + legendPadding * 2)
        .attr("fill", "black");

      legend
        .append("text")
        .text("60%")
        .attr("x", legendWidth + legendPadding * 2)
        .attr("y", legendHeight + legendPadding * 2)
        .attr("fill", "black");
    }
  }, [educationData, countryData]);

  return (
    <div>
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <>
          <h2 className="text-2xl font-bold text-center mb-4">
            USA Education Data
          </h2>
          <div className="mb-4">
            <p>
              Welcome to the USA Education Data visualization! This choropleth
              map showcases educational attainment data across various countries
              in the United States.
            </p>
            <p>
              The map uses color gradients to represent the percentage of adults
              (aged 25 and above) who have completed different education levels
              in each county.
            </p>
            <p>
              Hover over each county to see specific details, or click on a
              county to explore more information and trends related to education
              in that region.
            </p>
            <p>
              Let's gain insights into the educational landscape of the USA
              together!
            </p>
          </div>
          <svg id="canvas" className="w-full min-h-screen bg-[#ffff]"></svg>
          <svg id="legend" className="w-full mt-8"></svg>
        </>
      )}
    </div>
  );
};

export default MapVisualization;
