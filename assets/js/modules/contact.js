export class ContactManager {
    constructor() {
        this.form = null;
        this.messageElement = null;
        this.init();
    }

    init() {
        this.form = document.getElementById('contact-form');
        this.messageElement = document.getElementById('form-message');
        this.setupFormValidation();
    }

    setupFormValidation() {
        if (!this.form) return;

        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmit();
        });
    }

    async handleSubmit() {
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('from_name'),
            email: formData.get('from_email'),
            message: formData.get('message')
        };

        // Basic validation
        if (!this.validateForm(data)) return;

        this.setLoadingState(true);

        try {
            // Simulate form submission (replace with actual service)
            await this.simulateSubmission(data);
            this.showMessage('Thank you! Your message has been sent successfully.', 'success');
            this.form.reset();
        } catch (error) {
            console.error('Form submission error:', error);
            this.showMessage('Failed to send message. Please try again or contact directly.', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    validateForm(data) {
        if (!data.name.trim()) {
            this.showMessage('Please enter your name.', 'error');
            return false;
        }
        
        if (!data.email.trim() || !this.isValidEmail(data.email)) {
            this.showMessage('Please enter a valid email address.', 'error');
            return false;
        }
        
        if (!data.message.trim()) {
            this.showMessage('Please enter your message.', 'error');
            return false;
        }
        
        return true;
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    setLoadingState(loading) {
        const submitBtn = this.form?.querySelector('button[type="submit"]');
        const btnText = submitBtn?.querySelector('.btn-text');
        const btnLoading = submitBtn?.querySelector('.btn-loading');

        if (loading) {
            submitBtn?.classList.add('loading');
            submitBtn?.setAttribute('disabled', 'disabled');
            if (btnText) btnText.style.display = 'none';
            if (btnLoading) btnLoading.style.display = 'flex';
        } else {
            submitBtn?.classList.remove('loading');
            submitBtn?.removeAttribute('disabled');
            if (btnText) btnText.style.display = 'inline';
            if (btnLoading) btnLoading.style.display = 'none';
        }
    }

    showMessage(message, type) {
        if (!this.messageElement) return;

        this.messageElement.textContent = message;
        this.messageElement.className = `form-message ${type}`;
        this.messageElement.style.display = 'block';

        setTimeout(() => {
            this.hideMessage();
        }, 5000);
    }

    hideMessage() {
        if (this.messageElement) {
            this.messageElement.style.display = 'none';
            this.messageElement.className = 'form-message';
        }
    }

    async simulateSubmission(data) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // For demo purposes, always succeed
        // In real implementation, replace with actual email service
        console.log('Form data submitted:', data);
        return true;
    }
}