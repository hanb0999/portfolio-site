function toggleLanguage(lang) {
    const body = document.body;
    const btnEn = document.getElementById('btn-en');
    const btnJa = document.getElementById('btn-ja');
    localStorage.setItem('preferredLang', lang);

    if (lang === 'en') {
        body.classList.add('lang-en-active');
        if(btnEn) btnEn.classList.add('active');
        if(btnJa) btnJa.classList.remove('active');
    } else {
        body.classList.remove('lang-en-active');
        if(btnJa) btnJa.classList.add('active');
        if(btnEn) btnEn.classList.remove('active');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const savedLang = localStorage.getItem('preferredLang') || 'ja';
    toggleLanguage(savedLang);

    try {
        const response = await fetch('./js/projects.json');
        const projects = await response.json();
        const gallery = document.getElementById('home-gallery');
        const grid = document.getElementById('works-grid');

        if (gallery && grid) {
            const sortedProjects = projects.sort((a, b) => b.id - a.id);
            sortedProjects.forEach((proj, index) => {
                const isActive = index === 0 ? 'active' : ''; 
                const url = `work-detail.html?id=${proj.id}`;
                const bg = `./img/top/work-${proj.id}.jpg`;

                gallery.innerHTML += `
                    <a href="${url}" class="card-link">
                        <div class="card ${isActive}" style="background-image: url('${bg}');">
                            <div class="card-label">
                                <span class="label-text lang-ja">作品No.${proj.id}</span>
                                <span class="label-text lang-en">Work No.${proj.id}</span>
                            </div> 
                        </div>
                    </a>`;

                grid.innerHTML += `<a href="${url}" class="work-item" style="background-image: url('${bg}');"></a>`;
            });
        }
    } catch (e) { console.error("Error loading JSON", e); }

    setupUIInteractions();
});

function setupUIInteractions() {
    const screen = document.getElementById('loading-screen');
    const bar = document.getElementById('handler-bar');
    const logoFill = document.getElementById('handler-logo-fill');
    const header = document.querySelector('header');
    
    const allImages = Array.from(document.querySelectorAll('.card, .logo img, .bottom-logo img, .work-item'));
    let loadedCount = 0;
    const totalImages = allImages.length;

    const updateProgress = () => {
        loadedCount++;
        const progress = totalImages > 0 ? (loadedCount / totalImages) * 100 : 100;
        if (bar) bar.style.width = progress + '%';
        if (logoFill) logoFill.style.height = progress + '%';
        if (loadedCount >= totalImages) setTimeout(hideLoader, 500);
    };

    const hideLoader = () => {
        if (screen && !screen.classList.contains('loaded')) {
            screen.classList.add('loaded');
            document.body.style.overflow = 'visible';
            initScrollAnimations(); 
            initHeaderObserver(); 
        }
    };

window.addEventListener('scroll', () => {
    if (window.innerWidth > 768) {
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    } else {
        const header = document.querySelector('header');
        if (header) header.classList.remove('scrolled');
    }
});

    if (totalImages === 0) { hideLoader(); } 
    else {
        document.body.style.overflow = 'hidden';
        allImages.forEach((item) => {
            const style = window.getComputedStyle(item);
            const bgUrl = style.backgroundImage.slice(4, -1).replace(/"/g, "");
            if (bgUrl && bgUrl !== 'none') {
                const img = new Image();
                img.src = bgUrl;
                img.onload = updateProgress;
                img.onerror = updateProgress;
            } else if (item.complete) { updateProgress(); } 
            else {
                item.addEventListener('load', updateProgress);
                item.addEventListener('error', updateProgress);
            }
        });
        
    }
    setTimeout(hideLoader, 5000); 

    const slider = document.querySelector('.gallery-wrapper');
    if (slider && window.innerWidth > 768) {
        let isDown = false, startX, scrollLeft;
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('dragging');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        slider.addEventListener('mouseleave', () => { isDown = false; });
        slider.addEventListener('mouseup', () => { isDown = false; });
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });
    }
}

function initHeaderObserver() {
    const logoHeader = document.getElementById('header-logo');
    const sections = document.querySelectorAll('section');
    
    const sectionNames = {
        'home': 'PORTFOLIO',
        'profile': 'PROFILE',
        'works': 'WORKS',
        'contacts': 'CONTACT'
    };

    const observerOptions = {
        root: null,
        threshold: 0.5 
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                const newText = sectionNames[sectionId];

                if (logoHeader.innerText !== newText) {
                    logoHeader.classList.add('fade-out');
                    setTimeout(() => {
                        logoHeader.innerText = newText;
                        logoHeader.classList.remove('fade-out');
                    }, 300);
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                if (entry.target.classList.contains('works-grid')) {
                    const items = entry.target.querySelectorAll('.work-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = "1";
                            item.style.transform = "translateY(0)";
                        }, index * 200);
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.profile-box, .works-grid, .contact-info-wrap').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}