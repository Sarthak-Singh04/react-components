import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson";
import "./MapVisualization.css";

const MapVisualization = () => {
  // State variables
  const [educationData, setEducationData] = useState(null);
  const [countryData, setCountryData] = useState(null);

  useEffect(() => {
    // Data URLs
    const educationUrl =
      "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
    const countryUrl =
      "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

    // Define a custom color scale with hex codes for 10 different colors
    const colorScale = d3
      .scaleThreshold()
      .domain([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]) // Adjust the domain based on your data
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

    // Tooltips
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    const canvas = d3.select("#canvas");
    if (countryData && educationData) {
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

    // Load data
    d3.json(countryUrl).then((data, error) => {
      if (error) {
        console.log(error);
      } else {
        const countryFeatures = topojson.feature(
          data,
          data.objects.counties
        ).features;
        setCountryData(countryFeatures);
      }
    });

    d3.json(educationUrl).then((eduData, eduError) => {
      if (eduError) {
        console.log(eduError);
      } else {
        setEducationData(eduData);
      }
    });
  }, [countryData, educationData]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-4">
        USA Education Data
      </h2>
      <div className="mb-4">
        <p>
          Welcome to the USA Education Data visualization! This choropleth map
          showcases educational attainment data across various countries in the
          United States.
        </p>
        <p>
          The map uses color gradients to represent the percentage of adults
          (aged 25 and above) who have completed different education levels in
          each county.
        </p>
        <p>
          Hover over each county to see specific details, or click on a county
          to explore more information and trends related to education in that
          region.
        </p>
        <p>
          Let's gain insights into the educational landscape of the USA
          together!
        </p>
      </div>
      <svg id="canvas" className="w-full min-h-screen bg-[#ffff]"></svg>
      <svg id="legend" className="w-full mt-8"></svg>
    </div>
  );
};

export default MapVisualization;
