import { fetchJSON, renderProjects } from "../global.js";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

const projects = await fetchJSON("../lib/projects.json");
const projectsContainer = document.querySelector(".projects");
const projectsTitle = document.querySelector(".projects-title");


renderProjects(projects, projectsContainer, "h2");

if (projectsTitle && projects) {
  projectsTitle.textContent = `${projects.length} Projects`;
}

let query = "";
let searchInput = document.querySelector(".searchBar");
let selectedIndex = -1;
let currentData = []; 

function getFilteredProjects() {
  let filteredProjects = [...projects];


  if (query.trim()) {
    filteredProjects = filteredProjects.filter((project) => {
      let values = Object.values(project).join("\n").toLowerCase();
      return values.includes(query.toLowerCase());
    });
  }

  if (selectedIndex !== -1 && currentData[selectedIndex]) {
    const selectedYear = currentData[selectedIndex].label;
    filteredProjects = filteredProjects.filter(
      (project) => project.year === selectedYear
    );
  }

  return filteredProjects;
}

function updateSelection() {

  d3.select("svg")
    .selectAll("path")
    .attr("class", (d, idx) => (selectedIndex === idx ? "selected" : ""));

  d3.select(".legend")
    .selectAll("li")
    .attr("class", (d, idx) =>
      selectedIndex === idx ? "legend-item selected" : "legend-item"
    );
}

function updateProjectsDisplay(updatePieChart = true) {
  const filteredProjects = getFilteredProjects();
  renderProjects(filteredProjects, projectsContainer, "h2");
  
  if (projectsTitle) {
    projectsTitle.textContent = `${filteredProjects.length} Projects`;
  }
  
  if (updatePieChart) {
    renderPieChart(query.trim() ? filteredProjects : projects);
  } else {
    updateSelection();
  }
}

function renderPieChart(projectsGiven) {
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );

  let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  currentData = newData;

  let newSliceGenerator = d3.pie().value((d) => d.value);
  let newArcData = newSliceGenerator(newData);
  let newArcs = newArcData.map((d) => d3.arc().innerRadius(0).outerRadius(50)(d));

  let colors = d3.scaleOrdinal(d3.schemeTableau10);

  let newSVG = d3.select("svg");
  newSVG.selectAll("path").remove();

  let newLegend = d3.select(".legend");
  newLegend.selectAll("*").remove();


  newArcs.forEach((arc, i) => {
    newSVG
      .append("path")
      .attr("d", arc)
      .attr("fill", colors(i))
      .attr("class", (idx) => (selectedIndex === i ? "selected" : ""))
      .on("click", () => {
        selectedIndex = selectedIndex === i ? -1 : i;
        updateProjectsDisplay(false); 
      });
  });


  newData.forEach((d, idx) => {
    newLegend
      .append("li")
      .attr("style", `--color:${colors(idx)}`)
      .attr("class", selectedIndex === idx ? "legend-item selected" : "legend-item")
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .on("click", () => {
        selectedIndex = selectedIndex === idx ? -1 : idx;
        updateProjectsDisplay(false);
      });
  });
}

renderPieChart(projects);


searchInput.addEventListener("input", (event) => {
  query = event.target.value.trim();
  updateProjectsDisplay(true);
});
