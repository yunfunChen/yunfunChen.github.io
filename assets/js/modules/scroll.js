export class ScrollManager {
    constructor() {
        this.progressBar = null;
        this.backToTopBtn = null;
        this.init();
    }

    init() {
        this.progressBar = document.getElementById('scroll-progress-bar');
        this.backToTopBtn = document.getElementById('back-to-top');
        this.setupScrollListeners();
        this.setupBackToTop();
    }

    setupScrollListeners() {
        window.addEventListener('scroll', this.throttle(() => {
            this.updateProgress();
            this.toggleBackToTop();
        }, 16));
    }

    updateProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        if (this.progressBar) {
            this.progressBar.style.width = scrollPercent + '%';
        }
    }

    toggleBackToTop() {
        const scrollTop = window.pageYOffset;
        
        if (this.backToTopBtn) {
            if (scrollTop > 300) {
                this.backToTopBtn.classList.add('show');
            } else {
                this.backToTopBtn.classList.remove('show');
            }
        }
    }

    setupBackToTop() {
        if (this.backToTopBtn) {
            this.backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

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
}