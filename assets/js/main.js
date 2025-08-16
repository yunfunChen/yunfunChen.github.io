/* ==========================================================================
   Portfolio V2 - Main JavaScript
   Modern, Modular, High Performance
   ========================================================================== */

// Import modules
import { ThemeManager } from './modules/theme.js';
import { LanguageManager } from './modules/language.js';
import { NavigationManager } from './modules/navigation.js';
import { AnimationManager } from './modules/animations.js';
import { GitHubManager } from './modules/github.js';
import { ContactManager } from './modules/contact.js';
import { PortfolioManager } from './modules/portfolio.js';
import { LoadingManager } from './modules/loading.js';
import { ScrollManager } from './modules/scroll.js';

class PortfolioApp {
    constructor() {
        this.managers = new Map();
        this.isInitialized = false;
        this.init();
    }

    async init() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Initialize core managers
            this.initializeManagers();
            
            // Start the application
            await this.start();
            
            this.isInitialized = true;
            this.dispatchEvent('app:initialized');

        } catch (error) {
            console.error('Failed to initialize portfolio app:', error);
            this.handleInitError(error);
        }
    }

    initializeManagers() {
        // Initialize core managers that don't depend on DOM
        this.managers.set('loading', new LoadingManager());
        
        // Initialize managers that need DOM elements after loading
        this.managers.set('theme', new ThemeManager());
        this.managers.set('language', new LanguageManager());
        this.managers.set('navigation', new NavigationManager());
        this.managers.set('scroll', new ScrollManager());
        this.managers.set('animations', new AnimationManager());
        this.managers.set('portfolio', new PortfolioManager());
        this.managers.set('github', new GitHubManager());
        this.managers.set('contact', new ContactManager());
    }

    async start() {
        // Start managers that need async initialization
        const asyncManagers = ['github', 'loading', 'language'];
        
        for (const managerName of asyncManagers) {
            const manager = this.managers.get(managerName);
            if (manager && typeof manager.start === 'function') {
                try {
                    await manager.start();
                } catch (error) {
                    console.warn(`Failed to start ${managerName} manager:`, error);
                }
            }
        }

        // Initialize remaining managers
        for (const [name, manager] of this.managers) {
            if (!asyncManagers.includes(name) && typeof manager.init === 'function') {
                try {
                    manager.init();
                } catch (error) {
                    console.warn(`Failed to initialize ${name} manager:`, error);
                }
            }
        }
    }

    getManager(name) {
        return this.managers.get(name);
    }

    dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }

    handleInitError(error) {
        // Show fallback UI
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.innerHTML = `
                <div class="loading-content">
                    <div class="error-message">
                        <h3>Failed to Load Portfolio</h3>
                        <p>Please refresh the page to try again.</p>
                        <button onclick="window.location.reload()" class="btn btn-primary">
                            Refresh Page
                        </button>
                    </div>
                </div>
            `;
        }
    }

    // Public API for debugging
    debug() {
        return {
            isInitialized: this.isInitialized,
            managers: Array.from(this.managers.keys()),
            version: '2.0.0'
        };
    }
}

// Utility functions
export const utils = {
    // Debounce function
    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Element query helpers
    $(selector, context = document) {
        return context.querySelector(selector);
    },

    $$(selector, context = document) {
        return Array.from(context.querySelectorAll(selector));
    },

    // Animation helpers
    animate(element, keyframes, options = {}) {
        return element.animate(keyframes, {
            duration: 300,
            easing: 'ease-out',
            fill: 'both',
            ...options
        });
    },

    // Event delegation
    delegate(parent, selector, event, handler) {
        parent.addEventListener(event, (e) => {
            if (e.target.matches(selector) || e.target.closest(selector)) {
                handler(e);
            }
        });
    },

    // Intersection Observer helper
    createObserver(callback, options = {}) {
        const defaultOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        return new IntersectionObserver(callback, { ...defaultOptions, ...options });
    },

    // Local storage helpers
    storage: {
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch {
                return defaultValue;
            }
        },
        
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch {
                return false;
            }
        },
        
        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch {
                return false;
            }
        }
    },

    // Performance helpers
    measurePerformance(name, fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        console.log(`${name} took ${end - start} milliseconds`);
        return result;
    },

    // Lazy loading helper
    lazyLoad(selector, callback) {
        const observer = this.createObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    callback(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        this.$$(selector).forEach(el => observer.observe(el));
        return observer;
    }
};

// Initialize app when script loads
const app = new PortfolioApp();

// Make app globally available for debugging
window.portfolioApp = app;
window.utils = utils;

// Add global test function for theme switching
window.testTheme = function() {
    const themeManager = app.getManager('theme');
    if (themeManager) {
        return themeManager.testTheme();
    } else {
        console.error('Theme manager not found');
    }
};

// Force theme manager re-initialization
window.forceThemeInit = function() {
    const themeManager = app.getManager('theme');
    if (themeManager) {
        themeManager.initialized = false;
        themeManager.initializeElements();
    }
};

// Export for module usage
export default app;