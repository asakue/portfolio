/**
 * Asakue Portfolio - Main Script
 * Author: Gurzhiy Daniil
 * Version: 1.2.0
 */

"use strict";

// Utility functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Performance optimizations
// Throttle function to limit how often a function can be called
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Loading State Management
class LoadingState {
    /**
     * Shows loading state on an element
     * @param {HTMLElement} element - Element to show loading state on
     */
    static show(element) {
        element.classList.add('loading');
    }

    /**
     * Hides loading state on an element
     * @param {HTMLElement} element - Element to hide loading state from
     */
    static hide(element) {
        element.classList.remove('loading');
    }
}

// Notification System
class NotificationSystem {
    /**
     * Shows a notification message
     * @param {string} message - Message to display
     * @param {string} type - Type of notification (info, success, error)
     */
    static show(message, type = 'info') {
        const container = $('#notification-container') || this.createContainer();
        const notification = document.createElement('div');
        
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.setAttribute('role', 'alert');
        
        container.appendChild(notification);
        
        // Trigger animation
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        });

        // Auto-remove after delay
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /**
     * Creates notification container if it doesn't exist
     * @returns {HTMLElement} The notification container
     */
    static createContainer() {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'notification-container';
        container.setAttribute('aria-live', 'polite');
        document.body.appendChild(container);
        return container;
    }
}

// Modal Dialog
class Modal {
    /**
     * Creates a modal dialog
     * @param {string} modalId - ID of the modal element
     */
    constructor(modalId) {
        this.modal = $(`#${modalId}`);
        this.isOpen = false;
        if (this.modal) this.init();
    }

    init() {
        // Close on backdrop click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) this.close();
        });
    }

    open() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.isOpen = true;
    }

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.isOpen = false;
    }
}

// Navigation
class Navigation {
    constructor() {
        this.nav = $('.nav-menu');
        this.menuIcon = $('.menu-icon');
        this.menuItems = $('.menu-items');
        this.lastScroll = 0;
        
        if (this.nav && this.menuIcon && this.menuItems) {
            this.init();
        }
    }

    init() {
        this.handleScroll();
        this.handleMobileMenu();
        this.handleSmoothScroll();
        this.handleActiveLinks();
    }

