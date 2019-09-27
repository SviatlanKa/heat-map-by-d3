import * as d3 from 'd3';
import './style.css';

const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

const width = 1000;
const height = width * 0.6;
const margin = {
    left: width / 10,
    right: width / 40,
    top: height / 50,
    bottom: height / 20
};
const legendWidth = width / 2;
const legendHeight = height / 10;

let translateAxis = {
    x: 0,
    y: 0
};

const myColor = [
    '#a50026','#d73027','#f46d43','#fdae61','#fee090','#ffffbf',
    '#e0f3f8','#abd9e9','#74add1','#4575b4','#313695'
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
    .attr("id", "description");

const chart = d3.select("#main")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const tooltip = d3.select("#main")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

const chartPlot = chart.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

chart.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("x", -1 * margin.left)
    .attr("y", margin.right)
    .style("font-size", "1.3em")
    .text("Months");

translateAxis.x = margin.left * 2;
translateAxis.y = Math.abs(legendHeight - height);
const legend = chart.append("g")
    .attr("id", "legend")
    .attr("transform", `translate(${translateAxis.x},${translateAxis.y})`)
    .style("font-size", ".7em");

d3.json(url).then(response => {
    const data = response.monthlyVariance;
    const years = d3.set(data.map(item => item.year)).values();
    const monthsNum = d3.set(data.map(item => item.month)).values();
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const convertMonth = num => monthNames[num - 1];
    const months = monthsNum.map(item => convertMonth(item));

    const baseTemp = response.baseTemperature;
    const calcTemp = num => Math.round((baseTemp + num) * 10) / 10;

    const minVal = d3.min(data, d => d.variance);
    const maxVal = d3.max(data, d => d.variance);

    const colorScale = d3.scaleQuantize()
        .domain([minVal, maxVal])
        .range(myColor.reverse());

    const minYear = d3.min(years);
    const maxYear = d3.max(years);

    const scaleX = d3.scaleLinear()
        .domain([minYear - 1,maxYear])
        .range([0, width - margin.left - margin.right]);
    const scaleY = d3.scaleBand()
        .domain(months.reverse())
        .range([height - margin.top - margin.bottom - legendHeight, 0]);


    const xAxis = d3.axisBottom()
        .scale(scaleX);
    const yAxis = d3.axisLeft()
        .scale(scaleY);

    d3.select("#desc").text(`${minYear} - ${maxYear} (base temperature ${baseTemp}°C)`);

    translateAxis.x = height - margin.top - margin.bottom - legendHeight;
    chartPlot.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0,${translateAxis.x})`)
        .call(xAxis.ticks(20, "d"));

    chartPlot.append("g")
        .attr("id", "y-axis")
        .call(yAxis);

    chartPlot.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("data-month", d => d.month - 1)
        .attr("data-year", d => d.year)
        .attr("data-temp", d => calcTemp(d.variance) )
        .attr("x", d => scaleX(d.year))
        .attr("y", d => scaleY(convertMonth(d.month)))
        .attr("width", (width - margin.left - margin.right) / years.length)
        .attr("height", scaleY.bandwidth())
        .attr("fill", d => colorScale(d.variance))
        .on("mouseover", d => {
            tooltip.transition()
                .duration(300)
                .style("opacity", .8);
            tooltip.html(`<span>${d.year}, ${convertMonth(d.month)}<br>${calcTemp(d.variance)}°C &lpar;${d.variance}°C&rpar;</span>`)
                .style("left", d3.event.pageX + 15 + "px")
                .style("top", d3.event.pageY + "px")
                .attr("data-year", d.year);
        })
        .on("mouseout", d => {
            tooltip.transition()
                .duration(250)
                .style("opacity", 0)
        });
    const legendItems = () => {
        let valueForColor = Math.round(minVal * 10) / 10; //value for elem from myColor Array
        let itemsLegend = [];
        const step = Math.round((maxVal + Math.abs(minVal)) / myColor.length * 10) / 10 ;

        while (valueForColor <= Math.round(maxVal * 10) / 10) {
            itemsLegend.push(valueForColor);
            valueForColor = Math.round((valueForColor + step) * 10) / 10;
        }
        return itemsLegend;
    }

    const legendItemWidth = legendWidth / 11;
    legend.selectAll("rect")
        .data(myColor)
        .enter()
        .append("rect")
        .attr("x", (d, i) => legendItemWidth * i)
        .attr("y", 0)
        .attr("width", legendItemWidth)
        .attr("height", legendItemWidth / 2)
        .attr("fill", d => d)
        .attr("stroke", "#212F3C");

    legend.selectAll("text")
        .data(legendItems)
        .enter()
        .append("text")
        .attr("x", (d, i) => legendItemWidth * i)
        .attr("y", legendHeight - legendItemWidth / 1.8)
        .text(d => d);
});
