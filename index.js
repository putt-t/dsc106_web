import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

const projects = await fetchJSON('./lib/projects.json');
const latestProjects = projects.slice(0, 3);
const projectsContainer = document.querySelector('.projects');

renderProjects(latestProjects, projectsContainer, 'h2');

const githubData = await fetchGitHubData('putt-t');
const profileStats = document.querySelector('#profile-stats');

if (profileStats) {
  profileStats.innerHTML = `
    <h2>GitHub Stats</h2>
    <div class="github-stats">
      <div class="stat">
        <span class="value">${githubData.public_repos}</span>
        <span class="label">Public Repos</span>
      </div>
      <div class="stat">
        <span class="value">${githubData.public_gists}</span>
        <span class="label">Public Gists</span>
      </div>
      <div class="stat">
        <span class="value">${githubData.followers}</span>
        <span class="label">Followers</span>
      </div>
      <div class="stat">
        <span class="value">${githubData.following}</span>
        <span class="label">Following</span>
      </div>
    </div>
  `;
}
