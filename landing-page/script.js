// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.add('scrolled'); // we could remove it, but saas headers often keep it or change opacity
        if (window.scrollY === 0) {
            navbar.classList.remove('scrolled');
        }
    }
});

// Demo Form submission
document.getElementById('demo-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    // Capture form data
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        intent: document.getElementById('intent').value,
        property_type: document.getElementById('property_type').value,
        preferred_location: document.getElementById('preferred_location').value,
        timeline: document.getElementById('timeline').value,
        budget: document.getElementById('budget').value
    };

    const webhookUrl = "https://hook.eu1.make.com/ahsnhof0i9137fay4s67b28xhnawjsui";

    // Animate button
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Connecting AI...';
    btn.style.opacity = '0.8';
    btn.disabled = true;

    try {
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Connected! Our AI will call you shortly.';
            btn.style.background = '#10b981'; // Success green
            btn.style.borderColor = '#10b981';
            e.target.reset();

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.style.borderColor = '';
                btn.style.opacity = '1';
                btn.disabled = false;
            }, 5000);
        } else {
            throw new Error("Submission failed");
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        btn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Error. Please try again.';
        btn.style.background = '#ef4444'; // Error red
        btn.style.borderColor = '#ef4444';

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.style.opacity = '1';
            btn.disabled = false;
        }, 5000);
    }
});

// Demo Audio Player Animation (Visual only)
const playBtn = document.querySelector('.play-btn');
const bars = document.querySelectorAll('.bar');
let isPlaying = false;

playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;

    if (isPlaying) {
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        bars.forEach(bar => {
            bar.style.animationPlayState = 'running';
        });

        // Simulate progress bar moving
        let progress = 35;
        const progressBar = document.querySelector('.progress-bar');
        const interval = setInterval(() => {
            if (!isPlaying || progress >= 100) {
                clearInterval(interval);
                if (progress >= 100) {
                    isPlaying = false;
                    playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
                    bars.forEach(bar => {
                        bar.style.animationPlayState = 'paused';
                    });
                    progressBar.style.width = '0%';
                }
                return;
            }
            progress += 0.5;
            progressBar.style.width = `${progress}%`;
        }, 100);

    } else {
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        bars.forEach(bar => {
            bar.style.animationPlayState = 'paused';
        });
    }
});


// Pause bars initially
bars.forEach(bar => {
    bar.style.animationPlayState = 'paused';
});

// ROI Calculator Logic
const leadsSlider = document.getElementById('leads-slider');
const priceSlider = document.getElementById('price-slider');
const commSlider = document.getElementById('comm-slider');
const convSlider = document.getElementById('conv-slider');

if (leadsSlider) {
    const updateROI = () => {
        const leads = parseInt(leadsSlider.value);
        const price = parseInt(priceSlider.value);
        const comm = parseFloat(commSlider.value);
        const conv = parseFloat(convSlider.value);

        // Update displays
        document.getElementById('leads-val').textContent = leads;
        document.getElementById('price-val').textContent = price.toLocaleString();
        document.getElementById('comm-val').textContent = comm;
        document.getElementById('conv-val').textContent = conv;

        // Calculations
        const potentialDeals = Math.round(leads * (conv / 100));
        const monthlyCommission = potentialDeals * price * (comm / 100);
        const revenueWithAI = monthlyCommission * 2.5; // Same logic as React version

        // Update results with animation
        animateNumber('deals-val-res', potentialDeals);
        animateNumber('comm-val-res', Math.round(monthlyCommission));
        animateNumber('total-revenue', Math.round(revenueWithAI));
    };

    const animateNumber = (id, target) => {
        const el = document.getElementById(id);
        const start = parseInt(el.textContent.replace(/,/g, '')) || 0;
        const duration = 500;
        const startTime = performance.now();

        const update = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (target - start) * progress);
            el.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        requestAnimationFrame(update);
    };

    [leadsSlider, priceSlider, commSlider, convSlider].forEach(slider => {
        slider.addEventListener('input', updateROI);
    });

    // Initial calculation
    updateROI();
}
