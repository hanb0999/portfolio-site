let allProjects = [];
let currentProjectData = null;

function toggleLanguage(lang) {
    const body = document.body;
    const btnEn = document.getElementById('btn-en');
    const btnJa = document.getElementById('btn-ja');
    localStorage.setItem('preferredLang', lang);

    if (lang === 'en') {
        body.classList.add('lang-en-active');
        if (btnEn) btnEn.classList.add('active');
        if (btnJa) btnJa.classList.remove('active');
    } else {
        body.classList.remove('lang-en-active');
        if (btnJa) btnJa.classList.add('active');
        if (btnEn) btnEn.classList.remove('active');
    }

    updateTabTitle(lang);
}

function updateTabTitle(lang) {
    if (!currentProjectData) return;
    if (lang === 'en') {
        document.title = `Work No.${currentProjectData.id}`;
    } else {
        document.title = `作品 No.${currentProjectData.id}`;
    }
}

function scrollCarousel(direction) {
    const carousel = document.getElementById('workCarousel');
    if (!carousel) return;
    const cards = carousel.querySelectorAll('.mini-card');
    if (cards.length === 0) return;
    const cardWidth = cards[0].offsetWidth + 8;
    carousel.style.scrollSnapType = 'none';
    carousel.scrollBy({ left: direction * (cardWidth * 2), behavior: 'smooth' });
    setTimeout(() => { carousel.style.scrollSnapType = 'x mandatory'; }, 500);
}

document.addEventListener('DOMContentLoaded', async () => {
    const savedLang = localStorage.getItem('preferredLang') || 'ja';
    toggleLanguage(savedLang);

    try {
        const response = await fetch('./js/projects.json');
        allProjects = await response.json();
        
        const params = new URLSearchParams(window.location.search);
        const defaultId = allProjects.length > 0 ? Math.max(...allProjects.map(p => p.id)) : 11;
        const projectId = parseInt(params.get('id')) || defaultId; 
        
        const currentProject = allProjects.find(p => p.id === projectId);
        if (currentProject) {
            renderProjectPage(currentProject);
        }
    } catch (error) {
        console.error("Failed to load project data:", error);
    }

    // FIND AND REPLACE ALL SCROLL LISTENERS WITH THIS SINGLE BLOCK:
window.addEventListener('scroll', () => {
    // Only apply the "scrolled" class effects if the screen is wider than 768px (Desktop)
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
        // Force removal on mobile just in case it was triggered during a resize
        const header = document.querySelector('header');
        if (header) header.classList.remove('scrolled');
    }
});

    setupLoadingScreen();
    setupLightbox();
});

function renderProjectPage(data) {
    currentProjectData = data; 
    const currentLang = localStorage.getItem('preferredLang') || 'ja';
    updateTabTitle(currentLang);

    const titleContainer = document.querySelector('.project-title');
    titleContainer.innerHTML = `
        <span class="lang-ja">${data.title_ja}</span>
        <span class="lang-en">${data.title_en}</span>
    `;
    
    const populateList = (selector, jaArray, enArray) => {
        const list = document.querySelector(selector);
        if (!list || !jaArray) return;
        list.innerHTML = jaArray.map((text, i) => `
            <li>
                <span class="lang-ja">${text}</span>
                <span class="lang-en">${enArray ? enArray[i] : ""}</span>
            </li>
        `).join('');
    };

    populateList('.detail-group:nth-of-type(1) .info-list', data.overview_ja, data.overview_en);
    populateList('.detail-group:nth-of-type(3) .info-list', data.role_ja, data.role_en);
    populateList('.detail-group:nth-of-type(4) .info-list', data.concept_ja, data.concept_en);
    populateList('.detail-group:nth-of-type(5) .info-list', data.reflections_ja, data.reflections_en);

    const dateBox = document.querySelector('.detail-group:nth-of-type(2) p');
    dateBox.innerHTML = `<span class="lang-ja">${data.date_ja}</span><span class="lang-en">${data.date_en}</span>`;

    const toolBox = document.querySelector('.detail-group:nth-of-type(6) p');
    if (data.tools_en) {
        const toolsArray = data.tools_en.split(' / ');
        let formattedTools = "";
        for (let i = 0; i < toolsArray.length; i++) {
            formattedTools += toolsArray[i];
            if (i !== toolsArray.length - 1) { 
                if ((i + 1) % 3 === 0) {
                    formattedTools += "<br>";
                } else {
                    formattedTools += " / ";
                }
            }
        }
        toolBox.innerHTML = formattedTools;
    }

    const siteLink = document.querySelector('.site-link-container');
    const infoPanel = document.querySelector('.work-info-panel');
    
    document.querySelector('.mobile-site-note')?.remove(); 
    
    if (siteLink) {
        if (data.site_url && data.site_url.trim() !== "" && data.site_url !== "#") {
            siteLink.href = data.site_url;
            siteLink.style.display = "block";
            siteLink.innerHTML = `<span class="lang-ja">SITEを見る →</span><span class="lang-en">View Website →</span>`;
            
            siteLink.onclick = (e) => {
                if (window.innerWidth <= 768) {
                    const isEn = document.body.classList.contains('lang-en-active');
                    const msg = isEn 
                        ? "This website is optimized for desktop and may not display correctly on mobile. Proceed?" 
                        : "このサイトはデスクトップ専用に設計されています。モバイルでは正しく表示されない場合があります。移動しますか？";
                    
                    if (!confirm(msg)) e.preventDefault();
                }
            };
    
            const note = document.createElement('div');
            note.className = 'mobile-site-note'; 
            note.innerHTML = `<span class="lang-ja">※デスクトップ表示推奨</span><span class="lang-en">※Best viewed on Desktop</span>`;
            siteLink.parentNode.insertBefore(note, siteLink.nextSibling);
            
        } else {
            siteLink.style.display = "none";
        }
    }

    const carousel = document.getElementById('workCarousel');
    if (carousel && allProjects.length > 0) {
        carousel.innerHTML = '';
        const sortedForCarousel = [...allProjects].sort((a, b) => b.id - a.id);
        sortedForCarousel.forEach(proj => {
            const isCurrent = proj.id === data.id ? 'is-current' : '';
            carousel.innerHTML += `
                <a href="work-detail.html?id=${proj.id}" 
                   class="mini-card ${isCurrent}" 
                   style="background-image: url('./img/top/work-${proj.id}.jpg');">
                </a>`;
        });
    }

    const visualWrapper = document.querySelector('.work-visuals');
    const footerLeft = document.querySelector('.detail-footer-left');
    
    let gridClass = "standard-visual-stack";

    if (data.id === 1) {
        gridClass = "work1-square-grid"; 
    } else if (data.id === 8) {
        gridClass = "work8-vertical-grid"; 
    } else if (data.id === 11) {
        gridClass = "work11-grid"; 
    } else if (data.id === 7) {
        gridClass = "work3-grid"; 
    }

    let visualHTML = `<div class="${gridClass}" id="project-gallery-grid">`;
    if (data.main_video) {
        visualHTML += `
            <div class="image-box">
                <video autoplay muted loop playsinline class="work-video">
                    <source src="${data.main_video}" type="video/mp4">
                </video>
            </div>`;
    }
    data.images.forEach(img => {
        visualHTML += `
            <div class="image-box">
                <img src="${img.src}" alt="${img.alt_ja || ''}" data-en-alt="${img.alt_en || ''}">
            </div>`;
    });
    visualHTML += `</div>`;
    
    visualWrapper.innerHTML = visualHTML;
    visualWrapper.appendChild(footerLeft);

    const sortedIds = allProjects.map(p => p.id).sort((a, b) => a - b);
    const currentIndex = sortedIds.indexOf(data.id);
    const total = sortedIds.length;

    const prevId = sortedIds[(currentIndex + 1) % total];
    const nextId = sortedIds[(currentIndex - 1 + total) % total];

    document.getElementById('prevWorkBtn').href = `work-detail.html?id=${prevId}`;
    document.getElementById('nextWorkBtn').href = `work-detail.html?id=${nextId}`;
}