    handleScroll() {
        // Use throttle to limit scroll events for better performance
        window.addEventListener('scroll', throttle(() => {
            const currentScroll = window.pageYOffset;

            // Hide/show navigation on scroll
            if (currentScroll > this.lastScroll && currentScroll > 100) {
                this.nav.style.transform = 'translateY(-100%)';
            } else {
                this.nav.style.transform = 'translateY(0)';
            }

            // Add background when scrolled
            if (currentScroll > 50) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }

            this.lastScroll = currentScroll;
        }, 100), { passive: true });
    }

    handleMobileMenu() {
        this.menuIcon.addEventListener('click', () => {
            const isExpanded = this.menuIcon.getAttribute('aria-expanded') === 'true';
            this.menuIcon.setAttribute('aria-expanded', !isExpanded);
            this.menuItems.classList.toggle('active');
            this.menuIcon.classList.toggle('active');
        });
    }

    handleSmoothScroll() {
        $$('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                
                // Skip if # only
                if (targetId === '#') return;
                
                const target = $(targetId);
                
                if (target) {
                    e.preventDefault();
                    
                    // Close mobile menu if open
                    this.menuItems.classList.remove('active');
                    this.menuIcon.classList.remove('active');
                    this.menuIcon.setAttribute('aria-expanded', 'false');

                    // Smooth scroll to target
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    handleActiveLinks() {
        const sections = $$('section[id]');
        
        if (sections.length > 0) {
            window.addEventListener('scroll', throttle(() => {
                const scrollY = window.pageYOffset;

                sections.forEach(section => {
                    const sectionHeight = section.offsetHeight;
                    const sectionTop = section.offsetTop - 100;
                    const sectionId = section.getAttribute('id');
                    const navLink = $(`.menu-link[href*="${sectionId}"]`);

                    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                        if (navLink) navLink.classList.add('active');
                    } else {
                        if (navLink) navLink.classList.remove('active');
                    }
                });
            }, 100), { passive: true });
        }
    }
}

// Scroll Animation
class RevealOnScroll {
    constructor() {
        this.elements = $$('.reveal');
        if (this.elements.length > 0) {
            this.init();
        }
    }

    init() {
        this.createObserver();
        this.handleResize = this.handleResize.bind(this);
        window.addEventListener('resize', this.handleResize, { passive: true });
    }

    createObserver() {
        const options = {
            root: null,
            threshold: 0.1,
            rootMargin: '0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);

        this.elements.forEach(element => this.observer.observe(element));
    }

    handleResize() {
        this.elements.forEach(element => {
            if (!element.classList.contains('active')) {
                this.observer.observe(element);
            }
        });
    }
}

// Contact Form
class ContactForm {
    constructor() {
        this.form = $('#contactForm');
        this.fields = {};
        if (this.form) this.init();
    }

    init() {
        this.setupFields();
        this.setupValidation();
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    setupFields() {
        this.fields = {
            name: {
                element: this.form.querySelector('[name="name"]'),
                validation: value => value.length >= 2,
                errorMessage: 'Пожалуйста, введите ваше имя (минимум 2 символа)'
            },
            email: {
                element: this.form.querySelector('[name="email"]'),
                validation: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                errorMessage: 'Пожалуйста, введите корректный email адрес'
            },
            message: {
                element: this.form.querySelector('[name="message"]'),
                validation: value => value.length >= 10,
                errorMessage: 'Пожалуйста, введите сообщение (минимум 10 символов)'
            }
        };
    }

    setupValidation() {
        Object.entries(this.fields).forEach(([name, field]) => {
            field.element.addEventListener('input', () => {
                this.validateField(name);
            });

            field.element.addEventListener('blur', () => {
                this.validateField(name);
            });
        });
    }

    validateField(fieldName) {
        const field = this.fields[fieldName];
        const value = field.element.value.trim();
        const isValid = field.validation(value);
        
        const formGroup = field.element.closest('.form-group');
        formGroup.classList.toggle('error', !isValid);
        formGroup.classList.toggle('success', isValid);

        const errorElement = formGroup.querySelector('.error-message');
        if (!isValid) {
            if (!errorElement) {
                const error = document.createElement('div');
                error.className = 'error-message';
                error.textContent = field.errorMessage;
                formGroup.appendChild(error);
            }
        } else if (errorElement) {
            errorElement.remove();
        }

        return isValid;
    }

    validateAll() {
        return Object.keys(this.fields).every(fieldName => this.validateField(fieldName));
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateAll()) {
            NotificationSystem.show('Пожалуйста, проверьте правильность заполнения формы', 'error');
            return;
        }

        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;

        try {
            LoadingState.show(this.form);
            submitButton.disabled = true;
            submitButton.textContent = 'Отправка...';

            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData.entries());

            // Simulate form submission with delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            NotificationSystem.show('Сообщение успешно отправлено!', 'success');
            this.form.reset();
            
            // Reset field states
            Object.values(this.fields).forEach(field => {
                field.element.closest('.form-group').classList.remove('success', 'error');
            });

        } catch (error) {
            console.error('Form submission error:', error);
            NotificationSystem.show('Ошибка при отправке. Попробуйте позже.', 'error');
        } finally {
            LoadingState.hide(this.form);
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    }
}

// Lazy Loading for Images
class LazyLoading {
    constructor() {
        this.images = $$('img[loading="lazy"]');
        
        if ('loading' in HTMLImageElement.prototype) {
            this.nativeLazyLoading();
        } else {
            this.fallbackLazyLoading();
        }
    }

    nativeLazyLoading() {
        this.images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
        });
    }

    fallbackLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            this.loadImage(img).then(() => {
                                img.classList.add('loaded');
                            });
                            observer.unobserve(img);
                        }
                    }
                });
            });

            this.images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            this.images.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
            });
        }
    }

    loadImage(img) {
        return new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// Animation Utilities
class AnimationUtils {
    /**
     * Animate an element with Web Animations API
     * @param {HTMLElement} element - Element to animate
     * @param {Object} keyframes - Animation keyframes
     * @param {Object} options - Animation options
     * @returns {Promise} Animation promise
     */
    static animate(element, keyframes, options) {
        return element.animate(keyframes, {
            duration: 300,
            easing: 'ease-in-out',
            fill: 'forwards',
            ...options
        }).finished;
    }

    /**
     * Fade in an element
     * @param {HTMLElement} element - Element to fade in
     * @param {number} duration - Animation duration in ms
     * @returns {Promise} Animation promise
     */
    static fadeIn(element, duration = 300) {
        return this.animate(element, [
            { opacity: 0 },
            { opacity: 1 }
        ], { duration });
    }

    /**
     * Fade out an element
     * @param {HTMLElement} element - Element to fade out
     * @param {number} duration - Animation duration in ms
     * @returns {Promise} Animation promise
     */
    static fadeOut(element, duration = 300) {
        return this.animate(element, [
            { opacity: 1 },
            { opacity: 0 }
        ], { duration });
    }
}

// Parallax Effect
class ParallaxEffect {
    constructor() {
        this.elements = $$('.parallax');
        if (this.elements.length > 0) {
            this.init();
        }
    }

    init() {
        // Bind handleScroll once and use it multiple times
        this.boundHandleScroll = this.handleScroll.bind(this);
        window.addEventListener('scroll', this.boundHandleScroll, { passive: true });
    }

    handleScroll() {
        // Use throttle to limit the frequency of parallax calculations
        throttle(() => {
            this.elements.forEach(element => {
                const scrollPosition = window.pageYOffset;
                const speed = element.dataset.speed || 0.5;
                
                if (element.querySelector('.hero-background')) {
                    element.querySelector('.hero-background').style.transform = 
                        `translateY(${scrollPosition * speed}px)`;
                }
            });
        }, 50)();
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Remove preloader when page loads
    window.addEventListener('load', () => {
        const preloader = $('.preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.remove(), 500);
        }
    });

    // Initialize components
    const components = [
        new Navigation(),
        new RevealOnScroll(),
        new ContactForm(),
        new LazyLoading(),
        new ParallaxEffect()
    ];

    // Global error handling
    window.addEventListener('error', (e) => {
        console.error('Global error:', e.error);
        NotificationSystem.show('Произошла ошибка. Пожалуйста, обновите страницу.', 'error');
    });
});
