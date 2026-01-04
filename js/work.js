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

function scrollCarousel(direction) {
    const carousel = document.getElementById('workCarousel');
    if (!carousel) return;

    const firstCard = carousel.querySelector('.mini-card:not(.is-current)');
    if (!firstCard) return;

    const cardWidth = firstCard.offsetWidth + 8;
    const moveDistance = cardWidth * 2;
    const currentScroll = carousel.scrollLeft;
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;

    carousel.style.scrollSnapType = 'none';

    if (direction === 1 && currentScroll >= maxScroll - 5) {
        carousel.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (direction === -1 && currentScroll <= 5) {
        carousel.scrollTo({ left: maxScroll, behavior: 'smooth' });
    } else {
        carousel.scrollBy({ left: direction * moveDistance, behavior: 'smooth' });
    }

    setTimeout(() => { carousel.style.scrollSnapType = 'x mandatory'; }, 500);
}

function updateWorkNavigation() {
    const currentPath = window.location.pathname;
    const match = currentPath.match(/work-(\d+)\.html/);
    
    if (match) {
        const currentNum = parseInt(match[1]);
        const totalWorks = 11; 
        const nextNum = currentNum <= 1 ? totalWorks : currentNum - 1;
        const prevNum = currentNum >= totalWorks ? 1 : currentNum + 1;

        const nextBtn = document.getElementById('nextWorkBtn');
        const prevBtn = document.getElementById('prevWorkBtn');

        if (nextBtn) nextBtn.href = `work-${nextNum}.html`;
        if (prevBtn) prevBtn.href = `work-${prevNum}.html`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLang') || 'ja';
    toggleLanguage(savedLang);

    updateWorkNavigation();

    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    const lbVideo = document.getElementById('lightbox-video');
    const lbCaption = document.getElementById('lightbox-caption');
    const mediaElements = Array.from(document.querySelectorAll('.work-grid img, .work3-grid img, .image-box img, .image-box video'));
    
    const prevBtn = document.querySelector('.lb-prev');
    const nextBtn = document.querySelector('.lb-next');
    const closeBtn = document.querySelector('.close-lightbox');
    let currentIndex = 0;

    function updateLightbox() {
        const currentMedia = mediaElements[currentIndex];
        const isEnglish = document.body.classList.contains('lang-en-active'); 
        
        lbImg.style.display = 'none';
        lbVideo.style.display = 'none';
        lbVideo.pause();
        lbVideo.src = ""; 

        if (currentMedia.tagName === 'VIDEO') {
            const source = currentMedia.querySelector('source').src;
            lbVideo.src = source;
            lbVideo.style.display = 'block';
            lbVideo.load();
            lbVideo.play();
            lbCaption.textContent = isEnglish ? "Project Video" : "プロジェクト動画";
        } else {
            lbImg.src = currentMedia.src;
            lbImg.style.display = 'block';
            lbCaption.textContent = isEnglish 
                ? (currentMedia.getAttribute('data-en-alt') || currentMedia.alt || "") 
                : (currentMedia.alt || "");
        }
    }

    mediaElements.forEach((media, index) => {
        media.addEventListener('click', () => {
            currentIndex = index;
            updateLightbox();
            lightbox.style.display = 'flex';
        });
    });

    const showNext = (e) => { if(e) e.stopPropagation(); currentIndex = (currentIndex + 1) % mediaElements.length; updateLightbox(); };
    const showPrev = (e) => { if(e) e.stopPropagation(); currentIndex = (currentIndex - 1 + mediaElements.length) % mediaElements.length; updateLightbox(); };
    const closeLightbox = () => { lightbox.style.display = 'none'; lbVideo.pause(); lbVideo.src = ""; };

    if(nextBtn) nextBtn.addEventListener('click', showNext);
    if(prevBtn) prevBtn.addEventListener('click', showPrev);
    if(closeBtn) closeBtn.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lb-container')) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === "ArrowRight") showNext();
            if (e.key === "ArrowLeft") showPrev();
            if (e.key === "Escape") closeLightbox();
        }
    });
});