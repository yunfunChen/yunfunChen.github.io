/* ==========================================================================
   Language Manager Module
   ========================================================================== */

export class LanguageManager {
    constructor() {
        this.currentLanguage = 'en';
        this.storageKey = 'portfolio-language';
        this.languageToggle = null;
        this.translations = {};
        this.loadingPromise = null;
        
        this.init();
    }

    async init() {
        // This method is called by the main app for sync initialization
        // Async initialization is handled in start()
    }

    async start() {
        // Load translations
        await this.loadTranslations();
        
        // Initialize elements
        this.languageToggle = document.getElementById('language-toggle');
        
        // Load saved language or detect browser preference
        this.loadLanguage();
        
        // Set up event listeners
        this.setupEventListeners();
    }

    async loadTranslations() {
        if (this.loadingPromise) return this.loadingPromise;
        
        this.loadingPromise = this.fetchTranslations();
        return this.loadingPromise;
    }

    async fetchTranslations() {
        // Define translations inline for better performance
        this.translations = {
            en: {
                // Navigation
                'nav.home': 'Home',
                'nav.about': 'About',
                'nav.services': 'Services', 
                'nav.portfolio': 'Portfolio',
                'nav.github': 'GitHub',
                'nav.contact': 'Contact',
                
                // Hero section
                'hero.subtitle': 'Software Engineer',
                'hero.title.prefix': "Hi, I'm",
                'hero.title.name': 'Tina',
                'hero.description': 'Passionate about creating innovative solutions that bridge hardware and software, specializing in IoT development and cloud architecture.',
                'hero.btn.contact': 'Get In Touch',
                'hero.btn.work': 'View My Work',
                
                // About section
                'about.title': 'About Me',
                'about.subtitle': 'Get to know more about who I am, what I do, and my skills in software development',
                'about.text1': "I'm Tina Chen (陳韻帆), a passionate software engineer specializing in embedded systems and IoT development. With a Master's degree in Computer Science from National Taiwan Normal University, I bring hands-on experience in firmware engineering, cloud integration, and full-stack development.",
                'about.text2': "My expertise spans from low-level C/C++ programming to cloud architectures using AWS services. I'm passionate about creating innovative solutions that bridge hardware and software, turning complex technical challenges into elegant, scalable systems.",
                'about.stats.years': 'Years Experience',
                'about.stats.projects': 'Projects Completed',
                'about.stats.technologies': 'Technologies',
                'about.stats.companies': 'Companies',
                'about.skills.main': '主要技術棧',
                'about.skills.cloud': '雲端與工具',
                'about.tab.skills': 'Skills',
                'about.tab.experience': 'Experience',
                'about.tab.education': 'Education',
                
                // Skills descriptions
                'skill.cpp': 'IoT sensing systems and embedded development',
                'skill.python': 'Test automation and data processing tools',
                'skill.javascript': 'Responsive web application development',
                'skill.java': 'Enterprise forms and reporting system development',
                'skill.aws': 'IoT cloud architecture integration',
                'skill.linux': 'Embedded system management',
                'skill.git': 'Version control and team collaboration',
                'skill.database': 'Database design and management',
                
                // Experience
                'exp.firmware.title': 'Firmware Engineer',
                'exp.firmware.company': 'etenTech • 2020',
                'exp.firmware.desc': 'Developed embedded Linux systems using C/C++ and Git, performed packet analysis with Wireshark/Postman, and created automation solutions with Shell scripting.',
                'exp.intern.title': 'Software Development Intern',
                'exp.intern.company': 'DHL Air Freight IT Department • 2019',
                'exp.intern.desc': 'Developed form applications and billing reports using Java and XML technologies for logistics management systems.',
                
                // Education
                'edu.master.title': "Master's Degree in Computer Science",
                'edu.master.university': 'National Taiwan Normal University',
                'edu.master.period': '2022 - 2024',
                'edu.master.desc': 'Advanced studies in software engineering, machine learning, and distributed systems.',
                'edu.bachelor.title': "Bachelor's Degree in Computer Science",
                'edu.bachelor.university': 'Tatung University',
                'edu.bachelor.period': '2015 - 2019',
                'edu.bachelor.desc': 'Foundation in computer programming, database systems, and computer networks.',
                
                // Services section
                'services.title': 'My Services',
                'services.subtitle': 'Professional software development services across multiple domains',
                'services.embedded.title': 'Embedded Systems Development',
                'services.embedded.desc': 'Specialized in embedded Linux systems development using C/C++ for firmware design. Extensive experience in hardware-software integration for high-performance, stable embedded solutions.',
                'services.fullstack.title': 'Full Stack Web Development',
                'services.fullstack.desc': 'Complete web application development services from frontend to backend database design. Proficient in modern web technologies and frameworks for responsive, user-friendly websites.',
                'services.iot.title': 'IoT & Cloud Solutions',
                'services.iot.desc': 'Professional IoT system design and cloud service integration. Hands-on experience with AWS IoT, EC2, RDS for building complete sensor-to-cloud IoT solutions.',
                
                // Portfolio section
                'portfolio.title': 'My Work',
                'portfolio.subtitle': 'A showcase of my recent projects and technical achievements',
                'portfolio.filter.all': 'All Projects',
                'portfolio.filter.iot': 'IoT',
                'portfolio.filter.web': 'Web Dev',
                'portfolio.filter.embedded': 'Embedded',
                'portfolio.filter.cloud': 'Cloud',
                'portfolio.btn.details': 'View Details',
                'portfolio.btn.github': 'GitHub',
                'portfolio.btn.more': 'View More on GitHub',
                
                // GitHub section
                'github.title': 'GitHub Activity',
                'github.subtitle': 'My latest contributions and open source projects',
                'github.repos.title': 'Featured Repositories',
                'github.btn.view': 'View on GitHub',
                'github.stats.repos': 'Repositories',
                'github.stats.followers': 'Followers',
                'github.stats.following': 'Following',
                
                // Contact section
                'contact.title': 'Get In Touch',
                'contact.subtitle': "I'm always open to discussing new opportunities and interesting projects",
                'contact.email': 'Email',
                'contact.location': 'Location',
                'contact.form.name': 'Your Name',
                'contact.form.email': 'Your Email',
                'contact.form.message': 'Your Message',
                'contact.form.send': 'Send Message',
                'contact.form.sending': 'Sending...',
                'contact.btn.cv': 'Download CV',
                
                // Footer
                'footer.rights': '2024 Tina Chen. Made with',
                'footer.tech': 'and modern web technologies.',
                
                // Theme and language
                'theme.light': 'Switch to light mode',
                'theme.dark': 'Switch to dark mode',
                'lang.switch': 'Switch language',
                
                // Loading
                'loading.portfolio': 'Loading Portfolio...',
                'loading.assets': 'Loading assets...',
                'loading.components': 'Initializing components...',
                'loading.github': 'Loading GitHub data...',
                'loading.animations': 'Setting up animations...',
                'loading.ready': 'Almost ready...'
            },
            zh: {
                // Navigation
                'nav.home': '首頁',
                'nav.about': '關於我',
                'nav.services': '服務項目', 
                'nav.portfolio': '作品集',
                'nav.github': 'GitHub',
                'nav.contact': '聯絡方式',
                
                // Hero section
                'hero.subtitle': '軟體工程師',
                'hero.title.prefix': '嗨，我是',
                'hero.title.name': 'Tina',
                'hero.description': '熱衷於創造連結硬體與軟體的創新解決方案，專精於物聯網開發和雲端架構。',
                'hero.btn.contact': '聯絡我',
                'hero.btn.work': '查看作品',
                
                // About section
                'about.title': '關於我',
                'about.subtitle': '更深入了解我是誰、我做什麼，以及我在軟體開發方面的技能',
                'about.text1': '我是陳韻帆，一位熱衷於嵌入式系統和物聯網開發的軟體工程師。擁有國立臺灣師範大學資訊工程碩士學位，在韌體工程、雲端整合和全端開發方面具有豐富的實務經驗。',
                'about.text2': '我的專業領域涵蓋從底層 C/C++ 程式設計到使用 AWS 服務的雲端架構。我熱衷於創造連結硬體與軟體的創新解決方案，將複雜的技術挑戰轉化為優雅、可擴展的系統。',
                'about.stats.years': '年經驗',
                'about.stats.projects': '完成專案',
                'about.stats.technologies': '技術領域',
                'about.stats.companies': '服務公司',
                'about.skills.main': '主要技術棧',
                'about.skills.cloud': '雲端與工具',
                'about.tab.skills': '技能',
                'about.tab.experience': '經歷',
                'about.tab.education': '學歷',
                
                // Skills descriptions
                'skill.cpp': 'IoT感測系統與嵌入式開發',
                'skill.python': '測試自動化與數據處理工具',
                'skill.javascript': '響應式網頁應用開發',
                'skill.java': '企業表單與報告系統開發',
                'skill.aws': 'IoT雲端架構整合',
                'skill.linux': '嵌入式系統管理',
                'skill.git': '版本控制與團隊協作',
                'skill.database': '資料庫設計與管理',
                
                // Experience
                'exp.firmware.title': '韌體工程師',
                'exp.firmware.company': 'etenTech • 2020',
                'exp.firmware.desc': '使用 C/C++ 和 Git 開發嵌入式 Linux 系統，使用 Wireshark/Postman 進行封包分析，並使用 Shell 腳本創建自動化解決方案。',
                'exp.intern.title': '軟體開發實習生',
                'exp.intern.company': 'DHL 航空貨運 IT 部門 • 2019',
                'exp.intern.desc': '使用 Java 和 XML 技術為物流管理系統開發表單應用程式和計費報表。',
                
                // Education
                'edu.master.title': '資訊工程碩士',
                'edu.master.university': '國立臺灣師範大學',
                'edu.master.period': '2022 - 2024',
                'edu.master.desc': '深入研習軟體工程、機器學習和分散式系統。',
                'edu.bachelor.title': '資訊工程學士',
                'edu.bachelor.university': '大同大學',
                'edu.bachelor.period': '2015 - 2019',
                'edu.bachelor.desc': '學習程式設計、資料庫系統和計算機網路基礎。',
                
                // Services section
                'services.title': '我的服務',
                'services.subtitle': '跨多個領域的專業軟體開發服務',
                'services.embedded.title': '嵌入式系統開發',
                'services.embedded.desc': '專精於使用 C/C++ 進行嵌入式 Linux 系統開發的韌體設計。在硬體軟體整合方面具有豐富經驗，提供高效能、穩定的嵌入式解決方案。',
                'services.fullstack.title': '全端網頁開發',
                'services.fullstack.desc': '提供從前端到後端資料庫設計的完整網頁應用程式開發服務。熟練運用現代網頁技術和框架，打造響應式、使用者友善的網站。',
                'services.iot.title': '物聯網與雲端解決方案',
                'services.iot.desc': '專業的物聯網系統設計和雲端服務整合。具有 AWS IoT、EC2、RDS 實務經驗，建構完整的感測器到雲端物聯網解決方案。',
                
                // Portfolio section
                'portfolio.title': '我的作品',
                'portfolio.subtitle': '展示我最近的專案和技術成就',
                'portfolio.filter.all': '所有專案',
                'portfolio.filter.iot': '物聯網',
                'portfolio.filter.web': '網頁開發',
                'portfolio.filter.embedded': '嵌入式',
                'portfolio.filter.cloud': '雲端',
                'portfolio.btn.details': '查看詳情',
                'portfolio.btn.github': 'GitHub',
                'portfolio.btn.more': '在 GitHub 查看更多',
                
                // GitHub section
                'github.title': 'GitHub 動態',
                'github.subtitle': '我的最新貢獻和開源專案',
                'github.repos.title': '精選儲存庫',
                'github.btn.view': '在 GitHub 查看',
                'github.stats.repos': '儲存庫',
                'github.stats.followers': '追蹤者',
                'github.stats.following': '追蹤中',
                
                // Contact section
                'contact.title': '聯絡我',
                'contact.subtitle': '我隨時歡迎討論新的機會和有趣的專案',
                'contact.email': '電子郵件',
                'contact.location': '位置',
                'contact.form.name': '您的姓名',
                'contact.form.email': '您的電子郵件',
                'contact.form.message': '您的訊息',
                'contact.form.send': '發送訊息',
                'contact.form.sending': '發送中...',
                'contact.btn.cv': '下載履歷',
                
                // Footer
                'footer.rights': '2024 陳韻帆。使用',
                'footer.tech': '和現代網頁技術製作。',
                
                // Theme and language
                'theme.light': '切換至淺色模式',
                'theme.dark': '切換至深色模式',
                'lang.switch': '切換語言',
                
                // Loading
                'loading.portfolio': '載入作品集中...',
                'loading.assets': '載入資源中...',
                'loading.components': '初始化組件中...',
                'loading.github': '載入 GitHub 資料中...',
                'loading.animations': '設定動畫中...',
                'loading.ready': '即將完成...'
            }
        };
    }

