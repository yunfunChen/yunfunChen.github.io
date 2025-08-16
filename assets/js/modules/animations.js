export class AnimationManager {
    constructor() {
        this.observers = new Map();
        this.typewriterTexts = {
            en: ['Chen From Taiwan', 'Software Engineer', 'IoT Developer', 'Full Stack Developer'],
            zh: ['來自台灣的陳韻帆', '軟體工程師', '物聯網開發者', '全端開發工程師']
        };
        this.currentLanguage = 'en';
        this.typewriterIndex = 0;
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupTypewriter();
        this.setupSkillCards();
        this.setupCounters();
        this.setupLanguageListener();
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
        );

        // Observe elements that should animate on scroll
        document.querySelectorAll('[data-aos]').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }

    setupTypewriter() {
        const element = document.getElementById('typewriter');
        if (!element) return;

        let currentText = 0;
        let currentChar = 0;
        let isDeleting = false;

        const type = () => {
            const texts = this.typewriterTexts[this.currentLanguage];
            const text = texts[currentText];
            
            if (isDeleting) {
                element.textContent = text.substring(0, currentChar - 1);
                currentChar--;
            } else {
                element.textContent = text.substring(0, currentChar + 1);
                currentChar++;
            }

            let speed = isDeleting ? 50 : 100;

            if (!isDeleting && currentChar === text.length) {
                speed = 1500;
                isDeleting = true;
            } else if (isDeleting && currentChar === 0) {
                isDeleting = false;
                const texts = this.typewriterTexts[this.currentLanguage];
                currentText = (currentText + 1) % texts.length;
                speed = 500;
            }

            setTimeout(type, speed);
        };

        // Start typewriter after loading completes
        document.addEventListener('loading:complete', () => {
            setTimeout(type, 1000);
        });
    }

    setupSkillCards() {
        const skillCards = document.querySelectorAll('.skill-card');
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, index * 100);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3 }
        );

        skillCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.6s ease';
            observer.observe(card);
        });
    }

    setupCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 1500;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    setupLanguageListener() {
        document.addEventListener('language:changed', (e) => {
            this.currentLanguage = e.detail.language;
            // Restart typewriter with new language
            this.restartTypewriter();
        });
    }

    restartTypewriter() {
        const element = document.getElementById('typewriter');
        if (element) {
            element.textContent = '';
            // Restart typewriter after a short delay
            setTimeout(() => {
                this.setupTypewriter();
            }, 500);
        }
    }
}