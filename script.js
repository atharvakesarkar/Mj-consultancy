
//MJ Consultancy - Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeScrollEffects();
    initializeProjectFilters();
    initializeContactForm();
    initializeCommentSystem();
    initializeAnimations();
});

// Navigation functionality
function initializeNavigation() {
    const header = document.getElementById('header');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-link-mobile');

    // Handle header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Handle navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
            
            // Close mobile menu if open
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
        }
    });
}

// Smooth scrolling function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const headerHeight = document.getElementById('header').offsetHeight;
        const elementPosition = element.offsetTop - headerHeight;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

// Scroll effects and animations
function initializeScrollEffects() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    // Create intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to elements and observe them
    const animatedElements = document.querySelectorAll('.service-card, .project-card, .stat-card, .contact-card, .appreciation-card, .comment-item');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Project filtering functionality
function initializeProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !phone || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            if (!isValidPhone(phone)) {
                showNotification('Please enter a valid phone number', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Message sent successfully! We\'ll get back to you within 24 hours.', 'success');
            
            // Reset form
            this.reset();
            
            // In a real application, you would send the data to a server here
            console.log('Form submitted:', { name, email, phone, message });
        });
    }
}

// Comment system functionality
function initializeCommentSystem() {
    const commentForm = document.getElementById('commentForm');
    const ratingStars = document.querySelectorAll('.star');
    const selectedRatingInput = document.getElementById('selectedRating');
    let selectedRating = 0;

    // Handle star rating
    ratingStars.forEach((star, index) => {
        star.addEventListener('click', function() {
            selectedRating = index + 1;
            selectedRatingInput.value = selectedRating;
            updateStarDisplay();
        });

        star.addEventListener('mouseover', function() {
            highlightStars(index + 1);
        });
    });

    // Reset stars on mouse leave
    document.getElementById('ratingInput').addEventListener('mouseleave', function() {
        updateStarDisplay();
    });

    function highlightStars(rating) {
        ratingStars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    function updateStarDisplay() {
        highlightStars(selectedRating);
    }

    // Handle comment form submission
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const rating = formData.get('rating');
            const message = formData.get('message');
            
            // Validation
            if (!name || !email || !rating || !message) {
                showNotification('Please fill in all fields including rating', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            if (rating < 1 || rating > 5) {
                showNotification('Please select a rating', 'error');
                return;
            }
            
            // Add comment to the list
            addComment(name, email, rating, message);
            
            // Reset form
            this.reset();
            selectedRating = 0;
            updateStarDisplay();
            
            showNotification('Comment posted successfully!', 'success');
        });
    }
}

// Add new comment to the comments list
function addComment(name, email, rating, message) {
    const commentsList = document.getElementById('commentsList');
    const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Create stars display
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    
    const commentHTML = `
        <div class="comment-item">
            <div class="comment-header">
                <div class="comment-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="comment-info">
                    <h4 class="comment-author">${escapeHtml(name)}</h4>
                    <div class="comment-rating">
                        <span class="stars">${stars}</span>
                        <span class="rating-value">${rating}.0</span>
                    </div>
                    <span class="comment-date">${currentDate}</span>
                </div>
                <div class="comment-actions">
                    <button class="delete-btn" onclick="deleteComment(this)" title="Delete Comment">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="comment-content">
                <p>${escapeHtml(message)}</p>
            </div>
        </div>
    `;
    
    // Add to the beginning of the comments list
    commentsList.insertAdjacentHTML('afterbegin', commentHTML);
    
    // Update comments count
    updateCommentsCount();
    updateAverageRating();
}

// Delete comment function
function deleteComment(button) {
    if (confirm('Are you sure you want to delete this comment?')) {
        const commentItem = button.closest('.comment-item');
        commentItem.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            commentItem.remove();
            updateCommentsCount();
            updateAverageRating();
            showNotification('Comment deleted successfully', 'success');
        }, 300);
    }
}

// Update comments count
function updateCommentsCount() {
    const totalComments = document.querySelectorAll('.comment-item').length;
    document.getElementById('totalComments').textContent = totalComments;
}

// Update average rating
function updateAverageRating() {
    const commentItems = document.querySelectorAll('.comment-item');
    let totalRating = 0;
    let count = 0;
    
    commentItems.forEach(item => {
        const ratingValue = item.querySelector('.rating-value').textContent;
        totalRating += parseFloat(ratingValue);
        count++;
    });
    
    if (count > 0) {
        const average = (totalRating / count).toFixed(1);
        document.getElementById('averageRating').textContent = average;
    }
}

// Load more comments function
function loadMoreComments() {
    // In a real application, this would load more comments from a database
    showNotification('No more comments to load', 'info');
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles if not already added
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                padding: 16px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: space-between;
                max-width: 400px;
                animation: slideInRight 0.3s ease;
            }
            
            .notification-success {
                border-left: 4px solid #10B981;
                color: #065F46;
            }
            
            .notification-error {
                border-left: 4px solid #EF4444;
                color: #991B1B;
            }
            
            .notification-info {
                border-left: 4px solid #3B82F6;
                color: #1E40AF;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .notification-content i {
                font-size: 1.2rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: inherit;
                opacity: 0.7;
                margin-left: 16px;
            }
            
            .notification-close:hover {
                opacity: 1;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Handle close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
}

function removeNotification(notification) {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// WhatsApp functionality
function openWhatsApp() {
    const phoneNumber = '919867970940';
    const message = encodeURIComponent("Hi! I'm interested in your consultancy services. Please provide more information about your redevelopment and rehabilitation services.");
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappURL, '_blank');
}

// Initialize animations on scroll
function initializeAnimations() {
    // Add scroll-triggered animations
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.service-card, .project-card, .stat-card, .appreciation-card, .comment-item');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
}

// Additional utility functions
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

// Smooth scroll polyfill for older browsers
if (!window.CSS || !CSS.supports('scroll-behavior', 'smooth')) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/cferdinandi/smooth-scroll@15.0.0/dist/smooth-scroll.polyfills.min.js';
    document.head.appendChild(script);
}

// Performance optimization: Lazy load images when they exist
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// Initialize lazy loading if images exist
if (document.querySelectorAll('img[data-src]').length > 0) {
    lazyLoadImages();
}

// Add resize handler for responsive adjustments
window.addEventListener('resize', debounce(() => {
    // Handle any responsive adjustments here
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    if (window.innerWidth > 768) {
        mobileMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    }
}, 250));

// Page visibility API for performance
if (typeof document.hidden !== "undefined") {
    document.addEventListener("visibilitychange", function() {
        if (document.hidden) {
            // Page is hidden, pause any animations or intensive operations
            console.log('Page hidden - pausing animations');
        } else {
            // Page is visible, resume operations
            console.log('Page visible - resuming animations');
        }
    });
}

// Console welcome message
console.log('%c🏢 MJ Consultancy Website', 'color: #002B5B; font-size: 24px; font-weight: bold;');
console.log('%cDeveloped with ❤️ for professional consulting services', 'color: #FFD700; font-size: 14px;');
console.log('%cContact: +91 9867970940 | Email: mangesh2924@gmail.com', 'color: #666; font-size: 12px;');
