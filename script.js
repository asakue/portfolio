// Утилиты и константы
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Состояния загрузки
class LoadingState {
    static show(element) {
        element.classList.add('loading');
    }

    static hide(element) {
        element.classList.remove('loading');
    }
}

// Система уведомлений
class NotificationSystem {
    static show(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.setAttribute('role', 'alert');
        
        document.body.appendChild(notification);
        
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        });

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Модальные окна
class Modal {
    constructor(modalId) {
        this.modal = $(`#${modalId}`);
        this.isOpen = false;
        this.init();
    }

    init() {
        if (!this.modal) return;
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });

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

// Навигация
class Navigation {
    constructor() {
        this.nav = $('.nav-menu');
        this.menuIcon = $('.menu-icon');
        this.menuItems = $('.menu-items');
        this.lastScroll = 0;
        
        this.init();
    }

    init() {
        this.handleScroll();
        this.handleMobileMenu();
        this.handleSmoothScroll();
        this.handleActiveLinks();
    }

    handleScroll() {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > this.lastScroll && currentScroll > 100) {
                this.nav.style.transform = 'translateY(-100%)';
            } else {
                this.nav.style.transform = 'translateY(0)';
            }

            if (currentScroll > 50) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }

            this.lastScroll = currentScroll;
        }, { passive: true });
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
                e.preventDefault();
                const target = $(anchor.getAttribute('href'));
                if (target) {
                    this.menuItems.classList.remove('active');
                    this.menuIcon.classList.remove('active');
                    this.menuIcon.setAttribute('aria-expanded', 'false');

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
        
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;

            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 100;
                const sectionId = section.getAttribute('id');
                const navLink = $(`.menu-link[href*="${sectionId}"]`);

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink?.classList.add('active');
                } else {
                    navLink?.classList.remove('active');
                }
            });
        }, { passive: true });
    }
}

// Анимация появления элементов
class RevealOnScroll {
    constructor() {
        this.elements = $$('.reveal');
        this.init();
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
// Форма обратной связи
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
                validation: value => value.length >= 2
            },
            email: {
                element: this.form.querySelector('[name="email"]'),
                validation: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            },
            message: {
                element: this.form.querySelector('[name="message"]'),
                validation: value => value.length >= 10
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
                error.textContent = `Пожалуйста, введите корректное значение для поля ${fieldName}`;
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

            // Имитация отправки формы
            await new Promise(resolve => setTimeout(resolve, 1000));

            NotificationSystem.show('Сообщение успешно отправлено!', 'success');
            this.form.reset();
            
            // Сброс состояний полей
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

// Ленивая загрузка изображений
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

// Утилиты для работы с анимациями
class AnimationUtils {
    static animate(element, keyframes, options) {
        return element.animate(keyframes, {
            duration: 300,
            easing: 'ease-in-out',
            fill: 'forwards',
            ...options
        }).finished;
    }

    static fadeIn(element, duration = 300) {
        return this.animate(element, [
            { opacity: 0 },
            { opacity: 1 }
        ], { duration });
    }

    static fadeOut(element, duration = 300) {
        return this.animate(element, [
            { opacity: 1 },
            { opacity: 0 }
        ], { duration });
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    // Удаление прелоадера
    window.addEventListener('load', () => {
        const preloader = $('.preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.remove(), 500);
        }
    });

    // Инициализация компонентов
    new Navigation();
    new RevealOnScroll();
    new ContactForm();
    new LazyLoading();

    // Обработка ошибок
    window.addEventListener('error', (e) => {
        console.error('Global error:', e.error);
        NotificationSystem.show('Произошла ошибка. Попробуйте обновить страницу.', 'error');
    });

    // Предотвращение отправки форм по Enter
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    });
});

// Оптимизация производительности
window.requestIdleCallback = window.requestIdleCallback || function(cb) {
    return setTimeout(() => {
        const start = Date.now();
        cb({
            didTimeout: false,
            timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
        });
    }, 1);
};
class RevealButtons {
    constructor() {
        this.workCards = $$('.work-card');
        this.init();
    }

    init() {
        this.createObserver();
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

        this.workCards.forEach(card => this.observer.observe(card));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RevealButtons();
});

