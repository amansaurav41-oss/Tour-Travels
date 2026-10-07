/**
 * Aman Travels - Interactive Web Application Logic
 * Implements smooth UI transitions, state validations, carousels, and forms.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Sticky Header scroll state
       ========================================================================== */
    const header = document.getElementById('mainHeader');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       2. Mobile Responsive Menu
       ========================================================================== */
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const hamburger = mobileToggle.querySelector('.hamburger');

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        if (navMenu.classList.contains('open')) {
            hamburger.className = 'fa-solid fa-xmark hamburger';
        } else {
            hamburger.className = 'fa-solid fa-bars-staggered hamburger';
        }
    });

    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            hamburger.className = 'fa-solid fa-bars-staggered hamburger';
        });
    });

    // Handle mobile dropdown toggle
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav-link');
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('open');
            }
        });
    });

    /* ==========================================================================
       3. Hero Slideshow Carousel
       ========================================================================== */
    const slides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    if (slides.length > 0) {
        setInterval(nextSlide, slideInterval);
    }

    /* ==========================================================================
       4. Search Widget Form Toggle
       ========================================================================== */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const widgetForms = document.querySelectorAll('.widget-form');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Toggle active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Toggle active form
            widgetForms.forEach(form => {
                if (form.id === `form${targetTab.charAt(0).toUpperCase() + targetTab.slice(1)}`) {
                    form.classList.add('active');
                } else {
                    form.classList.remove('active');
                }
            });
        });
    });

    // Handle Search Form Submissions
    widgetForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let searchDetails = '';
            
            if (form.id === 'formHolidays') {
                const dest = document.getElementById('holidayDest').value;
                const month = document.getElementById('holidayMonth').options[document.getElementById('holidayMonth').selectedIndex].text;
                searchDetails = `Holiday Packages for "${dest}" in ${month}`;
            } else if (form.id === 'formFlights') {
                const from = document.getElementById('flightFrom').value;
                const to = document.getElementById('flightTo').value;
                const date = document.getElementById('flightDate').value;
                searchDetails = `Flights from ${from.toUpperCase()} to ${to.toUpperCase()} on ${date}`;
            } else if (form.id === 'formHotels') {
                const loc = document.getElementById('hotelLocation').value;
                const checkin = document.getElementById('hotelCheckIn').value;
                searchDetails = `Hotel search in "${loc}" checking in ${checkin}`;
            }

            showToast(`Searching: ${searchDetails}...`, 'info');
            setTimeout(() => {
                showToast('Search query simulated. Our agents are pulling the best rates!', 'success');
            }, 1200);
        });
    });

    /* ==========================================================================
       5. Holiday Package Grid Filtering
       ========================================================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const packageCards = document.querySelectorAll('.package-card');

    window.filterPackages = function(category) {
        // Find corresponding button and activate it
        filterBtns.forEach(btn => {
            if (btn.getAttribute('data-filter') === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Filter cards
        packageCards.forEach(card => {
            const cardCat = card.getAttribute('data-category');
            if (category === 'all' || cardCat === category) {
                card.classList.remove('hidden');
                // Trigger quick visual fade-in animation
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.opacity = '1';
                }, 50);
            } else {
                card.classList.add('hidden');
            }
        });
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterVal = btn.getAttribute('data-filter');
            filterPackages(filterVal);
        });
    });

    /* ==========================================================================
       6. Interactive Multi-Step Trip Planner (Wizard)
       ========================================================================== */
    let currentStep = 1;
    const totalSteps = 4;
    const progressLine = document.getElementById('progressLine');
    const stepDots = document.querySelectorAll('.step-dot');
    const formSteps = document.querySelectorAll('.form-step');
    const btnPlanPrev = document.getElementById('btnPlanPrev');
    const btnPlanNext = document.getElementById('btnPlanNext');
    const tripPlannerForm = document.getElementById('tripPlannerForm');

    function updateWizard() {
        // Update progress line width
        const pct = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressLine.style.width = `${pct}%`;

        // Update step dots
        stepDots.forEach(dot => {
            const stepVal = parseInt(dot.getAttribute('data-step'));
            if (stepVal <= currentStep) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        // Update step form display
        formSteps.forEach(step => {
            const stepVal = parseInt(step.getAttribute('data-step'));
            if (stepVal === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Update button states
        if (currentStep === 1) {
            btnPlanPrev.classList.add('disabled');
            btnPlanPrev.disabled = true;
        } else {
            btnPlanPrev.classList.remove('disabled');
            btnPlanPrev.disabled = false;
        }

        if (currentStep === totalSteps) {
            btnPlanNext.innerHTML = 'Submit Planner <i class="fa-solid fa-paper-plane"></i>';
        } else {
            btnPlanNext.innerHTML = 'Next <i class="fa-solid fa-angle-right"></i>';
        }
    }

    // Input Validation per Step
    function validateStep(step) {
        const stepContainer = document.querySelector(`.form-step[data-step="${step}"]`);
        const requiredInputs = stepContainer.querySelectorAll('[required]');
        
        let valid = true;
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                valid = false;
                input.style.borderColor = 'var(--accent-coral)';
                // Reset border color on input
                input.addEventListener('input', () => {
                    input.style.borderColor = 'var(--border-glass)';
                }, { once: true });
            }
        });
        
        if (!valid) {
            showToast('Please fill out all required fields before proceeding.', 'error');
        }
        return valid;
    }

    btnPlanNext.addEventListener('click', () => {
        if (!validateStep(currentStep)) return;

        if (currentStep < totalSteps) {
            currentStep++;
            updateWizard();
        } else {
            // Final submission
            const scope = document.querySelector('input[name="scope"]:checked').value;
            const dest = document.getElementById('planDest').value;
            const name = document.getElementById('planName').value;
            const email = document.getElementById('planEmail').value;
            const phone = document.getElementById('planPhone').value;

            // Simulate form submission
            showToast('Submitting your trip blueprint...', 'info');
            
            setTimeout(() => {
                showToast(`Success! Thank you ${name}. Our destination experts will contact you at ${phone} or ${email} regarding your trip to ${dest}.`, 'success');
                // Reset form
                tripPlannerForm.reset();
                currentStep = 1;
                updateWizard();
            }, 1500);
        }
    });

    btnPlanPrev.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateWizard();
        }
    });

    /* ==========================================================================
       7. Testimonial Drag/Auto Carousel
       ========================================================================== */
    const testimonialTrack = document.getElementById('testimonialTrack');
    const testimonialCards = document.querySelectorAll('.testimonial-slide-card');
    const sliderDots = document.querySelectorAll('.slider-dot');
    let activeTestimonialIdx = 0;
    const testInterval = 6000; // 6 seconds

    function slideTestimonial(idx) {
        testimonialTrack.style.transform = `translateX(-${idx * 100}%)`;
        
        // Toggle active states on cards
        testimonialCards.forEach((card, cIdx) => {
            if (cIdx === idx) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        // Toggle active states on dots
        sliderDots.forEach((dot, dIdx) => {
            if (dIdx === idx) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        activeTestimonialIdx = idx;
    }

    sliderDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            slideTestimonial(index);
        });
    });

    function nextTestimonial() {
        const nextIdx = (activeTestimonialIdx + 1) % testimonialCards.length;
        slideTestimonial(nextIdx);
    }

    let testimonialTimer = setInterval(nextTestimonial, testInterval);

    // Pause slider on mouse hover
    const testimonialContainer = document.querySelector('.testimonial-slider-container');
    testimonialContainer.addEventListener('mouseenter', () => {
        clearInterval(testimonialTimer);
    });
    testimonialContainer.addEventListener('mouseleave', () => {
        testimonialTimer = setInterval(nextTestimonial, testInterval);
    });

    /* ==========================================================================
       8. Booking Modal and Forms
       ========================================================================== */
    const bookingModal = document.getElementById('bookingModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalTitle = document.getElementById('modalTitle');
    const modalPkgName = document.getElementById('modalPkgName');
    const modalBookingForm = document.getElementById('modalBookingForm');

    window.openBookingModal = function(packageName, price) {
        modalTitle.textContent = `Book: ${packageName}`;
        modalPkgName.value = packageName;
        bookingModal.classList.add('open');
        document.body.style.overflow = 'hidden'; // Lock scrolling
    };

    function closeModal() {
        bookingModal.classList.remove('open');
        document.body.style.overflow = 'auto'; // Enable scrolling
        modalBookingForm.reset();
    }

    modalCloseBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking on overlay
    bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            closeModal();
        }
    });

    // Handle booking request submission
    modalBookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pkg = modalPkgName.value;
        const phone = document.getElementById('modalPhone').value;
        const date = document.getElementById('modalDate').value;
        
        showToast('Saving booking details...', 'info');

        setTimeout(() => {
            closeModal();
            showToast(`Request Received! Our agent will call you at ${phone} to confirm your "${pkg}" trip on ${date}.`, 'success');
        }, 1200);
    });

    /* ==========================================================================
       9. Contact Form Handling
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;

        showToast('Sending message...', 'info');

        setTimeout(() => {
            contactForm.reset();
            showToast(`Message sent! Thank you ${name}, we will respond to ${email} shortly.`, 'success');
        }, 1200);
    });

    /* ==========================================================================
       10. Notification Toast System
       ========================================================================== */
    const toastContainer = document.getElementById('toastContainer');

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let iconClass = 'fa-circle-info';
        if (type === 'success') iconClass = 'fa-circle-check';
        if (type === 'error') iconClass = 'fa-circle-xmark';

        toast.innerHTML = `
            <i class="fa-solid ${iconClass}"></i>
            <span>${message}</span>
        `;

        toastContainer.appendChild(toast);

        // Remove toast after 4 seconds
        setTimeout(() => {
            toast.classList.add('removing');
            toast.addEventListener('transitionend', () => {
                toast.remove();
            });
        }, 4000);
    }

});
