import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./lineChart.css";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import {
  ANALYTICS_MONTHLY_TAB,
  GAS,
  OIL,
  convertToDisplayFormatShortCurrency,
  sixtyColors,
} from "../../utils/helper";
import { handleSelectedForecastPoint } from "../store/actions/wells-rigs-action";
import moment from "moment";

const LineChart = ({ usedFor, yLabel, id, useDateXAxis }) => {
  const mainChartRef = useRef(null);
  const legendRef = useRef(null);
  const parentRef = useRef(null);
  const [parentWidth, setParentWidth] = useState(0);

  const resizeObserver = new ResizeObserver((entries) => {
    // When the parent div's size changes, update the state with the new width
    for (let entry of entries) {
      if (entry.target === parentRef.current) {
        setParentWidth(entry.contentRect.width);
      }
    }
  });

  const {
    wellsAndRigs: {
      analyticsData: {
        oil_data,
        gas_data,
        normalized,
        cum_oil_data,
        cum_gas_data,
        type,
        action,
        action_cum,
        forecastingData: { dataList },
        apiList,
        apiListObj,
        selectedForecastPoint,
      },
      openForeCast,
      checkedItemList,
      fullScrnAnalytics,
      tabIndex,
      selectedRowId,
    },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    noData && setNoData(false);
    // eslint-disable-next-line
  }, [
    // eslint-disable-next-line
    JSON.stringify(oil_data),
    // eslint-disable-next-line
    JSON.stringify(gas_data),
    // eslint-disable-next-line
    JSON.stringify(cum_gas_data),
    // eslint-disable-next-line
    JSON.stringify(cum_oil_data),
  ]);

  useEffect(() => {
    d3.select(mainChartRef.current).selectAll("*").remove();
    d3.select(legendRef.current).selectAll("*").remove();
    let data = dataList
      ? [...dataList.map((item) => Object.assign({}, item))]
      : [];
    let selectedRowWellName = "";
    let matchRow = (apiListObj || [])?.filter(
      (item) => item.id === selectedRowId
    );
    fullScrnAnalytics &&
      !openForeCast &&
      matchRow.length &&
      (selectedRowWellName = matchRow[0]["well_name"]);

    let nameKey = !normalized
      ? tabIndex === 1
        ? "profile"
        : "well_name"
      : "drill_type";

    let Data = (
      (type === ANALYTICS_MONTHLY_TAB ? oil_data : cum_oil_data).length > 0 &&
      usedFor === OIL
        ? type === ANALYTICS_MONTHLY_TAB
          ? oil_data
          : cum_oil_data
        : (type === ANALYTICS_MONTHLY_TAB ? gas_data : cum_gas_data).length >
            0 && usedFor === GAS
        ? type === ANALYTICS_MONTHLY_TAB
          ? gas_data
          : cum_gas_data
        : []
    ).map((item) => {
      let temp = checkedItemList.filter((obj) =>
        JSON.stringify(obj).includes(item.name)
      );
      //selected point of item list
      let tempSelPoint = [];
      selectedForecastPoint &&
        selectedForecastPoint.length &&
        openForeCast &&
        (tempSelPoint = selectedForecastPoint.filter((_obj) =>
          JSON.stringify(_obj).includes(item.name)
        ));
      if (Array.isArray(tempSelPoint) && !tempSelPoint.length) {
        tempSelPoint = selectedForecastPoint;
      }
      //with the help of nonZero key we are removing the starting null and zero data
      let nonZero = false;
      let tempArray = [];
      let tempNumValue = 0;
      item.values.forEach((_item, index) => {
        if (
          (_item.production_quantity === 0 ||
            _item.production_quantity === null) &&
          !nonZero
        ) {
        } else {
          !nonZero && (nonZero = true);

          tempArray.push({
            date: _item.production_date,
            price: _item.production_quantity,
            numValue: tempNumValue,
            //changing the highlight key value if it lies in selected point
            highlight:
              !openForeCast ||
              !selectedForecastPoint ||
              !selectedForecastPoint.length
                ? true
                : tempSelPoint.filter(
                    (selPoint) =>
                      JSON.stringify(selPoint).includes(
                        _item.production_quantity
                      ) &&
                      JSON.stringify(selPoint).includes(_item.production_date)
                  ).length
                ? true
                : false,
          });
          tempNumValue = tempNumValue + 1;
        }
      });
      return {
        name:
          checkedItemList.length &&
          (type === ANALYTICS_MONTHLY_TAB
            ? action === "none"
            : action_cum === "none")
            ? temp.length && `${nameKey}` in temp[0]
              ? temp[0][`${nameKey}`]
              : "NA"
            : item.name,
        values: tempArray,
      };
    });
    data = [...Data, ...data];
    console.log({ data });
    if (!data || data.length === 0) {
      setNoData(true);
      return; // No data to render
    }

    const parentWidth = mainChartRef.current.clientWidth;
    const margin = { top: 0, right: 20, bottom: 40, left: 50 };
    const width = parentWidth - margin.left - margin.right;
    const parentHeight = parentRef.current.clientHeight;
    const height = parentHeight - margin.top - margin.bottom;
    const height2 = 50;

    // const color = d3.scaleOrdinal(d3.schemeCategory10);
    const color = d3.scaleOrdinal(sixtyColors);

    const parseDate = d3.timeParse("%Y-%m-%d");

    const x = useDateXAxis
      ? d3.scaleTime().range([0, width])
      : d3.scaleLinear().range([0, width]);
    const x2 = useDateXAxis
      ? d3.scaleTime().range([0, width])
      : d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);
    const y2 = d3.scaleLinear().range([height2, 0]);

    // Use d3.utcFormat for custom tick format
    const xAxis = useDateXAxis
      ? d3.axisBottom(x).ticks(7).tickFormat(d3.utcFormat("%b-%y"))
      : d3.axisBottom(x);
    // const x2Axis = d3.axisBottom(x2).tickFormat(d3.utcFormat("%b-%y"));

    const line = d3
      .line()
      .x((d) => x(useDateXAxis ? d.date : d.numValue))
      .y((d) => y(d.price))
      .defined((d) => !isNaN(d.price))
      .curve(d3.curveLinear);

    const mainSvg = d3
      .select(mainChartRef.current)
      .append("svg")
      .attr("width", parentWidth)
      .attr("height", parentHeight);

    // Inside the useEffect hook, after other SVG elements are created
    if (data.length) {
      // Append the tooltip line
      mainSvg
        .append("line")
        .attr("class", "tooltip-line")
        .style("stroke", "white")
        .style("stroke-dasharray", "5,5")
        .style("opacity", 0);

      // Handle mouse movement to show tooltip line and text
      mainSvg.on("mousemove", handleMouseMove);
    }

    function handleMouseMove(event) {
      const [xPos, yPos] = d3.pointer(event);

      // Append the tooltip to the SVG
      mainSvg.select("#tooltip").remove(); // Remove any existing tooltip

      // Update position of tooltip line
      mainSvg
        .select(".tooltip-line")
        .attr("x1", xPos)
        .attr("y1", 0)
        .attr("x2", xPos)
        .attr("y2", height)
        .style("opacity", 1);

      // Prepare tooltip content
      let tooltipContent = "";

      // Find the corresponding xValue using the xScale
      const xValue = x.invert(xPos);

      // Iterate over each line's data points
      sources.forEach((source, _i) => {
        const bisectDate = d3.bisector((d) =>
          useDateXAxis ? d.date : d.numValue
        ).left;
        const index = bisectDate(source.values, xValue, 1);
        const d0 = index > 0 ? source.values[index - 1] : null; // Check if index is valid
        const d1 = index < source.values.length ? source.values[index] : null; // Check if index is within range

        if (d0 && d1) {
          const d =
            xValue - (useDateXAxis ? d0.date : d0.numValue) >
            (useDateXAxis ? d1.date : d1.numValue) - xValue
              ? d1
              : d0;

          if (d) {
            const xPosValue = x(useDateXAxis ? d.date : d.numValue); // x position of the data point

            // Check if the xPos is close to the tooltip's xPos
            if (Math.abs(xPosValue - xPos) < 2) {
              // Only show details for the line where the tooltip line intersects
              tooltipContent += `<span style="color: ${
                (openForeCast && _i === 1) ||
                (openForeCast && !dataList && _i === 0)
                  ? "#2585c6"
                  : openForeCast
                  ? "grey"
                  : color(source.name)
              };">
              ${
                source.name.length > 13
                  ? source.name.slice(0, 13) + "..."
                  : source.name
              } (${convertToDisplayFormatShortCurrency(d.price)})
              </span><br>`;
            }
          }
        }
      });

      // Update content and position of tooltip text

      if (tooltipContent) {
        const lineHeight = 16; // Assuming 16px line height, adjust according to your styling
        const numLines = tooltipContent.split("<br>").length;
        const tooltipPadding = 5; // Padding on each side of the tooltip content
        const tooltipWidth = 150; // Default tooltip width
        const tooltipHeight = numLines * lineHeight + tooltipPadding * 2; // Add padding on both sides

        // Calculate the container's width
        const containerWidth = mainSvg.node().getBoundingClientRect().width;

        // Calculate the tooltip's position
        let tooltipX = xPos + 10; // Default to right side
        if (xPos + tooltipWidth + 20 > containerWidth) {
          tooltipX = xPos - tooltipWidth - 10; // Move to the left side
        }

        mainSvg
          .append("foreignObject")
          .attr("id", "tooltip")
          .attr("x", tooltipX)
          .attr("y", yPos - tooltipHeight)
          .attr("width", tooltipWidth)
          .attr("height", tooltipHeight)
          .html(
            `<div style="font-size: 12px; background-color: rgba(0, 0, 0, 0.7); padding: ${tooltipPadding}px; border-radius: 5px; position: relative; z-index: 9999;">${tooltipContent}</div>`
          );
      }
    }

    // Hide tooltip line and text on mouseout
    mainSvg.on("mouseout", () => {
      mainSvg.select(".tooltip-line").style("opacity", 0);
      // tooltipText.style("opacity", 0);
      mainSvg.select("#tooltip").remove();
    });

    mainSvg
      .append("defs")
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", width)
      .attr("height", height);

    color.domain(
      Object.keys(data[0].values[0] || {}).filter((key) => {
        return key !== "date";
      })
    );

    data.forEach((countryData) => {
      countryData.values = countryData.values.map((d) => ({
        ...d,
        date: parseDate(d.date),
        price: +d.price,
      }));
    });

    const sources = data.map((countryData) => {
      return {
        name: countryData.name,
        values: countryData.values,
      };
    });

    if (fullScrnAnalytics && !openForeCast) {
      // Define dataWithoutForecast within the useEffect hook
      const dataWithoutForecast = data.filter(
        (d, i) => i < data.length - (dataList || []).length
      );
      // Create legend
      const legendSvg = d3
        .select(legendRef.current)
        .append("svg")
        .attr("width", 200) // Adjust the width as needed
        .attr("height", 100); // Adjust the height as needed

      const legend = legendSvg
        .selectAll(".legend-item")
        .data(dataWithoutForecast)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(10, ${i * 20})`); // Adjust spacing

      legend
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", (d) => color(d.name));

      legend
        .append("text")
        .attr("x", 20)
        .attr("y", 5)
        .attr("dy", "0.35em")
        .text((d) =>
          d.name.length > 20 ? d.name.slice(0, 17) + "..." : d.name
        )
        .style("font-size", "12px")
        .style("fill", "white");
    }

    x.domain([
      d3.min(data, (d) =>
        d3.min(d.values, (v) => (useDateXAxis ? v.date : v.numValue))
      ),
      d3.max(data, (d) =>
        d3.max(d.values, (v) => (useDateXAxis ? v.date : v.numValue))
      ),
    ]);
    y.domain([
      // d3.min(sources, (c) => {
      //   return d3.min(c.values, (v) => {
      //     return v.price;
      //   });
      // }),
      0,
      d3.max(sources, (c) => {
        return d3.max(c.values, (v) => {
          return v.price;
        });
      }),
    ]);
    x2.domain(x.domain());
    y2.domain(y.domain());

    const focuslineGroups = mainSvg
      .selectAll(".line-group")
      .data(sources)
      .enter()
      .append("g")
      .attr("class", "line-group");

    focuslineGroups.each(function (d, i) {
      const currentGroup = d3.select(this); // The current group element

      // Iterate over the values to create line segments
      for (let j = 0; j < d.values.length - 1; j++) {
        // Determine the color of the line segment
        let segmentColor;
        if (d.values[j].highlight && d.values[j + 1].highlight) {
          // Both current and next points are highlighted
          segmentColor = openForeCast ? "#2585c6" : color(d.name); // Use the specific color for the line
        } else {
          // At least one of the points is not highlighted
          segmentColor = "grey"; // Use grey color for the line segment
        }

        // Draw a line segment between the current point and the next point
        currentGroup
          .append("line")
          .attr("x1", line.x()(d.values[j], j))
          .attr("y1", line.y()(d.values[j], j))
          .attr("x2", line.x()(d.values[j + 1], j + 1))
          .attr("y2", line.y()(d.values[j + 1], j + 1))
          .style("stroke", segmentColor)
          .style("stroke-width", d.name === selectedRowWellName ? 3 : 1)
          .style(
            "stroke-dasharray",
            j >= d.values.length - (dataList || []).length ? "5,5" : "none"
          )
          .attr("clip-path", "url(#clip)")
          .on("mouseover", handleLineMouseOver)
          .on("mouseout", handleLineMouseOut)
          .on("contextmenu", handleLineClick); // Add right-click event listener
      }
    });

    if (selectedRowId && !openForeCast && fullScrnAnalytics) {
      mainSvg
        .append("text")
        .attr("id", `tooltip-${selectedRowId}`)
        .attr("x", width / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .style("fill", color(selectedRowWellName))
        .style("stroke", 3)
        .text(selectedRowWellName);
    }

    focuslineGroups
      .selectAll("circle")
      .data((d) => d.values)
      .enter()
      .append("circle")
      .attr("class", "circle") // Assign the class "circle"
      .attr("cx", (d) => x(useDateXAxis ? d.date : d.numValue))
      .attr("cy", (d) => y(d.price))
      .attr("r", 1.5)
      .style("opacity", 1)
      // .style("fill", (d) => color(d.name))
      .style("fill", function (d) {
        // Use function instead of arrow function to access 'this'
        return d.highlight
          ? openForeCast
            ? "#2585c6"
            : color(d3.select(this.parentNode).datum().name)
          : "grey";
      })
      .attr("clip-path", "url(#clip)")
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("contextmenu", handleLineClick); // Add click event listener

    mainSvg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).ticks(7));

    let isSelecting = false; // Variable to track if selection is in progress
    let xStart, yStart, selectionRect;

    if (openForeCast && (!dataList || !dataList.length)) {
      // Add event listener for mouse down to start or stop selection
      mainSvg.on("mousedown", function (event) {
        if (event.button !== 0) return; // Check if left mouse button is clicked
        event.preventDefault();

        if (!isSelecting) {
          // Start selection
          startSelection(event);
        } else {
          // Stop selection
          stopSelection(event);
        }
      });

      // Function to start the selection process
      function startSelection(event) {
        isSelecting = true;
        [xStart, yStart] = d3.pointer(event);
        selectionRect = createSelectionRect(xStart, yStart);

        // Add event listener for mouse move to update selection rectangle
        mainSvg.on("mousemove", mouseMoveHandler);

        // Add event listener for mouse up to end selection
        mainSvg.on("mouseup", stopSelection);

        // Change cursor style to crosshair
        mainSvg.style("cursor", "crosshair");
      }

      // Function to stop the selection process
      function stopSelection(event) {
        if (!isSelecting) return; // If not selecting, return
        isSelecting = false;
        mainSvg.on("mousemove", null); // Remove event listener for mouse move
        mainSvg.on("mouseup", null); // Remove event listener for mouse up
        const [xEnd, yEnd] = d3.pointer(event);
        const xMin = Math.min(xStart, xEnd);
        const xMax = Math.max(xStart, xEnd);
        const yMin = Math.min(yStart, yEnd);
        const yMax = Math.max(yStart, yEnd);

        const selectedPoints = selectPointsWithinRect(xMin, yMin, xMax, yMax);
        handleSelectedPoints(selectedPoints);

        // Revert cursor style to default
        mainSvg.style("cursor", "default");

        // Remove selection rectangle
        selectionRect.remove();
        mainSvg.on("mousemove", handleMouseMove);
      }

      // Function to handle mouse move events
      function mouseMoveHandler(event) {
        if (!isSelecting) return; // If not selecting, return
        const [xEnd, yEnd] = d3.pointer(event);
        updateSelectionRect(selectionRect, xStart, yStart, xEnd, yEnd);
      }

      // Function to create selection rectangle
      function createSelectionRect(x, y) {
        return mainSvg
          .append("rect")
          .attr("class", "selection-rect")
          .attr("x", x)
          .attr("y", y)
          .attr("width", 0)
          .attr("height", 0)
          .style("fill", "rgba(0, 0, 0, 0.1)")
          .style("stroke", "#fff")
          .style("stroke-width", 1);
      }

      // Function to update selection rectangle
      function updateSelectionRect(rect, xStart, yStart, xEnd, yEnd) {
        const x = Math.min(xStart, xEnd);
        const y = Math.min(yStart, yEnd);
        const width = Math.abs(xEnd - xStart);
        const height = Math.abs(yEnd - yStart);
        rect
          .attr("x", x)
          .attr("y", y)
          .attr("width", width)
          .attr("height", height);
      }

      // Function to select points within the selection rectangle
      function selectPointsWithinRect(xMin, yMin, xMax, yMax) {
        const selectedPoints = [];
        mainSvg.selectAll(".line-group").each(function (lineData) {
          lineData.values.forEach(function (d) {
            const cx = x(useDateXAxis ? d.date : d.numValue);
            const cy = y(d.price);
            let selected = false;
            if (cx >= xMin && cx <= xMax && cy >= yMin && cy <= yMax) {
              selected = true;
            }
            selectedPoints.push({
              x: cx,
              y: cy,
              date: d.date,
              price: d.price,
              line: lineData.name,
              selected: selected,
              producing_month: d.numValue,
            });
          });
        });

        return selectedPoints;
      }

      // Function to handle the selected points
      function handleSelectedPoints(selectedPoints) {
        if (!JSON.stringify(selectedPoints).includes("true")) {
          return;
        }
        dispatch(
          handleSelectedForecastPoint({
            data: selectedPoints
              .filter((_item) => _item.selected)
              .map((d) => {
                let tempApi = apiListObj.filter((obj) =>
                  JSON.stringify(obj).includes(d.line)
                );
                return {
                  ...(apiList.length === 1 && {
                    api: tempApi.length
                      ? tabIndex === 1
                        ? tempApi[0]["api"]
                        : tempApi[0]["well_api"]
                      : "",
                  }),
                  production_date: moment(d.date).format("YYYY-MM-DD"),
                  production_quantity: d.price,
                  producing_month: d.producing_month,
                };
              }),
          })
        );
      }
    }

    // mainSvg.append("g").attr("class", "y axis").call(d3.axisLeft(y).ticks(10));
    mainSvg
      .append("g")
      .attr("class", "y axis")
      .call(
        d3
          .axisLeft(y)
          .ticks(4)
          .tickFormat((d) => convertToDisplayFormatShortCurrency(d))
      )
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -45) // Adjust the position based on your preference
      .attr("x", -height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .attr("text-anchor", "start")
      .style("fill", "#fff")
      .text(yLabel);

    // Add horizontal grid lines with red color
    mainSvg
      .append("g")
      .attr("class", "grid")
      .call(
        d3.axisLeft(y).ticks(4).tickSize(-width).tickFormat("").tickSizeOuter(0) // Hide the outer tick line
      )
      .selectAll("line")
      .attr("stroke", "#696B6C")
      .attr("stroke-width", ".3px");

    const brush = d3
      .brushX()
      .extent([
        [0, 0],
        [width, height2],
      ])
      .on("brush end", brushed);

    const zoom = d3
      .zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([
        [0, 0],
        [width, height], // Adjusted to include both main and context charts
      ])
      .extent([
        [0, 0],
        [width, height], // Adjusted to include both main and context charts
      ])
      .on("zoom", zoomed);

    mainSvg.call(zoom);

    // Function to handle click on the line
    function handleLineClick(event, d) {
      event.preventDefault(); // Prevent default context menu behavior
      // const [xPos, yPos] = d3.pointer(event);
      // Access the data properties as needed
      console.log("Clicked:", d);
      // console.log("Coordinates (x, y):", xPos, yPos);
    }

    function zoomed(event) {
      if (event.sourceEvent && event.sourceEvent.type === "brush") return;

      const transform = event.transform;
      let newXDomain = transform.rescaleX(x2).domain();
      let newYDomain = transform.rescaleY(y2).domain();

      if (!useDateXAxis) {
        // Restrict x-axis movement to 0
        newXDomain = [Math.max(0, newXDomain[0]), Math.max(0, newXDomain[1])];
      }

      if (newYDomain[0] < 0) {
        // Restrict y-axis movement to 0
        newYDomain = [0, newYDomain[1] - newYDomain[0]];
      }

      if (useDateXAxis) {
        // Ensure month granularity
        const startDate = new Date(newXDomain[0]);
        const endDate = new Date(newXDomain[1]);
        newXDomain = [startDate, endDate];
      }

      x.domain(newXDomain);
      y.domain(newYDomain);

      // Update line segments instead of lines
      mainSvg.selectAll(".line-group").each(function (d) {
        const currentGroup = d3.select(this);

        currentGroup.selectAll("line").each(function (datum, index) {
          if (index < d.values.length - 1) {
            // Check to avoid accessing out of bounds
            d3.select(this)
              .attr(
                "x1",
                x(
                  useDateXAxis ? d.values[index].date : d.values[index].numValue
                )
              )
              .attr("y1", y(d.values[index].price))
              .attr(
                "x2",
                x(
                  useDateXAxis
                    ? d.values[index + 1].date
                    : d.values[index + 1].numValue
                )
              )
              .attr("y2", y(d.values[index + 1].price));
          }
        });
      });

      // Update any other elements as needed, such as circles, axes...
      mainSvg
        .selectAll("circle")
        .attr("cx", (d) => x(useDateXAxis ? d.date : d.numValue))
        .attr("cy", (d) => y(d.price))
        .attr("clip-path", "url(#clip)");

      mainSvg.select(".x.axis").call(xAxis);
      mainSvg.select(".y.axis").call(
        d3
          .axisLeft(y)
          .ticks(4)
          .tickFormat((d) => convertToDisplayFormatShortCurrency(d))
      );

      if (event.transform.k !== 1) {
        // Zooming is in progress, set isSelecting to false
        isSelecting = false;
        // Remove selection rectangle if present
        if (selectionRect) selectionRect.remove();
        // Revert cursor style to default
        mainSvg.style("cursor", "default");
      }
    }

    function brushed(event) {
      if (event.sourceEvent && event.sourceEvent.type === "dblclick") {
        resetZoom();
        return;
      }

      if (event.selection) {
        const s = event.selection;
        x.domain([x2.invert(s[0]), x2.invert(s[1])]);

        mainSvg.selectAll(".line").attr("d", (d) => line(d.values));
        mainSvg.select(".x.axis").call(xAxis);
        mainSvg.select(".y.axis").call(
          d3
            .axisLeft(y)
            .ticks(4)
            .tickFormat((d) => convertToDisplayFormatShortCurrency(d))
        );
        // Update circle positions
        mainSvg
          .selectAll("circle")
          .attr("cx", (d) => x(useDateXAxis ? d.date : d.numValue))
          .attr("cy", (d) => y(d.price));

        if (event.sourceEvent) {
          const [xPos] = d3.pointer(event.sourceEvent);
          const isMouseInBrushingArea = xPos >= 0 && xPos <= width;

          if (!isMouseInBrushingArea) {
            mainSvg.select(".brush").call(brush.move, null);
          }
        }
      } else if (event.transform) {
        const transform = event.transform;
        x.domain(transform.rescaleX(x2).domain());

        mainSvg.selectAll(".line").attr("d", (d) => line(d.values));
        mainSvg.select(".x.axis").call(d3.axisBottom(x).ticks(7));
        mainSvg.select(".y.axis").call(
          d3
            .axisLeft(y)
            .ticks(4)
            .tickFormat((d) => convertToDisplayFormatShortCurrency(d))
        );
        // Update circle positions
        mainSvg
          .selectAll("circle")
          .attr("cx", (d) => x(useDateXAxis ? d.date : d.numValue))
          .attr("cy", (d) => y(d.price));
      }
    }

    function handleMouseOver(event, d) {
      const [xPos, yPos] = d3.pointer(event);

      // Prepare the tooltip text
      let tooltipText = `Date: ${d3.timeFormat("%Y-%m-%d")(d.date)}`;
      tooltipText += `<br/>`;
      tooltipText += `Price: ${convertToDisplayFormatShortCurrency(d.price)}`;
      tooltipText += `<br/>`;

      // Add line names and corresponding price values
      sources.forEach((countryData) => {
        const lineValue = countryData.values.find(
          (value) => value.date === d.date
        );
        if (lineValue) {
          tooltipText += `${countryData.name}`;
          tooltipText += `<br/>`;
        }
      });

      // Append the tooltip to the SVG
      mainSvg
        .append("foreignObject")
        .attr("id", "tooltip")
        .attr("x", xPos + 10)
        .attr("y", yPos - 10)
        .attr("width", 120)
        .attr("height", 80)
        .html(
          `<div style="font-size: 12px; background-color: rgba(0, 0, 0, 0.7); color: #fff; padding: 5px; border-radius: 5px;">${tooltipText}</div>`
        );
    }

    function handleMouseOut() {
      // d3.select(this).style("opacity", 0);
      d3.select(this).attr("r", 1.5).style("opacity", 1);
      mainSvg.select("#tooltip").remove();
    }

    function handleLineMouseOver(event, d) {
      const countryName = d.name;

      if (selectedRowWellName === countryName && !openForeCast) {
        return;
      }

      focuslineGroups
        .filter((data) => data.name === countryName)
        .select(".line")
        .style("stroke-width", 3);

      // Get the mouse coordinates
      const [xPos, yPos] = d3.pointer(event);
      mainSvg
        .append("text")
        .attr("id", "tooltip")
        .attr("x", xPos + 30)
        .attr("y", yPos - 30)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .style("fill", color(d.name))
        .style("stroke", 3)
        .text(countryName);
    }

    function handleLineMouseOut(event, d) {
      const countryName = d.name;
      if (selectedRowWellName === countryName && !openForeCast) {
        return;
      }

      focuslineGroups
        .filter((data) => data.name === countryName)
        .select(".line")
        .style("stroke-width", 1);

      //  Remove the tooltip when mouseout
      mainSvg.select("#tooltip").remove();
    }

    function resetZoom() {
      x.domain(x2.domain());
      y.domain(y2.domain());

      mainSvg.selectAll(".line").attr("d", (d) => line(d.values));

      mainSvg.selectAll(".line-group .line").style("stroke-width", 1);

      // mainSvg.selectAll("circle").style("opacity", 0);
      // Update circle positions
      mainSvg
        .selectAll("circle")
        .attr("cx", (d) => x(useDateXAxis ? d.date : d.numValue))
        .attr("cy", (d) => y(d.price))
        .attr("r", 1.5)
        .style("opacity", 1);

      mainSvg.select(".x.axis").call(d3.axisBottom(x).ticks(7));
      mainSvg.select(".y.axis").call(
        d3
          .axisLeft(y)
          .ticks(4)
          .tickFormat((d) => convertToDisplayFormatShortCurrency(d))
      );
    }

    // Start observing the parent div for size changes
    resizeObserver.observe(parentRef.current);

    return () => {
      mainSvg.selectAll("*").remove();
      resizeObserver.disconnect();
    };
    // eslint-disable-next-line
  }, [
    // eslint-disable-next-line
    JSON.stringify(oil_data),
    // eslint-disable-next-line
    JSON.stringify(gas_data),
    // eslint-disable-next-line
    JSON.stringify(cum_gas_data),
    // eslint-disable-next-line
    JSON.stringify(cum_oil_data),
    // eslint-disable-next-line
    usedFor,
    // eslint-disable-next-line
    useDateXAxis,
    //eslint-disable-next-line
    JSON.stringify(dataList),
    //eslint-disable-next-line
    JSON.stringify(selectedForecastPoint),
    //eslint-disable-next-line
    selectedRowId,
    parentWidth,
  ]);

  return (
    // no-data-found
    <div
      className={`lineChart ${noData ? "no-data-found" : ""}`}
      ref={parentRef}
      style={{
        minHeight: "calc(50vh - 6rem)",
        ...(openForeCast && { paddingRight: 0 }),
      }}
    >
      <div
        className={`legend ${
          fullScrnAnalytics && !openForeCast ? "" : "d-none"
        }`}
        ref={legendRef}
      ></div>
      <div
        className="mainChart"
        id={id}
        ref={mainChartRef}
        style={{ height: "100%" }}
      ></div>

      {noData ? (
        <div className="no-data-found">
          <figure>
            <img
              src={
                usedFor === OIL
                  ? "images/oil-nodata.svg"
                  : "images/gas-nodata.svg"
              }
              alt=""
            />
          </figure>
          <h2>No {usedFor === OIL ? "Oil" : "Gas"} Production Record</h2>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default LineChart;
