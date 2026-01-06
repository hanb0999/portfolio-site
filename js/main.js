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

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLang') || 'ja';
    toggleLanguage(savedLang);

    const screen = document.getElementById('loading-screen');
    const bar = document.getElementById('handler-bar');
    const logoFill = document.getElementById('handler-logo-fill');
    
    const allImages = Array.from(document.querySelectorAll('.card, .logo img, .bottom-logo img'));
    let loadedCount = 0;
    const totalImages = allImages.length;

    const updateProgress = () => {
        loadedCount++;
        const progress = (loadedCount / totalImages) * 100;
        
        if (bar) bar.style.width = progress + '%';
        if (logoFill) logoFill.style.height = progress + '%';

        if (loadedCount >= totalImages) {
            setTimeout(hideLoader, 500);
        }
    };

    const hideLoader = () => {
        if (screen && !screen.classList.contains('loaded')) {
            screen.classList.add('loaded');
            document.body.style.overflow = 'visible';
        }
    };

    if (totalImages === 0) {
        hideLoader();
    } else {
        document.body.style.overflow = 'hidden';
        allImages.forEach((item) => {
            if (item.classList.contains('card')) {
                const style = window.getComputedStyle(item);
                const bgUrl = style.backgroundImage.slice(4, -1).replace(/"/g, "");
                if (bgUrl && bgUrl !== 'none') {
                    const img = new Image();
                    img.src = bgUrl;
                    img.onload = updateProgress;
                    img.onerror = updateProgress;
                } else {
                    updateProgress();
                }
            } else {
                if (item.complete) {
                    updateProgress();
                } else {
                    item.addEventListener('load', updateProgress);
                    item.addEventListener('error', updateProgress);
                }
            }
        });
    }
    setTimeout(hideLoader, 6000);

    const cardLinks = document.querySelectorAll('.card-link');
    cardLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const card = link.querySelector('.card');
            if (window.innerWidth <= 768 && !card.classList.contains('active')) {
                e.preventDefault(); 
                document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            } else {
                document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            }
        });
    });

    const slider = document.querySelector('.gallery-wrapper');
    if (slider && window.innerWidth > 768) {
        let isDown = false, startX, scrollLeft;
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('dragging');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        slider.addEventListener('mouseleave', () => { isDown = false; slider.classList.remove('dragging'); });
        slider.addEventListener('mouseup', () => { isDown = false; slider.classList.remove('dragging'); });
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });
    }
});
