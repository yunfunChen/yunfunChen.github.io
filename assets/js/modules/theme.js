/* ==========================================================================
   Theme Manager Module
   ========================================================================== */

export class ThemeManager {
    constructor() {
        this.themes = ['light', 'dark'];
        this.currentTheme = 'light';
        this.storageKey = 'portfolio-theme';
        this.toggleButton = null;
        this.initialized = false;
        
        this.init();
    }

    init() {
        // Wait for DOM to be ready if needed
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeElements();
            });
        } else {
            this.initializeElements();
        }
    }

    initializeElements() {
        if (this.initialized) return;
        
        // Delay initialization to ensure DOM is ready
        setTimeout(() => {
            this.toggleButton = document.getElementById('theme-toggle');
            
            if (this.toggleButton) {
                this.initialized = true;
                
                // Load saved theme or detect system preference
                this.loadTheme();
                
                // Set up event listeners
                this.setupEventListeners();
                
                // Listen for system theme changes
                this.watchSystemTheme();
                
                // Ensure initial button state is correct
                this.updateToggleButton();
            } else {
                // Retry after a longer delay if button not found
                setTimeout(() => this.initializeElements(), 1000);
            }
        }, 500);
    }

    loadTheme() {
        // Try to load from localStorage first
        const savedTheme = this.getStoredTheme();
        
        if (savedTheme && this.themes.includes(savedTheme)) {
            this.currentTheme = savedTheme;
        } else {
            // Detect system preference
            this.currentTheme = this.getSystemTheme();
        }
        
        this.applyTheme(this.currentTheme);
    }

    getStoredTheme() {
        try {
            return localStorage.getItem(this.storageKey);
        } catch {
            return null;
        }
    }

    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    applyTheme(theme) {
        const html = document.documentElement;
        
        // Update data attribute
        html.setAttribute('data-theme', theme);
        
        // Update current theme
        this.currentTheme = theme;
        
        // Save to localStorage
        this.saveTheme(theme);
        
        // Update toggle button state
        this.updateToggleButton();
        
        // Dispatch theme change event
        this.dispatchThemeChange(theme);
        
        // Update meta theme-color
        this.updateMetaThemeColor(theme);
    }

    saveTheme(theme) {
        try {
            localStorage.setItem(this.storageKey, theme);
        } catch (error) {
            console.warn('Failed to save theme preference:', error);
        }
    }

    updateToggleButton() {
        if (!this.toggleButton) return;
        
        const isDark = this.currentTheme === 'dark';
        const darkIcon = this.toggleButton.querySelector('.dark-icon');
        const lightIcon = this.toggleButton.querySelector('.light-icon');
        
        // Update icon visibility - remove inline styles to use CSS
        if (darkIcon && lightIcon) {
            // Remove inline styles to let CSS handle the transition
            darkIcon.style.opacity = '';
            darkIcon.style.transform = '';
            lightIcon.style.opacity = '';
            lightIcon.style.transform = '';
        }
        
        // Update aria label
        this.toggleButton.setAttribute('aria-label', 
            isDark ? 'Switch to light theme' : 'Switch to dark theme'
        );
        
        // Update button title
        this.toggleButton.title = isDark ? '切換至淺色模式' : '切換至深色模式';
    }

    updateMetaThemeColor(theme) {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            const color = theme === 'dark' ? '#0f172a' : '#0066cc';
            metaThemeColor.setAttribute('content', color);
        }
    }

    toggle() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        
        // Add smooth transition effect
        this.addTransitionEffect();
        
        return newTheme;
    }

    addTransitionEffect() {
        const body = document.body;
        body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
    }

    setupEventListeners() {
        // Theme toggle button
        if (this.toggleButton) {
            this.toggleButton.addEventListener('click', () => {
                this.toggle();
            });
        }

        // Keyboard shortcut (Ctrl/Cmd + Shift + T)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggle();
            }
        });
    }

    watchSystemTheme() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            mediaQuery.addEventListener('change', (e) => {
                // Only auto-switch if user hasn't manually set a preference
                const hasStoredTheme = this.getStoredTheme();
                if (!hasStoredTheme) {
                    const systemTheme = e.matches ? 'dark' : 'light';
                    this.applyTheme(systemTheme);
                }
            });
        }
    }

    dispatchThemeChange(theme) {
        const event = new CustomEvent('theme:changed', {
            detail: {
                theme,
                previousTheme: this.currentTheme === 'light' ? 'dark' : 'light'
            }
        });
        
        document.dispatchEvent(event);
    }

    // Public API
    getCurrentTheme() {
        return this.currentTheme;
    }

    setTheme(theme) {
        if (this.themes.includes(theme)) {
            this.applyTheme(theme);
        } else {
            console.warn(`Invalid theme: ${theme}. Available themes:`, this.themes);
        }
    }

    isDark() {
        return this.currentTheme === 'dark';
    }

    isLight() {
        return this.currentTheme === 'light';
    }

    // For future extensibility
    addTheme(name, config) {
        if (!this.themes.includes(name)) {
            this.themes.push(name);
            // Here you could add logic to register CSS custom properties
            console.log(`Theme "${name}" registered`);
        }
    }

    // Analytics/tracking helper
    trackThemeUsage() {
        // This could be used to track theme preferences for analytics
        return {
            current: this.currentTheme,
            system: this.getSystemTheme(),
            hasPreference: !!this.getStoredTheme()
        };
    }

    // Test method for debugging
    testTheme() {
        console.log('Testing theme toggle...');
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        console.log(`Switching from ${currentTheme} to ${newTheme}`);
        html.setAttribute('data-theme', newTheme);
        
        // Update button state
        const button = document.getElementById('theme-toggle');
        if (button) {
            console.log('Theme button found, updating state');
            this.currentTheme = newTheme;
            this.updateToggleButton();
        }
        
        return newTheme;
    }
}