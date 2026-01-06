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
}

function scrollCarousel(direction) {
    const carousel = document.getElementById('workCarousel');
    if (!carousel) return;
    const firstCard = carousel.querySelector('.mini-card:not(.is-current)');
    if (!firstCard) return;
    const cardWidth = firstCard.offsetWidth + 8;
    carousel.style.scrollSnapType = 'none';
    carousel.scrollBy({ left: direction * (cardWidth * 2), behavior: 'smooth' });
    setTimeout(() => { carousel.style.scrollSnapType = 'x mandatory'; }, 500);
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLang') || 'ja';
    toggleLanguage(savedLang);

    const currentPath = window.location.pathname;
    const match = currentPath.match(/work-(\d+)\.html/);
    if (match) {
        const currentNum = parseInt(match[1]);
        const total = 11;
        const nextBtn = document.getElementById('nextWorkBtn');
        const prevBtn = document.getElementById('prevWorkBtn');
        if (nextBtn) nextBtn.href = `work-${currentNum <= 1 ? total : currentNum - 1}.html`;
        if (prevBtn) prevBtn.href = `work-${currentNum >= total ? 1 : currentNum + 1}.html`;
    }

    const screen = document.getElementById('loading-screen');
    const bar = document.getElementById('handler-bar');
    const logoFill = document.getElementById('handler-logo-fill');

    const allMedia = Array.from(document.querySelectorAll('.work-visuals img, .work-visuals video, .logo img, .bottom-logo img'));
    let loadedCount = 0;
    const totalMedia = allMedia.length;

    const updateProgress = () => {
        loadedCount++;
        const progress = (loadedCount / totalMedia) * 100;
        if (bar) bar.style.width = progress + '%';
        if (logoFill) logoFill.style.height = progress + '%';
        if (loadedCount >= totalMedia) setTimeout(hideLoader, 500);
    };

    const hideLoader = () => {
        if (screen && !screen.classList.contains('loaded')) {
            screen.classList.add('loaded');
            document.body.style.overflow = 'visible';
        }
    };

    if (totalMedia === 0) {
        hideLoader();
    } else {
        document.body.style.overflow = 'hidden';
        allMedia.forEach((media) => {
            if (media.tagName === 'IMG') {
                if (media.complete) updateProgress();
                else { media.addEventListener('load', updateProgress); media.addEventListener('error', updateProgress); }
            } else if (media.tagName === 'VIDEO') {
                if (media.readyState >= 2) updateProgress();
                else { media.addEventListener('loadeddata', updateProgress); media.addEventListener('error', updateProgress); }
            }
        });
    }
    setTimeout(hideLoader, 6000);

    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    const lbVideo = document.getElementById('lightbox-video');
    const lbCaption = document.getElementById('lightbox-caption');
    const mediaElements = Array.from(document.querySelectorAll('.work-grid img, .work3-grid img, .image-box img, .image-box-work img, .image-box-work3 img, .image-box video'));
    let currentIndex = 0;

    function updateLightbox() {
        const media = mediaElements[currentIndex];
        if (!media) return;
        const isEn = document.body.classList.contains('lang-en-active');
        lbImg.style.display = 'none'; lbVideo.style.display = 'none'; lbVideo.pause();
        if (media.tagName === 'VIDEO') {
            const source = media.querySelector('source');
            if (source) { lbVideo.src = source.src; lbVideo.style.display = 'block'; lbVideo.play(); lbCaption.textContent = isEn ? "Project Video" : "プロジェクト動画"; }
        } else {
            lbImg.src = media.src; lbImg.style.display = 'block';
            lbCaption.textContent = isEn ? (media.getAttribute('data-en-alt') || media.alt) : media.alt;
        }
    }

    mediaElements.forEach((m, i) => { m.addEventListener('click', () => { currentIndex = i; updateLightbox(); if (lightbox) lightbox.style.display = 'flex'; }); });
    document.querySelector('.lb-next')?.addEventListener('click', (e) => { e.stopPropagation(); currentIndex = (currentIndex + 1) % mediaElements.length; updateLightbox(); });
    document.querySelector('.lb-prev')?.addEventListener('click', (e) => { e.stopPropagation(); currentIndex = (currentIndex - 1 + mediaElements.length) % mediaElements.length; updateLightbox(); });

    const closeLb = () => { if (lightbox) lightbox.style.display = 'none'; if (lbVideo) lbVideo.pause(); };
    document.querySelector('.close-lightbox')?.addEventListener('click', closeLb);
    lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLb(); });

    let touchStartX = 0;
    let touchStartY = 0;

    lightbox?.addEventListener('touchstart', e => { 
        touchStartX = e.changedTouches[0].screenX; 
        touchStartY = e.changedTouches[0].screenY;
    }, {passive: true});

    lightbox?.addEventListener('touchmove', e => {
        if (lightbox.style.display === 'flex') {
        }
    }, {passive: true});

    lightbox?.addEventListener('touchend', e => { 
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;

        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX < 0) {
                document.querySelector('.lb-next')?.click();
            } else {
                document.querySelector('.lb-prev')?.click();
            }
        }
    }, {passive: true});

    const siteLinks = document.querySelectorAll('.site-link');
    siteLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                const isEn = document.body.classList.contains('lang-en-active');
                const message = isEn ? "This site is designed for desktop and may not display correctly on mobile. Continue?" : "このサイトはデスクトップ専用設計です。モバイルでは正しく表示されない場合があります。移動しますか？";
                if (!confirm(message)) e.preventDefault();
            }
        });
    });
});
