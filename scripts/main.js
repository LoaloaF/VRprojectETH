// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeSmoothScrolling();
    initializeScrollEffects();
    initializeMobileMenu();
});

// Global variable to track if we're in navigation mode
let isNavigating = false;

// Navigation functionality
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Add active class to current section
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Navbar scroll effect
    function handleNavbarScroll() {
        if (window.scrollY > 100) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }
    
    window.addEventListener('scroll', () => {
        updateActiveLink();
        handleNavbarScroll();
    });
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link, .btn[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Set navigation flag to temporarily disable parallax updates
                    isNavigating = true;
                    
                    // Temporarily disable transitions to prevent jarring (only for motivation section)
                    const motivationSection = document.querySelector('#motivation.parallax-section');
                    if (motivationSection) {
                        motivationSection.style.transition = 'none';
                        motivationSection.style.setProperty('--parallax-offset', '0px');
                    }
                    
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Re-enable parallax and transitions after scroll animation completes
                    setTimeout(() => {
                        // Re-enable transitions (only for motivation section)
                        if (motivationSection) {
                            motivationSection.style.transition = 'transform 0.2s ease-out';
                        }
                        isNavigating = false;
                    }, 1000); // Give time for scroll to complete
                }
            }
        });
    });
}

// Scroll effects and animations
function initializeScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .team-member, .about-text, .demo-description');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Simple scroll animations and parallax effects
    window.addEventListener('scroll', () => {
        // Only apply parallax when not navigating
        if (!isNavigating) {
            updateParallaxOffsets();
        }
    });
}

// Function to update parallax offsets based on current scroll position
function updateParallaxOffsets() {
    const scrolled = window.pageYOffset;
    
    // Parallax effect only for motivation section
    const motivationSection = document.querySelector('#motivation.parallax-section');
    if (motivationSection) {
        const rect = motivationSection.getBoundingClientRect();
        const sectionTop = motivationSection.offsetTop;
        const windowHeight = window.innerHeight;
        
        // Calculate parallax offset based on how much the section has been scrolled
        // Use a simpler calculation that's more predictable
        const scrollProgress = (scrolled - sectionTop + windowHeight) / windowHeight;
        
        // Only apply parallax when section is visible and user has scrolled past it
        if (scrollProgress > 0 && scrollProgress < 3) { // Apply effect in a reasonable range
            const parallaxSpeed = 0.2; // Reduced speed for smoother effect
            const yPos = -(scrollProgress * windowHeight * parallaxSpeed);
            motivationSection.style.setProperty('--parallax-offset', `${yPos}px`);
        } else if (scrollProgress <= 0) {
            // Reset when section is not reached yet
            motivationSection.style.setProperty('--parallax-offset', '0px');
        }
    }
}

// Mobile menu functionality
function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            // Toggle mobile menu
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // Toggle hamburger animation
            const bars = hamburger.querySelectorAll('.bar');
            bars.forEach((bar, index) => {
                if (hamburger.classList.contains('active')) {
                    if (index === 0) bar.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) bar.style.opacity = '0';
                    if (index === 2) bar.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    bar.style.transform = 'none';
                    bar.style.opacity = '1';
                }
            });
        });
        
        // Close mobile menu when clicking on links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                
                const bars = hamburger.querySelectorAll('.bar');
                bars.forEach(bar => {
                    bar.style.transform = 'none';
                    bar.style.opacity = '1';
                });
            });
        });
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add loading states for demo video
document.addEventListener('DOMContentLoaded', function() {
    const video = document.querySelector('.demo-video video');
    
    if (video) {
        video.addEventListener('loadstart', function() {
            this.style.opacity = '0.7';
        });
        
        video.addEventListener('canplay', function() {
            this.style.opacity = '1';
        });
        
        video.addEventListener('error', function() {
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
                width: 100%;
                height: 300px;
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 8px;
                color: #64748b;
                font-size: 1.1rem;
            `;
            placeholder.textContent = 'Demo video will be available soon';
            this.parentNode.replaceChild(placeholder, this);
        });
    }
});

// Add CSS for mobile menu
const mobileMenuCSS = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            left: -100%;
            top: 70px;
            flex-direction: column;
            background-color: white;
            width: 100%;
            text-align: center;
            transition: 0.3s;
            box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
            padding: 2rem 0;
        }
        
        .nav-menu.active {
            left: 0;
        }
        
        .nav-link {
            display: block;
            padding: 1rem;
            margin: 0;
        }
        
        .hamburger.active .bar:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active .bar:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .hamburger.active .bar:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;

// Add the mobile menu CSS to the document
const style = document.createElement('style');
style.textContent = mobileMenuCSS;
document.head.appendChild(style);
