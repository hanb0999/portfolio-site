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
    const hasSeenLoader = sessionStorage.getItem('hasSeenLoader');

    if (hasSeenLoader) {
        if (screen) screen.style.display = 'none';
        document.body.style.overflow = 'visible';
    } else {
        document.body.style.overflow = 'hidden';
        let progress = 0;
        const interval = setInterval(() => {
            if (progress < 90) {
                progress += Math.random() * 3 + 1; 
                if (progress > 90) progress = 90;
                if (bar) bar.style.width = progress + '%';
                if (logoFill) logoFill.style.height = progress + '%';
            }
        }, 400);

        window.addEventListener('load', () => {
            setTimeout(() => {
                clearInterval(interval);
                if (bar) bar.style.width = '100%';
                if (logoFill) logoFill.style.height = '100%';
                setTimeout(() => {
                    if (screen) screen.classList.add('loaded');
                    document.body.style.overflow = '';
                    sessionStorage.setItem('hasSeenLoader', 'true');
                }, 800);
            }, 500);
        });
    }

    const cardLinks = document.querySelectorAll('.card-link');
    cardLinks.forEach(link => {
        const card = link.querySelector('.card');
        link.addEventListener('click', () => {
            document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });
    });

    const slider = document.querySelector('.gallery-wrapper');
    if (slider) {
        let isDown = false; let startX; let scrollLeft;
        slider.addEventListener('mousedown', (e) => {
            isDown = true; slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft; scrollLeft = slider.scrollLeft;
        });
        slider.addEventListener('mouseleave', () => { isDown = false; });
        slider.addEventListener('mouseup', () => { isDown = false; });
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; slider.scrollLeft = scrollLeft - walk;
        });
    }
});
