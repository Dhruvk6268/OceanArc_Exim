// Mobile dropdown functionality
const dropdowns = document.querySelectorAll('.dropdown');
dropdowns.forEach(dropdown => {
  const toggle = dropdown.querySelector('a');
  
  if (toggle) {
    toggle.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdown.classList.toggle('active');
        
        // Close other open dropdowns
        dropdowns.forEach(otherDropdown => {
          if (otherDropdown !== dropdown) {
            otherDropdown.classList.remove('active');
          }
        });
      }
    });
  }
});

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
  if (window.innerWidth <= 768) {
    if (!e.target.closest('.dropdown')) {
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    }
  }
});
  // After load, drop the flag so nothing else is affected
  window.addEventListener('load', function () {
    setTimeout(function () {
      document.documentElement.classList.remove('page-anim');
    }, 850); // slightly longer than 0.8s animation
  });

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const mainNav = document.getElementById('mainNav');
    
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.querySelector('i').classList.toggle('fa-bars');
            this.querySelector('i').classList.toggle('fa-bars');
        });
    }

    // Hero Slider Functionality
    const slider = document.getElementById('slider');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const sliderDots = document.getElementById('sliderDots');
    let slideIndex = 0;
    let slides = [];
    let dots = [];
    let slideInterval;
    
    if (slider) {
        slides = document.querySelectorAll('.slide');
        
        // Create dots
        if (sliderDots && slides.length > 0) {
            for (let i = 0; i < slides.length; i++) {
                const dot = document.createElement('div');
                dot.classList.add('slider-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                sliderDots.appendChild(dot);
                dots.push(dot);
            }
        }
        
        // Set up event listeners
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        
        // Auto-rotate slides (every 5 seconds)
        startSlider();
        
        // Pause on hover
        slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
        slider.addEventListener('mouseleave', startSlider);
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mainNav && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    navToggle.querySelector('i').classList.add('fa-bars');
                    navToggle.querySelector('i').classList.remove('fa-bars');
                }
            }
        });
    });


    // Load blog posts on homepage
    const blogPostsContainer = document.getElementById('blogPosts');
    if (blogPostsContainer && (window.location.pathname === '/' || window.location.pathname === '/index.html')) {
        fetchBlogPosts();
    }

    // Load products on homepage
    const productsContainer = document.getElementById('productsContainer');
    if (productsContainer && (window.location.pathname === '/' || window.location.pathname === '/index.html')) {
        loadHomepageProducts();
    }

    /* ====================
       HELPER FUNCTIONS
       ==================== */

    function startSlider() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    }

    function showSlide(index) {
        if (!slider || slides.length === 0) return;
        
        if (index >= slides.length) slideIndex = 0;
        if (index < 0) slideIndex = slides.length - 1;
        
        slider.style.transform = `translateX(-${slideIndex * 100}%)`;
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === slideIndex);
        });
    }

    function nextSlide() {
        slideIndex++;
        showSlide(slideIndex);
    }

    function prevSlide() {
        slideIndex--;
        showSlide(slideIndex);
    }

    function goToSlide(index) {
        slideIndex = index;
        showSlide(slideIndex);
    }

    // Update the submitInquiryForm function
function submitInquiryForm(form) {
    const formData = new FormData(form);
    const formMessage = document.getElementById('formMessage');
    const submitBtn = form.querySelector('.submit-btn');
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    formMessage.style.display = 'none';

    fetch('php/process-contact.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            formMessage.textContent = data.message;
            formMessage.className = 'form-message success';
            form.reset();
        } else {
            throw new Error(data.message || 'Error submitting form');
        }
    })
    .catch(error => {
        formMessage.textContent = error.message || 'An error occurred. Please try again.';
        formMessage.className = 'form-message error';
    })
    .finally(() => {
        formMessage.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Inquiry';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    });
}

    function fetchBlogPosts() {
        fetch('php/get-blog-posts.php')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(posts => {
                if (posts.length > 0) {
                    renderBlogPosts(posts.slice(0, 3));
                } else {
                    blogPostsContainer.innerHTML = '<p class="no-content">No blog posts available yet.</p>';
                }
            })
            .catch(error => {
                console.error('Error loading blog posts:', error);
                blogPostsContainer.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Failed to load blog posts. Please try again later.</p>
                    </div>
                `;
            });
    }

  function renderBlogPosts(posts) {
    blogPostsContainer.innerHTML = '';
    
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'blog-post';
        
        // Use slug if available, otherwise fall back to ID
        const postUrl = post.slug ? 
            `blog-single.html?${encodeURIComponent(post.slug)}` : 
            `blog-single.html?id=${post.id}`;
        
        postElement.innerHTML = `
<a href="${postUrl}" class="learn">
   <img src="${post.image || 'images/blog-placeholder.jpg'}" alt="OceanArc Exim" loading="lazy">
    <div class="blog-content">
        <h3>${post.title}</h3>
        <p>${post.excerpt || post.content.substring(0, 150)}...</p>
        <a href="${postUrl}" class="learn-more">Read more <i class="fas fa-arrow-right"></i></a>
    </div>
</a>
        `;
        blogPostsContainer.appendChild(postElement);
    });
}

    function loadHomepageProducts() {
    fetch('php/get-products.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(products => {
            if (Array.isArray(products) && products.length > 0) {
                // Limit to first 4 products only
                const limitedProducts = products.slice(0, 4);
                renderProducts(limitedProducts, productsContainer);
            } else {
                productsContainer.innerHTML = '<p class="no-content">No products available yet.</p>';
            }
        })
        .catch(error => {
            console.error('Error loading products:', error);
            productsContainer.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Failed to load products. Please try again later.</p>
                </div>
            `;
        });
}


function renderProducts(products, container) {
    container.innerHTML = '';
    
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        
        // Use slug if available, otherwise fall back to ID
        const productUrl = product.slug ? 
            `agro-single.html?${encodeURIComponent(product.slug)}` : 
            `agro-single.html?id=${product.id}`;
        
        const hasVideo = product.video && product.video.trim() !== '';
        const mediaContent = hasVideo ? 
          `<video class="product-media" autoplay muted loop playsinline style="width:100%; height:300px; object-fit:cover;">
             <source src="${product.video}" type="video/mp4">
             Your browser does not support the video tag.
           </video>` :
          `<div class="product-image" style="height:300px; background-image: url('${product.image || 'images/product-placeholder.jpg'}')"></div>`;
        
        productElement.innerHTML = `
            <a href="${productUrl}" class="learn">
                ${mediaContent}
                <div class="product-content">
                    <p>${product.title}</p>
                    <p>${product.description || product.content.substring(0, 100)}...</p>
                    <div class="learn-more">View Details <i class="fas fa-arrow-right"></i></div>
                </div>
            </a>
        `;
        container.appendChild(productElement);
    });
}
});

// Fix for horizontal overflow
function fixHorizontalOverflow() {
    if (window.innerWidth < 768) {
        document.body.style.overflowX = 'hidden';
        document.documentElement.style.overflowX = 'hidden';
    }
}

// Run on load and resize
window.addEventListener('load', fixHorizontalOverflow);
window.addEventListener('resize', fixHorizontalOverflow);

// Also check for any elements causing overflow
function checkForOverflow() {
    const bodyWidth = document.body.scrollWidth;
    const viewportWidth = window.innerWidth;
    
    if (bodyWidth > viewportWidth) {
        console.log('Horizontal overflow detected:', bodyWidth - viewportWidth, 'px');
        // You can add specific fixes here if needed
    }
}

window.addEventListener('load', checkForOverflow);
