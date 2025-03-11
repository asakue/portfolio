// Утилитные функции
const select = (selector) => document.querySelector(selector);
const selectAll = (selector) => document.querySelectorAll(selector);

// Предзагрузчик
window.addEventListener('load', () => {
    const preloader = select('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// Навигация и адаптивное меню
const nav = select('.nav-menu');
const menuIcon = select('.menu-icon');
const menuItems = select('.menu-items');

// Скрытие навигации при скролле вниз
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > lastScroll && currentScroll > 100) {
        nav.style.transform = 'translateY(-100%)';
    } else {
        nav.style.transform = 'translateY(0)';
    }

    if (currentScroll > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Обработка клика по иконке меню
if (menuIcon && menuItems) {
    menuIcon.addEventListener('click', () => {
        menuItems.classList.toggle('active');
        menuIcon.classList.toggle('active');
    });
}

// Плавная прокрутка
selectAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = select(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });

            // Закрытие меню после клика (для мобильных устройств)
            if (menuItems && menuIcon) {
                menuItems.classList.remove('active');
                menuIcon.classList.remove('active');
            }
        }
    });
});

// Активная ссылка в навигации
const sections = selectAll('section[id]');

function activeNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = select(`.menu-link[href*="${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', activeNavLink);

// Появление элементов при прокрутке
const revealElements = selectAll('.reveal');

const revealOnScroll = () => {
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Инициализация при загрузке страницы

// Обработка формы
const contactForm = select('#contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;

        try {
            submitButton.disabled = true;
            submitButton.textContent = 'Отправка...';

            // Имитация отправки формы
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Успешная отправка
            showNotification('Сообщение успешно отправлено!', 'success');
            contactForm.reset();
        } catch (error) {
            showNotification('Ошибка при отправке. Попробуйте позже.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

// Система уведомлений
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Анимация появления
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    });

    // Автоматическое скрытие
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-100%)';

        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Ленивая загрузка изображений
const lazyImages = selectAll('img[loading="lazy"]');
if (lazyImages.length > 0) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

// Глобальная обработка ошибок
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});
