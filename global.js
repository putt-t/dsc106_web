
const $$ = (...args) => Array.from(document.querySelectorAll(...args));

const navLinks = $$("nav a");

const currentLink = navLinks.find(
  (a) => a.host === location.host && a.pathname === location.pathname
);

let pages = [
  { url: "", title: "Home" },
  { url: "projects/", title: "Projects" },
  { url: "contact/", title: "Contact" },
  { url: "resume/", title: "CV/Resume" },
  { url: "meta/", title: "Meta" },
  { url: "https://github.com/putt-t", title: "GitHub", external: true }
];

const ARE_WE_HOME = document.documentElement.classList.contains("home");

const nav = document.querySelector("nav");

const ul = document.createElement("ul");
nav.append(ul);

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  if (!ARE_WE_HOME && !url.startsWith("http")) {
    url = "../" + url;
  }

  const li = document.createElement("li");
  const a = document.createElement("a");
  

  a.href = url;
  a.textContent = title;
  
  if (p.external) {
    a.target = "_blank";
  }

  a.classList.toggle(
    "current",
    a.host === location.host && a.pathname === location.pathname
  );

  li.append(a);
  ul.append(li);
}


document.body.insertAdjacentHTML(
  "afterbegin",
  `
  <label class="color-scheme">
    Theme:
    <select>
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
  `
);



const select = document.querySelector(".color-scheme select");


select.addEventListener("input", function (event) {
  console.log("color scheme changed to", event.target.value);
  document.documentElement.style.setProperty("color-scheme", event.target.value);
});

const savedScheme = localStorage.getItem("colorScheme");
if (savedScheme) {
  select.value = savedScheme;
  document.documentElement.style.setProperty("color-scheme", savedScheme);
}


select.addEventListener("change", (e) => {
  localStorage.setItem("colorScheme", e.target.value);
});

export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);
    
    // Verify if the request is successful
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    
    console.log(response);
    
    // Parse the response data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  // Clear existing content of the container element
  containerElement.innerHTML = '';

  // Check if projects is a valid non-empty array
  if (!Array.isArray(projects) || projects.length === 0) {
    containerElement.innerHTML = '<p>No projects available.</p>';
    return;
  }

  // Iterate over each project in the array
  projects.forEach(project => {
    const article = document.createElement('article');
    article.innerHTML = `
      <${headingLevel}>${project.title} (${project.year})</${headingLevel}>
      <img src="${project.image}" alt="${project.title}">
      <p>${project.description}</p>
    `;
    containerElement.appendChild(article);
  });
}

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}

