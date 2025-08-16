export class PortfolioManager {
    constructor() {
        this.filterButtons = [];
        this.portfolioItems = [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
        this.portfolioItems = Array.from(document.querySelectorAll('.portfolio-item'));
        this.setupFilterEvents();
        this.setupTabSwitching();
    }

    setupFilterEvents() {
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                this.setActiveFilter(btn, filter);
                this.filterPortfolio(filter);
            });
        });
    }

    setActiveFilter(activeBtn, filter) {
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
        this.currentFilter = filter;
    }

    filterPortfolio(filter) {
        this.portfolioItems.forEach(item => {
            const categories = item.getAttribute('data-category')?.split(' ') || [];
            const shouldShow = filter === 'all' || categories.includes(filter);
            
            if (shouldShow) {
                item.classList.remove('filtered-out');
                item.style.display = 'block';
            } else {
                item.classList.add('filtered-out');
                setTimeout(() => {
                    if (item.classList.contains('filtered-out')) {
                        item.style.display = 'none';
                    }
                }, 300);
            }
        });
    }

    setupTabSwitching() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-tab');
                
                // Update active button
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update active content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === target + '-tab') {
                        content.classList.add('active');
                    }
                });
            });
        });
    }
}