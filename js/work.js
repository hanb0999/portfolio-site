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
        document.getElementById('nextWorkBtn').href = `work-${currentNum <= 1 ? total : currentNum - 1}.html`;
        document.getElementById('prevWorkBtn').href = `work-${currentNum >= total ? 1 : currentNum + 1}.html`;
    }

    const screen = document.getElementById('loading-screen');
    const bar = document.getElementById('handler-bar');
    const logoFill = document.getElementById('handler-logo-fill');

    if (document.readyState === 'complete') {
        if (screen) screen.classList.add('loaded');
    } else {
        document.body.style.overflow = 'hidden';
        let progress = 0;
        const interval = setInterval(() => {
            if (progress < 95) {
                progress += 2;
                if (bar) bar.style.width = progress + '%';
                if (logoFill) logoFill.style.height = progress + '%';
            }
        }, 30);

        window.addEventListener('load', () => {
            clearInterval(interval);
            if (bar) bar.style.width = '100%';
            if (logoFill) logoFill.style.height = '100%';
            setTimeout(() => {
                if (screen) screen.classList.add('loaded');
                document.body.style.overflow = 'visible';
            }, 400);
        });
    }

    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    const lbVideo = document.getElementById('lightbox-video');
    const lbCaption = document.getElementById('lightbox-caption');
    const mediaElements = Array.from(document.querySelectorAll('.work-grid img, .image-box img, .image-box video'));
    let currentIndex = 0;

    function updateLightbox() {
        const media = mediaElements[currentIndex];
        const isEn = document.body.classList.contains('lang-en-active');
        lbImg.style.display = 'none'; lbVideo.style.display = 'none'; lbVideo.pause();
        if (media.tagName === 'VIDEO') {
            lbVideo.src = media.querySelector('source').src;
            lbVideo.style.display = 'block'; lbVideo.play();
            lbCaption.textContent = isEn ? "Project Video" : "プロジェクト動画";
        } else {
            lbImg.src = media.src; lbImg.style.display = 'block';
            lbCaption.textContent = isEn ? (media.getAttribute('data-en-alt') || media.alt) : media.alt;
        }
    }

    mediaElements.forEach((m, i) => { m.addEventListener('click', () => { currentIndex = i; updateLightbox(); lightbox.style.display = 'flex'; }); });
    document.querySelector('.lb-next')?.addEventListener('click', (e) => { e.stopPropagation(); currentIndex = (currentIndex + 1) % mediaElements.length; updateLightbox(); });
    document.querySelector('.lb-prev')?.addEventListener('click', (e) => { e.stopPropagation(); currentIndex = (currentIndex - 1 + mediaElements.length) % mediaElements.length; updateLightbox(); });
    document.querySelector('.close-lightbox')?.addEventListener('click', () => { lightbox.style.display = 'none'; lbVideo.pause(); });
});
