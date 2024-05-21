import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const DonutChart = ({ data }) => {
  const chartDonutRef = useRef();

  useEffect(() => {
    // Remove the previous SVG and legend
    d3.select(chartDonutRef.current).selectAll("svg, .legend-container").remove();

    if (!data || data.length === 0) {
      return; // No data to render
    }

    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const container = d3
      .select(chartDonutRef.current)
      .append("div")
      // .style("display", "flex", "justified-content","center", "align-items","center")
      .classed("chart-container", true); // Add a class to the container

    const legendContainer = container
      .append("div")
      // .style("flex", "1")
      // .style("margin-right", "20px")
      .classed("legend-container", true); // Add a class to the legend container

    const svgContainer = container
      .append("div")
      // .style("flex", "1")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const arc = d3
      .arc()
      .innerRadius(radius - 30)
      .outerRadius(radius);

    const pie = d3.pie().value((d) => d.value);

    const arcs = svgContainer
      .selectAll("arc")
      .data(pie(data))
      .enter()
      .append("g");

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => color(i))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);

    const legend = legendContainer
      .selectAll(".legend")
      .data(data)
      .enter()
      .append("div")
      .attr("class", "legend");

    legend
      .append("div")
      .classed("legend-item", true)
      .style("display", "flex")
      .style("align-items", "center");

    legend
      .select(".legend-item")
      .append("div")
      .classed("legend-color-box", true)
      .style("width", "18px")
      .style("height", "18px")
      .style("background-color", (d, i) => color(i))
      .style("margin-right", "5px");

    legend
      .select(".legend-item")
      .append("div")
      .classed("legend-text", true)
      .text((d) => `${d.label}`)
      .style("font-size", "14px")
      .style("padding", "5px")
      .style("color", "#fff");

    legend
      .append("div")
      .text((d) => d.value)
      .style("text-anchor", "center")
      .style("margin", "5px")
      .style("font-size", "12px")
      .style("color", "#fff");

    function handleMouseOver(d, i) {
      const tooltip = svgContainer
        .append("g")
        .attr("class", "tooltip")
        .attr("transform", `translate(${width / 2},${height / 2})`);

      // Check if d.data is defined before accessing its properties
      if (d.data) {
        tooltip
          .append("text")
          .text(`${d.data.label}: ${d.data.value}`)
          .style("font-size", "14px")
          .style("font-weight", "bold")
          .attr("text-anchor", "middle")
          .attr("dy", -10);
      }

      d3.select(this).attr("stroke", "black").attr("stroke-width", 2);
    }

    function handleMouseOut(d, i) {
      d3.select(this).attr("stroke", "white");
      svgContainer.select(".tooltip").remove();
    }

    // Cleanup function
    return () => {
      // Remove the previous SVG and legend
       // eslint-disable-next-line
      d3.select(chartDonutRef.current).selectAll("svg, .legend-container").remove();
    };
     // eslint-disable-next-line
  }, [JSON.stringify(data)]);

  return <div ref={chartDonutRef}></div>;
};

export default DonutChart;