    loadLanguage() {
        // Try to load from localStorage first
        const savedLang = this.getStoredLanguage();
        
        if (savedLang && this.isValidLanguage(savedLang)) {
            this.currentLanguage = savedLang;
        } else {
            // Detect browser preference
            this.currentLanguage = this.detectBrowserLanguage();
        }
        
        this.applyLanguage(this.currentLanguage);
    }

    getStoredLanguage() {
        try {
            return localStorage.getItem(this.storageKey);
        } catch {
            return null;
        }
    }

    detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage || 'en';
        return browserLang.startsWith('zh') ? 'zh' : 'en';
    }

    isValidLanguage(lang) {
        return Object.keys(this.translations).includes(lang);
    }

    applyLanguage(language) {
        if (!this.isValidLanguage(language)) {
            console.warn(`Invalid language: ${language}`);
            return;
        }

        this.currentLanguage = language;
        this.saveLanguage(language);
        this.updateContent();
        this.updateLanguageToggle();
        this.updateDocumentLanguage();
        this.dispatchLanguageChange(language);
    }

    saveLanguage(language) {
        try {
            localStorage.setItem(this.storageKey, language);
        } catch (error) {
            console.warn('Failed to save language preference:', error);
        }
    }

    updateContent() {
        const elements = document.querySelectorAll('[data-i18n]');
        const translations = this.translations[this.currentLanguage];
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translations[key];
                } else {
                    element.textContent = translations[key];
                }
            }
        });

        // Update aria-labels and titles
        const ariaElements = document.querySelectorAll('[data-i18n-aria]');
        ariaElements.forEach(element => {
            const key = element.getAttribute('data-i18n-aria');
            if (translations[key]) {
                element.setAttribute('aria-label', translations[key]);
                element.setAttribute('title', translations[key]);
            }
        });
    }

    updateLanguageToggle() {
        if (!this.languageToggle) return;
        
        const langText = this.languageToggle.querySelector('.lang-text');
        if (langText) {
            langText.textContent = this.currentLanguage === 'en' ? 'EN' : '中文';
        }
        
        // Update aria-label
        const label = this.currentLanguage === 'en' ? '切換為中文' : 'Switch to English';
        this.languageToggle.setAttribute('aria-label', label);
        this.languageToggle.setAttribute('title', label);
    }

    updateDocumentLanguage() {
        document.documentElement.lang = this.currentLanguage;
    }

    setupEventListeners() {
        if (this.languageToggle) {
            this.languageToggle.addEventListener('click', () => {
                this.toggle();
            });
        }

        // Keyboard shortcut (Ctrl/Cmd + Shift + L)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
                e.preventDefault();
                this.toggle();
            }
        });
    }

    toggle() {
        const newLanguage = this.currentLanguage === 'en' ? 'zh' : 'en';
        this.applyLanguage(newLanguage);
        
        // Add visual feedback
        this.addToggleEffect();
        
        return newLanguage;
    }

    addToggleEffect() {
        if (this.languageToggle) {
            this.languageToggle.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.languageToggle.style.transform = '';
            }, 100);
        }
    }

    dispatchLanguageChange(language) {
        const event = new CustomEvent('language:changed', {
            detail: {
                language,
                previousLanguage: language === 'en' ? 'zh' : 'en',
                translations: this.translations[language]
            }
        });
        
        document.dispatchEvent(event);
    }

    // Public API
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    setLanguage(language) {
        if (this.isValidLanguage(language)) {
            this.applyLanguage(language);
        } else {
            console.warn(`Invalid language: ${language}. Available languages:`, Object.keys(this.translations));
        }
    }

    getTranslation(key, language = this.currentLanguage) {
        return this.translations[language]?.[key] || key;
    }

    addTranslations(language, translations) {
        if (!this.translations[language]) {
            this.translations[language] = {};
        }
        
        Object.assign(this.translations[language], translations);
    }

    // For analytics/debugging
    getLanguageStats() {
        return {
            current: this.currentLanguage,
            browser: this.detectBrowserLanguage(),
            hasPreference: !!this.getStoredLanguage(),
            availableLanguages: Object.keys(this.translations)
        };
    }
}