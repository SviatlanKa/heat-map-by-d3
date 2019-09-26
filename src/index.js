import * as d3 from 'd3';
import './style.css';

const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

const width = 1000;
const height = 500;
const padding = 50;
const myColor = [
    '#08306b','#08519c','#2171b5','#4292c6','#6baed6','#9ecae1','#c6dbef','#deebf7','#f7fbff',//blue part
    '#fff7ec','#fee8c8','#fdd49e','#fdbb84','#fc8d59','#ef6548','#d7301f','#b30000','#7f0000'  //red part
];

d3.select("body")
    .append("div")
    .attr("id", "main")
    .append("span")
    .attr("id", "title")
    .text("Monthly Global Land-Surface Temperature")
    .append("br");

d3.select("#main")
    .append("span")
    .attr("id", "desc");

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
    const baseTemp = response.baseTemperature;

    d3.select("#desc").text(`1753 - 2015: base temperature ${baseTemp}°C`);

    const minVal = d3.min(data, d => d.variance);
    const maxVal = d3.max(data, d => d.variance);

    const colorScale = d3.scaleQuantize()
        .domain([minVal, maxVal])
        .range(myColor);
});
