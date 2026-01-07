// === TYPEWRITER ===
const texts = ['@__vinizzzk', 'Não pertube', '/coding'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterElement = document.getElementById('typewriterText');

function typeWriter() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
        typewriterElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let typeSpeed = isDeleting ? 100 : 150;
    
    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500;
    }
    
    setTimeout(typeWriter, typeSpeed);
}

// === VIEWS ===
async function updateViewCount() {
    try {
        const response = await fetch('/api/views', { method: 'POST', headers: { 'Content-Type': 'application/json' }});
        if (response.ok) {
            const data = await response.json();
            document.getElementById('viewCount').textContent = data.views;
        }
    } catch (error) {
        console.error('Erro ao atualizar visualizações:', error);
        document.getElementById('viewCount').textContent = '0';
    }
}

async function loadViewCount() {
    try {
        const response = await fetch('/api/views');
        if (response.ok) {
            const data = await response.json();
            document.getElementById('viewCount').textContent = data.views;
        }
    } catch (error) {
        console.error('Erro ao carregar visualizações:', error);
        document.getElementById('viewCount').textContent = '0';
    }
}

// === GITHUB STATS ===
const githubUser = "vinizzzk"; // Substitua pelo seu GitHub
const followersEl = document.querySelector(".github-stats span:nth-child(1)");
const reposEl = document.querySelector(".github-stats span:nth-child(2)");

async function fetchGitHubStats() {
    try {
        const response = await fetch(`https://api.github.com/users/${githubUser}`);
        const data = await response.json();

        followersEl.innerHTML = `<img src="IMGS/flaviicons/do-utilizador.png" alt="Seguidores" class="stat-icon"> ${data.followers} Seguidores`;
        reposEl.innerHTML = `<img src="IMGS/flaviicons/envelope.png" alt="Repositórios" class="stat-icon"> ${data.public_repos} Repos`;
    } catch (error) {
        console.error("Erro ao buscar dados do GitHub:", error);
    }
}

// Atualiza automaticamente a cada 30 segundos (30000 ms)
setInterval(fetchGitHubStats, 30000);

// Chamada inicial
fetchGitHubStats();

// === DOM CONTENT LOADED ===
document.addEventListener('DOMContentLoaded', function() {
    const entryScreen = document.getElementById('entryScreen');
    const mainContent = document.getElementById('mainContent');
    const bgAudio = document.getElementById('bgAudio');

    loadViewCount();

    entryScreen.addEventListener('click', function() {
        entryScreen.classList.add('hidden');

        setTimeout(() => {
            mainContent.classList.add('visible');

            if (bgAudio) bgAudio.play().catch(e => console.log('Áudio não pôde ser reproduzido automaticamente'));

            setTimeout(() => { typeWriter(); }, 1000);

            updateViewCount();
        }, 500);
    });

    // Animação badges
    const badges = document.querySelectorAll('.badges img');
    badges.forEach((badge, index) => {
        badge.style.animationDelay = `${index * 0.2}s`;
        badge.style.animation = 'fadeIn 1s ease-in-out both';
    });

    // Links sociais hover
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() { this.style.transform = 'scale(1.1) rotateY(10deg)'; });
        link.addEventListener('mouseleave', function() { this.style.transform = 'scale(1) rotateY(0deg)'; });
    });
});