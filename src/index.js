import * as d3 from 'd3';
import './style.css';

const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

const width = 1350;
const height = 600;
const padding = 50;

d3.select("body")
    .append("div")
    .attr("id", "main")
    .append("p")
    .attr("id", "title")
    .text("Monthly Global Land-Surface Temperature")
    .append("br");

const chart = d3.select("#main")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const tooltip = d3.select("#main")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

d3.json(url).then(response => {
    let data = response.monthlyVariance;

    d3.select("#main")
        .append("p")
        .attr("id", "desc")
        .text(`1753 - 2015: base temperature ${response.baseTemperature}℃`);
});
