/* ==========================================================================
   Loading Manager Module
   ========================================================================== */

export class LoadingManager {
    constructor() {
        this.loadingScreen = null;
        this.progressBar = null;
        this.loadingText = null;
        this.isLoading = true;
        this.progress = 0;
        this.loadingSteps = [
            { progress: 20, text: 'Loading assets...' },
            { progress: 40, text: 'Initializing components...' },
            { progress: 60, text: 'Loading GitHub data...' },
            { progress: 80, text: 'Setting up animations...' },
            { progress: 100, text: 'Almost ready...' }
        ];
        this.currentStep = 0;
    }

    async start() {
        this.initElements();
        await this.simulateLoading();
        await this.hideLoadingScreen();
    }

    initElements() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.progressBar = document.getElementById('progress-bar');
        this.loadingText = document.querySelector('.loading-text-content');
    }

    async simulateLoading() {
        for (const step of this.loadingSteps) {
            await this.updateProgress(step.progress, step.text);
            await this.delay(400 + Math.random() * 200);
        }
    }

    updateProgress(progress, text) {
        return new Promise(resolve => {
            if (this.progressBar) {
                this.progressBar.style.width = `${progress}%`;
                this.progressBar.setAttribute('aria-valuenow', progress);
            }
            
            if (this.loadingText && text) {
                this.loadingText.textContent = text;
            }
            
            this.progress = progress;
            setTimeout(resolve, 100);
        });
    }

    async hideLoadingScreen() {
        return new Promise(resolve => {
            if (!this.loadingScreen) {
                resolve();
                return;
            }

            setTimeout(() => {
                this.loadingScreen.classList.add('fade-out');
                
                setTimeout(() => {
                    this.loadingScreen.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    this.isLoading = false;
                    
                    // Dispatch loading complete event
                    document.dispatchEvent(new CustomEvent('loading:complete'));
                    resolve();
                }, 500);
            }, 300);
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Public API
    isLoadingState() {
        return this.isLoading;
    }

    getProgress() {
        return this.progress;
    }
}