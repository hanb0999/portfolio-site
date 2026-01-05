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
    
    document.body.style.overflow = 'hidden';
    let progress = 0;

    const interval = setInterval(() => {
        if (progress < 90) {
            progress += 1; 
            if (bar) bar.style.width = progress + '%';
            if (logoFill) logoFill.style.height = progress + '%';
        }
    }, 60);

    window.addEventListener('load', () => {
        clearInterval(interval);
        if (bar) bar.style.width = '100%';
        if (logoFill) logoFill.style.height = '100%';

        setTimeout(() => {
            if (screen) screen.classList.add('loaded');
            document.body.style.overflow = 'visible';
        }, 600);
    });

    const slider = document.querySelector('.gallery-wrapper');
    if (slider) {
        let isDown = false;
        let startX;
        let scrollLeft;

        const startAction = (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = (e.pageX || e.touches[0].pageX) - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        };

        const stopAction = () => {
            isDown = false;
            slider.classList.remove('active');
        };

        const moveAction = (e) => {
            if (!isDown) return;
            if (e.type === 'mousemove') e.preventDefault();
            
            const x = (e.pageX || (e.touches && e.touches[0].pageX)) - slider.offsetLeft;
            const walk = (x - startX) * 2; 
            slider.scrollLeft = scrollLeft - walk;
        };

        slider.addEventListener('mousedown', startAction);
        slider.addEventListener('mouseleave', stopAction);
        slider.addEventListener('mouseup', stopAction);
        slider.addEventListener('mousemove', moveAction);

        slider.addEventListener('touchstart', startAction, { passive: true });
        slider.addEventListener('touchend', stopAction);
        slider.addEventListener('touchmove', moveAction, { passive: true });
    }

    const cardLinks = document.querySelectorAll('.card-link');
    cardLinks.forEach(link => {
        const card = link.querySelector('.card');
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && !card.classList.contains('active')) {
                e.preventDefault();
                document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        });
    });
});
