/* ==========================================================================
   Navigation Manager Module
   ========================================================================== */

export class NavigationManager {
    constructor() {
        this.nav = null;
        this.navMenu = null;
        this.navToggle = null;
        this.navClose = null;
        this.navLinks = [];
        this.isMenuOpen = false;
        this.currentSection = 'header';
        
        this.init();
    }

    init() {
        this.initElements();
        this.setupEventListeners();
        this.setupScrollSpy();
        this.setupSmoothScrolling();
    }

    initElements() {
        this.nav = document.querySelector('.nav');
        this.navMenu = document.getElementById('nav-menu');
        this.navToggle = document.getElementById('nav-toggle');
        this.navClose = document.getElementById('nav-close');
        this.navLinks = Array.from(document.querySelectorAll('.nav-link'));
    }

    setupEventListeners() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => {
                this.toggleMenu();
            });
        }

        if (this.navClose) {
            this.navClose.addEventListener('click', () => {
                this.closeMenu();
            });
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && 
                !this.navMenu?.contains(e.target) && 
                !this.navToggle?.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });

        // Close menu when clicking nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Handle scroll for sticky nav
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 100));

        // Handle resize
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
    }

    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        if (!this.navMenu) return;
        
        this.isMenuOpen = true;
        this.navMenu.classList.add('active');
        
        // Update ARIA attributes
        this.navToggle?.setAttribute('aria-expanded', 'true');
        this.navMenu?.setAttribute('aria-hidden', 'false');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Focus management
        this.trapFocus();
        
        // Animate menu items
        this.animateMenuItems();
    }

    closeMenu() {
        if (!this.navMenu || !this.isMenuOpen) return;
        
        this.isMenuOpen = false;
        this.navMenu.classList.remove('active');
        
        // Update ARIA attributes
        this.navToggle?.setAttribute('aria-expanded', 'false');
        this.navMenu?.setAttribute('aria-hidden', 'true');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Return focus to toggle button
        this.navToggle?.focus();
    }

    trapFocus() {
        const focusableElements = this.navMenu?.querySelectorAll(
            'a[href], button, [tabindex]:not([tabindex=\"-1\"])'
        );
        
        if (!focusableElements?.length) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // Focus first element
        firstElement.focus();
        
        const handleTabKey = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        };
        
        document.addEventListener('keydown', handleTabKey);
        
        // Clean up when menu closes
        const cleanup = () => {
            document.removeEventListener('keydown', handleTabKey);
            document.removeEventListener('menu:closed', cleanup);
        };
        
        document.addEventListener('menu:closed', cleanup);
    }

    animateMenuItems() {
        const menuItems = this.navMenu?.querySelectorAll('.nav-item');
        if (!menuItems) return;
        
        menuItems.forEach((item, index) => {
            item.style.transform = 'translateX(-30px)';
            item.style.opacity = '0';
            
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.transform = 'translateX(0)';
                item.style.opacity = '1';
            }, index * 50);
        });
    }

    handleScroll() {
        const scrollY = window.pageYOffset;
        
        // Update sticky nav
        if (this.nav) {
            if (scrollY > 100) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }
        }
        
        // Update active nav link
        this.updateActiveLink();
    }

    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.closeMenu();
        }
    }

    setupScrollSpy() {
        const sections = document.querySelectorAll('section[id], header[id]');
        
        if (!sections.length) return;
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.currentSection = entry.target.id;
                        this.updateActiveLink();
                    }
                });
            },
            {
                rootMargin: '-20% 0px -70% 0px',
                threshold: 0
            }
        );
        
        sections.forEach(section => observer.observe(section));
    }

    updateActiveLink() {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            
            const href = link.getAttribute('href');
            if (href === `#${this.currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href?.startsWith('#')) {
                    e.preventDefault();
                    this.scrollToSection(href.substring(1));
                }
            });
        });
    }

    scrollToSection(sectionId) {
        const target = document.getElementById(sectionId);
        if (!target) return;
        
        const navHeight = this.nav?.offsetHeight || 0;
        const targetPosition = target.offsetTop - navHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Update URL without triggering scroll
        if (history.pushState) {
            history.pushState(null, null, `#${sectionId}`);
        }
    }


    // Utility methods
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Public API
    getCurrentSection() {
        return this.currentSection;
    }

    isMenuOpenState() {
        return this.isMenuOpen;
    }

    scrollTo(sectionId) {
        this.scrollToSection(sectionId);
    }
}