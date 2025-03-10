// Utility Functions
const select = (selector) => document.querySelector(selector);
const selectAll = (selector) => document.querySelectorAll(selector);
// Preloader
window.addEventListener('load', () => {
    const preloader = select('.preloader');
    preloader.style.opacity = '0';
    setTimeout(() => {
        preloader.style.display = 'none';
    }, 500);
});

// Navigation
const nav = select('.nav-menu');
const menuIcon = select('.menu-icon');
const menuItems = select('.menu-items');

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

menuIcon.addEventListener('click', () => {
    menuItems.classList.toggle('active');
    menuIcon.classList.toggle('active');
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            menuItems.classList.remove('active');
            menuIcon.classList.remove('active');
        }
    });
});

// Active Navigation Link
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

// Parallax Effect
const parallaxElements = selectAll('.parallax');

window.addEventListener('scroll', () => {
    parallaxElements.forEach(element => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        element.style.transform = `translate3d(0, ${rate}px, 0)`;
    });
});

// Reveal on Scroll
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
revealOnScroll();
// Skills Animation
const skillBars = selectAll('.skill-progress');

const animateSkills = () => {
    skillBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        bar.style.width = progress + '%';
    });
};

// Stats Counter Animation
const stats = selectAll('.stat-number');

const animateStats = () => {
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        let count = 0;
        const duration = 2000;
        const increment = target / (duration / 16);
        
        const updateCount = () => {
            if (count < target) {
                count += increment;
                stat.textContent = Math.round(count);
                requestAnimationFrame(updateCount);
            } else {
                stat.textContent = target;
            }
        };
        
        updateCount();
    });
};

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('skills-section')) {
                animateSkills();
            }
            if (entry.target.classList.contains('about-stats')) {
                animateStats();
            }
        }
    });
}, observerOptions);

selectAll('.skills-section, .about-stats').forEach(section => {
    observer.observe(section);
});

// Form Handling
const contactForm = select('#contactForm');

contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    try {
        submitButton.disabled = true;
        submitButton.textContent = 'Отправка...';
        
        // Здесь должна быть логика отправки формы на сервер
        await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация отправки
        
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

// Notification System
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

// Dynamic Project Cards
const projectsData = [
    {
        title: 'AI-Powered Web App',
        description: 'Современное веб-приложение с адаптивным дизайном',
        tech: 'React • Node.js • MongoDB',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
        demoLink: '#',
        githubLink: '#'
    },
    // Добавьте другие проекты здесь
];

function createProjectCard(project) {
    return `
        <article class="work-card">
            <div class="work-image">
                <img src="${project.image}" alt="${project.title}">
                <div class="work-overlay">
                    <div class="work-details">
                        <div class="work-tech">${project.tech}</div>
                        <p class="work-description">${project.description}</p>
                    </div>
                </div>
            </div>
            <div class="work-info"><h3 class="work-title">${project.title}</h3>
                <div class="work-links">
                    <a href="${project.demoLink}" class="work-link">Demo</a>
                    <a href="${project.githubLink}" class="work-link">GitHub</a>
                </div>
            </div>
        </article>
    `;
}

// Lazy Loading Images
const lazyImages = selectAll('img[loading="lazy"]');
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

// Performance Optimization
window.addEventListener('load', () => {
    // Отложенная загрузка тяжелых ресурсов
    const deferredStyles = document.querySelectorAll('link[rel="stylesheet"][media="print"]');
    deferredStyles.forEach(style => {
        style.media = 'all';
    });
});

// Error Handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // Можно добавить отправку ошибок в систему аналитики
});

// Service Worker Registration (если требуется PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registered');
            })
            .catch(error => {
                console.error('ServiceWorker registration failed:', error);
            });
    });
}