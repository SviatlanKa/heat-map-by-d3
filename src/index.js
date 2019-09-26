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
    const data = response.monthlyVariance;
    const years = d3.set(data.map(item => item.year)).values();
    const months = d3.set(data.map(item => item.month)).values();

    const baseTemp = response.baseTemperature;

    d3.select("#desc").text(`1753 - 2015: base temperature ${baseTemp}°C`);

    const minVal = d3.min(data, d => d.variance);
    const maxVal = d3.max(data, d => d.variance);

    const colorScale = d3.scaleQuantize()
        .domain([minVal, 7])
        .range(myColor);

    const scaleX = d3.scaleLinear()
        .domain([d3.min(years),d3.max(years)])
        .range([0, 850]);
    const scaleY = d3.scaleBand()
        .domain(months)
        .range([height - padding, 0]);

    const xAxis = d3.axisBottom()
        .scale(scaleX);
    const yAxis = d3.axisLeft()
        .scale(scaleY);

    chart.append("g")
        .attr("id", "x-axis")
        .attr("transform", "translate(100,450)")
        .call(xAxis.ticks(20, "d"));

    chart.append("g")
        .attr("id", "y-axis")
        .attr("transform", "translate(100)")
        .call(yAxis);

console.log(months)


    chart.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("x", d => scaleX(d.year))
        .attr("y", d => scaleY(d.month))
        .attr("width", (width - padding) / data.length)
        .attr("height", (height - padding) /12)
        .attr("fill", colorScale(d => d.variance))
});
