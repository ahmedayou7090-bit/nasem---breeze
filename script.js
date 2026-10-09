document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            navLinks.classList.remove('active'); // Close mobile menu if open
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in-up, .slide-in-right, .slide-in-left, .zoom-in, .slide-in-up');
    animatedElements.forEach(el => observer.observe(el));

    // Form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // In a real app, this would send data to a server
            alert('تم إرسال طلبك بنجاح! سنتواصل معك في أقرب وقت.');
            contactForm.reset();
        });
    }
    // Review Modal Logic
    const reviewModal = document.getElementById('reviewModal');
    const openReviewModalBtn = document.getElementById('openReviewModalBtn');
    const closeReviewModalBtn = document.querySelector('.close-modal');
    const reviewForm = document.getElementById('reviewForm');
    const ratingStars = document.querySelectorAll('.rating-star');
    const reviewRatingInput = document.getElementById('reviewRating');

    if (openReviewModalBtn && reviewModal) {
        openReviewModalBtn.addEventListener('click', () => {
            reviewModal.style.display = 'block';
        });

        closeReviewModalBtn.addEventListener('click', () => {
            reviewModal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target == reviewModal) {
                reviewModal.style.display = 'none';
            }
        });

        // Star rating logic
        ratingStars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = this.getAttribute('data-value');
                reviewRatingInput.value = rating;
                
                // Update stars UI
                ratingStars.forEach(s => {
                    if (s.getAttribute('data-value') <= rating) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
        });

        // Form submission via WhatsApp
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reviewName').value;
            const rating = document.getElementById('reviewRating').value;
            const comment = document.getElementById('reviewComment').value;

            // Format message for WhatsApp
            const message = `تقييم جديد من عميل لمؤسسة نسيم الطبيعة:%0A%0Aالاسم: ${name}%0Aالتقييم: ${rating} نجوم ⭐️%0Aالتعليق: ${comment}`;
            
            // Redirect to WhatsApp
            const whatsappUrl = `https://wa.me/966544629160?text=${message}`;
            window.open(whatsappUrl, '_blank');

            // Close modal and show success alert
            reviewModal.style.display = 'none';
            reviewForm.reset();
            
            // Reset stars
            ratingStars.forEach(s => s.classList.add('active'));
            reviewRatingInput.value = 5;
            
            alert('شكراً لك! تم تحويل تقييمك بنجاح.');
        });
    }

    // ==========================================
    // Interactive Map Configuration & Setup
    // ==========================================
    const WORK_LOCATION = {
        lat: 24.6975,
        lng: 46.6845,
        title: "مؤسسة نسيم الطبيعة لتنسيق الحدائق",
        address: "الرياض - حي العليا",
        phone: "0544629160",
        googleMapsUrl: "https://maps.google.com/?q=24.6975,46.6845",
        directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=24.6975,46.6845"
    };

    // Region Coordinates in Riyadh
    const REGIONS_DATA = {
        all: { lat: 24.6975, lng: 46.6845, zoom: 14, label: "مقر المؤسسة (حي العليا - الرياض)" },
        north: { lat: 24.8150, lng: 46.6400, zoom: 12, label: "شمال الرياض (الصحافة، حطين، الياسمين)" },
        east: { lat: 24.7600, lng: 46.7800, zoom: 12, label: "شرق الرياض (الروضة، المونسية، القرطبة)" },
        west: { lat: 24.6600, lng: 46.5800, zoom: 12, label: "غرب الرياض (ظهرة لبن، العريجاء، السويدي)" },
        south: { lat: 24.5700, lng: 46.7200, zoom: 12, label: "جنوب الرياض (الشفا، العزيزية، بدر)" },
        central: { lat: 24.6975, lng: 46.6845, zoom: 14, label: "وسط الرياض (حي العليا)" }
    };

    const mapElement = document.getElementById('interactiveMap');
    if (mapElement && typeof L !== 'undefined') {
        // Initialize Leaflet Map centered at Riyadh Al Olaya
        const map = L.map('interactiveMap', {
            center: [WORK_LOCATION.lat, WORK_LOCATION.lng],
            zoom: 14,
            zoomControl: true
        });

        // Add Leaflet Tile Layer (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap | نسيم الطبيعة'
        }).addTo(map);

        // Custom Icon for Work Location
        const customPinIcon = L.divIcon({
            className: 'custom-leaflet-pin-wrapper',
            html: '<div class="custom-leaflet-pin"></div>',
            iconSize: [28, 28],
            iconAnchor: [14, 28],
            popupAnchor: [0, -25]
        });

        // Main Marker
        const mainMarker = L.marker([WORK_LOCATION.lat, WORK_LOCATION.lng], { icon: customPinIcon }).addTo(map);

        // Service Coverage Circle around main location
        L.circle([WORK_LOCATION.lat, WORK_LOCATION.lng], {
            color: '#1B5E20',
            fillColor: '#4CAF50',
            fillOpacity: 0.15,
            radius: 25000 // 25 km coverage radius
        }).addTo(map);

        // Popup Content
        const popupContent = `
            <div style="text-align: right; direction: rtl; font-family: 'Tajawal', sans-serif;">
                <h4 style="margin-bottom: 5px; color: #1B5E20; font-size: 1.1rem; font-weight: 700;">
                    <i class="fas fa-leaf" style="color: #D4AF37;"></i> ${WORK_LOCATION.title}
                </h4>
                <p style="margin-bottom: 8px; font-size: 0.88rem; color: #444;">
                    <i class="fas fa-map-marker-alt" style="color: #1B5E20;"></i> ${WORK_LOCATION.address}
                </p>
                <p style="margin-bottom: 12px; font-size: 0.88rem; color: #444;" dir="ltr">
                    <i class="fas fa-phone-alt" style="color: #1B5E20;"></i> ${WORK_LOCATION.phone}
                </p>
                <div style="display: flex; gap: 6px;">
                    <a href="${WORK_LOCATION.directionsUrl}" target="_blank" style="background-color: #1B5E20; color: #fff; padding: 5px 10px; border-radius: 15px; text-decoration: none; font-size: 0.8rem; font-weight: bold;">
                        <i class="fas fa-directions"></i> الاتجاهات
                    </a>
                    <a href="https://wa.me/966544629160" target="_blank" style="background-color: #25D366; color: #fff; padding: 5px 10px; border-radius: 15px; text-decoration: none; font-size: 0.8rem; font-weight: bold;">
                        <i class="fab fa-whatsapp"></i> واتساب
                    </a>
                </div>
            </div>
        `;

        mainMarker.bindPopup(popupContent).openPopup();

        // Region Filter Pill Buttons
        const regionButtons = document.querySelectorAll('#mapRegionFilter .area-badge');
        regionButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                regionButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const regionKey = btn.getAttribute('data-region');
                const region = REGIONS_DATA[regionKey] || REGIONS_DATA.all;

                map.flyTo([region.lat, region.lng], region.zoom, {
                    duration: 1.2
                });

                if (regionKey === 'all') {
                    mainMarker.openPopup();
                }
            });
        });

        // Tab Switcher (Leaflet vs Google Maps Embed)
        const btnTabLeaflet = document.getElementById('btnTabLeaflet');
        const btnTabGoogle = document.getElementById('btnTabGoogle');
        const interactiveMapBox = document.getElementById('interactiveMap');
        const googleEmbedContainer = document.getElementById('googleEmbedContainer');

        if (btnTabLeaflet && btnTabGoogle) {
            btnTabLeaflet.addEventListener('click', () => {
                btnTabLeaflet.classList.add('active');
                btnTabGoogle.classList.remove('active');
                interactiveMapBox.style.display = 'block';
                googleEmbedContainer.style.display = 'none';
                setTimeout(() => map.invalidateSize(), 200);
            });

            btnTabGoogle.addEventListener('click', () => {
                btnTabGoogle.classList.add('active');
                btnTabLeaflet.classList.remove('active');
                interactiveMapBox.style.display = 'none';
                googleEmbedContainer.style.display = 'block';
            });
        }

        // Copy Coordinates Button
        const copyCoordsBtn = document.getElementById('copyCoordsBtn');
        if (copyCoordsBtn) {
            copyCoordsBtn.addEventListener('click', () => {
                const coordsStr = `${WORK_LOCATION.lat}, ${WORK_LOCATION.lng}`;
                navigator.clipboard.writeText(coordsStr).then(() => {
                    const originalHTML = copyCoordsBtn.innerHTML;
                    copyCoordsBtn.innerHTML = '<i class="fas fa-check" style="color:#25D366;"></i> تم النسخ بنجاح!';
                    setTimeout(() => {
                        copyCoordsBtn.innerHTML = originalHTML;
                    }, 2500);
                }).catch(() => {
                    alert(`إحداثيات موقع العمل: ${coordsStr}`);
                });
            });
        }
    }
});
