/* ==========================================================================
   GitHub Manager Module
   ========================================================================== */

export class GitHubManager {
    constructor() {
        this.username = 'yunfunChen';
        this.apiBase = 'https://api.github.com';
        this.cache = new Map();
        this.cacheExpiry = 15 * 60 * 1000; // 15 minutes
    }

    async start() {
        await this.loadGitHubData();
    }

    async loadGitHubData() {
        try {
            const [userData, reposData] = await Promise.all([
                this.fetchUserData(),
                this.fetchRepositories()
            ]);

            this.updateUI(userData, reposData);
        } catch (error) {
            console.error('GitHub data loading failed:', error);
            this.showErrorState();
        }
    }

    async fetchUserData() {
        const cacheKey = 'user-data';
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        const response = await fetch(`${this.apiBase}/users/${this.username}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        this.setCache(cacheKey, data);
        return data;
    }

    async fetchRepositories() {
        const cacheKey = 'repos-data';
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        const response = await fetch(`${this.apiBase}/users/${this.username}/repos?sort=updated&per_page=6`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        const filtered = data.filter(repo => !repo.fork);
        this.setCache(cacheKey, filtered);
        return filtered;
    }

    updateUI(userData, reposData) {
        this.updateUserInfo(userData);
        this.updateRepositories(reposData);
    }

    updateUserInfo(userData) {
        const elements = {
            name: document.getElementById('github-name'),
            bio: document.getElementById('github-bio'),
            repos: document.getElementById('repo-count'),
            followers: document.getElementById('followers-count'),
            following: document.getElementById('following-count')
        };

        if (elements.name) elements.name.textContent = userData.name || userData.login;
        if (elements.bio) elements.bio.textContent = userData.bio || 'Passionate Software Engineer';
        if (elements.repos) elements.repos.textContent = userData.public_repos;
        if (elements.followers) elements.followers.textContent = userData.followers;
        if (elements.following) elements.following.textContent = userData.following;
    }

    updateRepositories(reposData) {
        const container = document.getElementById('repos-grid');
        if (!container) return;

        container.innerHTML = '';
        reposData.forEach(repo => {
            const repoCard = this.createRepoCard(repo);
            container.appendChild(repoCard);
        });
    }

    createRepoCard(repo) {
        const card = document.createElement('div');
        card.className = 'repo-card';
        
        const updatedDate = new Date(repo.updated_at).toLocaleDateString();
        
        card.innerHTML = `
            <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
            <p class="repo-description">${repo.description || 'No description available'}</p>
            <div class="repo-stats">
                ${repo.language ? `<div class="repo-stat"><span class="repo-language"></span> ${repo.language}</div>` : ''}
                <div class="repo-stat">
                    <i class="fas fa-star"></i> ${repo.stargazers_count}
                </div>
                <div class="repo-stat">
                    <i class="fas fa-code-fork"></i> ${repo.forks_count}
                </div>
                <div class="repo-stat">Updated ${updatedDate}</div>
            </div>
        `;
        
        return card;
    }

    showErrorState() {
        const bio = document.getElementById('github-bio');
        if (bio) {
            bio.textContent = 'Error loading GitHub data';
            bio.style.color = 'var(--error)';
        }
    }

    // Cache helpers
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
            return cached.data;
        }
        return null;
    }

    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }
}