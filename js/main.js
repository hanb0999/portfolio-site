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

    const cardLinks = document.querySelectorAll('.card-link');
    cardLinks.forEach(link => {
        const card = link.querySelector('.card');
        link.addEventListener('click', () => {
            document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            card.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        });
    });

    const slider = document.querySelector('.gallery-wrapper');
    if (slider) {
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
        });
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
        });
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const bar = document.getElementById('handler-bar');
    const logoFill = document.getElementById('handler-logo-fill');
    const screen = document.getElementById('loading-screen');
    let progress = 0;

    if (!screen) return; 

    document.body.style.overflow = 'hidden';

    const interval = setInterval(() => {
        if (progress < 90) {
            progress += Math.random() * 3 + 1; 
            if (progress > 90) progress = 90;
            
            if (bar) bar.style.width = progress + '%';
            if (logoFill) logoFill.style.height = progress + '%';
        }
    }, 400);

    const finishLoading = () => {
        clearInterval(interval);
        if (bar) bar.style.width = '100%';
        if (logoFill) logoFill.style.height = '100%';

        setTimeout(() => {
            screen.classList.add('loaded'); 
            document.body.style.overflow = ''; 
        }, 800);
    };

    if (document.readyState === 'complete') {
        finishLoading();
    } else {
        window.addEventListener('load', finishLoading);
    }
});
