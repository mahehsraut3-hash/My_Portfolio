/**
 * ===================================================================
 * MAHESH RAUT - PORTFOLIO INTERACTIVITY SCRIPT
 * Features:
 *  - Theme Toggle (Dark / Light) with LocalStorage persistence
 *  - Dynamic Typing Animation for Hero Subtitle
 *  - Scroll Progress Indicator Bar
 *  - Navbar Scroll Spy & Active Nav Link Highlighter
 *  - Mobile Hamburger Menu Drawer
 *  - Scroll-triggered Reveal Animations (IntersectionObserver)
 *  - One-Click Clipboard Copy with Toast Feedback
 *  - Interactive Contact Form with Validation & Toast
 *  - Back-to-Top Floating Button
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Dark / Light Theme Toggle ---
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    const savedTheme = localStorage.getItem('mahesh_portfolio_theme') || 'dark';

    function applyTheme(theme) {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
        } else {
            document.documentElement.removeAttribute('data-theme');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
        }
        localStorage.setItem('mahesh_portfolio_theme', theme);
    }

    applyTheme(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(nextTheme);
    });


    // --- 2. Dynamic Typing Text Effect ---
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const words = [
            'BCA Student',
            'Full-Stack Developer',
            'Java & C/C++ Programmer',
            'Python & FastAPI Enthusiast',
            'Unity Game Developer',
            'Problem Solver'
        ];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typeSpeed = 100;
        const deleteSpeed = 50;
        const pauseTime = 1600;

        function typeLoop() {
            const currentWord = words[wordIndex];

            if (isDeleting) {
                charIndex--;
                typingElement.textContent = currentWord.substring(0, charIndex);
            } else {
                charIndex++;
                typingElement.textContent = currentWord.substring(0, charIndex);
            }

            let nextSpeed = isDeleting ? deleteSpeed : typeSpeed;

            if (!isDeleting && charIndex === currentWord.length) {
                nextSpeed = pauseTime;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                nextSpeed = 400;
            }

            setTimeout(typeLoop, nextSpeed);
        }

        typeLoop();
    }


    // --- 3. Scroll Progress Bar & Back to Top & ScrollSpy ---
    const scrollProgressBar = document.getElementById('scrollProgress');
    const backToTopBtn = document.getElementById('backToTop');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        // Update progress bar
        if (scrollProgressBar) {
            scrollProgressBar.style.width = scrollPercent + '%';
        }

        // Show/hide back to top button
        if (backToTopBtn) {
            if (scrollTop > 350) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }

        // Highlight active navigation link
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (currentSectionId && link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    // --- 4. Mobile Menu Drawer ---
    const mobileToggleBtn = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileToggleBtn && navMenu) {
        mobileToggleBtn.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            const icon = mobileToggleBtn.querySelector('i');
            if (navMenu.classList.contains('open')) {
                icon.classList.replace('fa-bars', 'fa-xmark');
            } else {
                icon.classList.replace('fa-xmark', 'fa-bars');
            }
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                const icon = mobileToggleBtn.querySelector('i');
                if (icon) {
                    icon.classList.replace('fa-xmark', 'fa-bars');
                }
            });
        });
    }


    // --- 5. Scroll Reveal Animation using IntersectionObserver ---
    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('active'));
    }


    // --- 6. Toast Notification Utility ---
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    let toastTimeout = null;

    function showToast(message) {
        if (!toast || !toastMsg) return;
        toastMsg.textContent = message;
        toast.classList.add('show');

        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }


    // --- 7. Copy Email to Clipboard ---
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const email = 'mrunalr216@gmail.com';
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email).then(() => {
                    showToast('Email copied to clipboard: ' + email);
                }).catch(() => {
                    fallbackCopy(email);
                });
            } else {
                fallbackCopy(email);
            }
        });
    }

    function fallbackCopy(text) {
        const tempInput = document.createElement('input');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast('Email copied to clipboard: ' + text);
    }


    // --- 8. Contact Form Interactive Handler ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';

            if (!name || !email || !message) {
                showToast('Please fill in all fields.');
                return;
            }

            // Create a mailto link as a direct fallback
            const subject = encodeURIComponent(`Portfolio Message from ${name}`);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            const mailtoUrl = `mailto:mrunalr216@gmail.com?subject=${subject}&body=${body}`;

            showToast('Thank you, ' + name + '! Preparing your email...');

            // Open email client
            setTimeout(() => {
                window.location.href = mailtoUrl;
                contactForm.reset();
            }, 800);
        });
    }

    // --- 9. Project Filtering ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hide');
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

});