function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    const lbVideo = document.getElementById('lightbox-video');
    const lbCaption = document.getElementById('lightbox-caption');
    let currentIndex = 0;

    const getGalleryItems = () => Array.from(document.querySelectorAll('#project-gallery-grid img, #project-gallery-grid video'));

    document.addEventListener('click', (e) => {
        const mediaElements = getGalleryItems();
        const target = e.target.closest('img, video');
        if (target && target.closest('#project-gallery-grid')) {
            currentIndex = mediaElements.indexOf(target);
            if (currentIndex !== -1) {
                updateLightbox(mediaElements);
                lightbox.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        }
    });

    const navigate = (direction) => {
        const mediaElements = getGalleryItems();
        if (mediaElements.length === 0) return;
        currentIndex = (currentIndex + direction + mediaElements.length) % mediaElements.length;
        updateLightbox(mediaElements);
    };

    document.querySelector('.lb-next')?.addEventListener('click', (e) => { e.stopPropagation(); navigate(1); });
    document.querySelector('.lb-prev')?.addEventListener('click', (e) => { e.stopPropagation(); navigate(-1); });

    function updateLightbox(elements) {
        const media = elements[currentIndex];
        if (!media) return;
        const isEn = document.body.classList.contains('lang-en-active');
        lbImg.style.display = 'none'; 
        lbVideo.style.display = 'none'; 
        lbVideo.pause();

        if (media.tagName === 'VIDEO') {
            const source = media.querySelector('source');
            lbVideo.src = source ? source.src : media.src; 
            lbVideo.style.display = 'block'; 
            lbVideo.play(); 
            lbCaption.textContent = isEn ? "Project Video" : "プロジェクト動画"; 
        } else {
            lbImg.src = media.src; 
            lbImg.style.display = 'block';
            const capEn = media.getAttribute('data-en-alt');
            const capJa = media.alt;
            lbCaption.textContent = isEn ? (capEn || "Work Image") : (capJa || "作品画像");
        }
    }

    const closeLb = () => { 
        if (lightbox) lightbox.style.display = 'none'; 
        lbVideo.pause();
        document.body.style.overflow = 'visible'; 
    };

    document.querySelector('.close-lightbox')?.addEventListener('click', closeLb);
    lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.style.display === 'flex') {
            if (e.key === 'ArrowRight') navigate(1);
            if (e.key === 'ArrowLeft') navigate(-1);
            if (e.key === 'Escape') closeLb();
        }
    });
}

function setupLoadingScreen() {
    const screen = document.getElementById('loading-screen');
    const bar = document.getElementById('handler-bar');
    const logoFill = document.getElementById('handler-logo-fill');

    const interval = setInterval(() => {
        const allMedia = document.querySelectorAll('.work-visuals img, .work-visuals video');
        if (allMedia.length === 0) return;
        let loaded = 0;
        allMedia.forEach(m => {
            if (m.tagName === 'IMG' && m.complete) loaded++;
            if (m.tagName === 'VIDEO' && m.readyState >= 2) loaded++;
        });
        const progress = (loaded / allMedia.length) * 100;
        if (bar) bar.style.width = progress + '%';
        if (logoFill) logoFill.style.height = progress + '%';

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => screen.classList.add('loaded'), 500);
            document.body.style.overflow = 'visible';
        }
    }, 100);
    setTimeout(() => screen.classList.add('loaded'), 6000); 
}
