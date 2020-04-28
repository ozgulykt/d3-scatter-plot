import React, { Component } from 'react';
import './App.css';
import * as d3 from 'd3';

const width = 800;
const height = 500;
const margin = { top: 100, left: 15, bottom: 20, right: 150 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

class App extends Component {
  loadData = () => {
    d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
      .then(data => {
        this.setState({
          dataset: data
        });
        this.drawChart(this.state.dataset);
      });
  }

  drawChart = (data) => {
    const posWidth = innerWidth / data.length - 1;
    const posHeight = innerHeight / data.length - 1;
    const svg = d3.select("svg");

    const xScale = d3.scaleLinear()
      .domain([d3.min(data, (d) => { return (d.Year - 1) }),
      d3.max(data, (d) => { return (d.Year + 1) })])
      .range([0, innerWidth]);

    const parseData = data.map((d) => { return d3.timeParse("%M:%S")(d.Time) })

    const yScale = d3.scaleUtc()
      .domain(d3.extent(parseData))
      .range([0, innerHeight]);

    const g = svg.append("g")
      .attr("transform", "translate(100, " + innerHeight + ")");

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

    g.append("g")
      .attr("id", "x-axis")
      .call(xAxis)
      .attr("transform", "translate(0, " + margin.top + ")")
      .append("text")
      .attr("x", innerWidth + 20)
      .attr("dy", "0.1em")
      .attr("text-anchor", "end")
      .attr("stroke", "black")
      .text("Year");

    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

    g.append("g")
      .attr("id", "y-axis")
      .call(yAxis)
      .attr("transform", "translate(0," + -(innerHeight - margin.top) + ")")
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 2)
      .attr("dy", "-5.1em")
      .attr("text-anchor", "end")
      .attr("stroke", "black")
      .text("Time in Minute");

    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => { return xScale(d.Year) })
      .attr("cy", (d) => { return yScale(d3.timeParse("%M:%S")(d.Time)) - (innerHeight - margin.top) })
      .attr("r", (d) => 7)
      .attr("id", "legend")
      .attr("data-xvalue", (d) => {return d.Year})
      .attr("data-yvalue", (d) => {return (d.Time)})
      .attr("class", "dot")
      .attr("fill", d => { return d.Doping !== "" ? "rgba(49, 44, 95, 0.815)" : "rgba(151, 144, 212, 0.815)" })
      .attr("stroke", "white")
      .on('mouseover', (d, i) => {
        tooltip.transition().duration(100)
          .style("opacity", 0.9)
          .style("left", (d3.event.pageX + 15) + "px")
          .style("top", (d3.event.pageY - 15) + "px");
          
        tooltip.html(d.Name + ":" + d.Nationality + "<br/>" + "Year: " +
          d.Year + ", Time: " + (d.Time) + "<br/><br/>" + d.Doping)
      });

    const tooltip = d3.select("body")
      .append("div")
      .attr("id", "tooltip");

    svg.append("text")
      .attr("id", "title")
      .attr("x", width / 2)
      .attr("y", (margin.top / 2))
      .attr("text-anchor", "middle")
      .attr("font-size", "30")
      .text("Doping in Professional Bicycle Racing");

    svg.append("text")
      .attr("id", "subtitle")
      .attr("x", width / 2)
      .attr("y", (margin.top - 30))
      .attr("text-anchor", "middle")
      .attr("font-size", "15")
      .text("35 Fastest times up Alpe d'Huez");
  }

  componentDidMount() {
    this.loadData();
  }

  render() {
    return (
      <div className="App">
        <svg width={width} height={height} padding="20px" >
        </svg>
      </div>
    );
  }
}

export default App;
