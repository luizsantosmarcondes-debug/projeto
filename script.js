// ============================================
// BARRA DE PROGRESSO DE SCROLL
// ============================================
const progressBar = document.getElementById('progressBar');

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
});

// ============================================
// HEADER AO ROLAR
// ============================================
const header = document.querySelector('.header');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

// ============================================
// BOTÃO VOLTAR AO TOPO
// ============================================
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================
// MENU MOBILE
// ============================================
const menuToggle = document.getElementById('menuToggle');
const nav = document.querySelector('.nav');

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
});

document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
    });
});

// ============================================
// SCROLL SUAVE
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    });
});

// ============================================
// CONTADOR DE ESTATÍSTICAS (ANIMAÇÃO)
// ============================================
const stats = document.querySelectorAll('.stat h3[data-count]');
let statsAnimated = false;

function animateStats() {
    if (statsAnimated) return;

    stats.forEach(stat => {
        const target = parseInt(stat.dataset.count);
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);

            stat.textContent = current.toLocaleString('pt-BR') +
                (target === 40000 || target === 3000 || target === 1300 ? '+' : '');

            if (progress < 1) requestAnimationFrame(update);
            else {
                stat.textContent = target.toLocaleString('pt-BR') +
                    (target === 40000 || target === 3000 || target === 1300 ? '+' : '');
            }
        }

        requestAnimationFrame(update);
    });

    statsAnimated = true;
}

// Ativa ao entrar na seção hero
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) animateStats();
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);

// ============================================
// PARTÍCULAS DE FOLHAS
// ============================================
const leafContainer = document.getElementById('leafParticles');
const leafEmojis = ['🍃', '🌿', '🍂'];

function createLeaf() {
    const leaf = document.createElement('span');
    leaf.className = 'leaf-particle';
    leaf.textContent = leafEmojis[Math.floor(Math.random() * leafEmojis.length)];
    leaf.style.left = Math.random() * 100 + '%';
    leaf.style.animationDuration = (8 + Math.random() * 8) + 's';
    leaf.style.animationDelay = Math.random() * 5 + 's';
    leaf.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
    leafContainer.appendChild(leaf);

    setTimeout(() => leaf.remove(), 16000);
}

// Cria folhas continuamente
for (let i = 0; i < 12; i++) {
    setTimeout(createLeaf, i * 500);
}
setInterval(createLeaf, 1500);

// ============================================
// REVEAL ANIMATION (SCROLL)
// ============================================
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
    revealObserver.observe(el);
});

// ============================================
// POLL (ENQUETE INTERATIVA)
// ============================================
const pollData = {
    sim: 0,
    talvez: 0,
    nao: 0
};

const pollOptions = document.querySelectorAll('.poll-option');
const pollResults = document.getElementById('pollResults');
const pollOptionsContainer = document.getElementById('pollOptions');

let voted = false;

pollOptions.forEach(option => {
    option.addEventListener('click', () => {
        if (voted) return;

        const choice = option.dataset.option;
        pollData[choice]++;

        // Simula votos anteriores (para parecer real)
        if (pollData.sim === 0) {
            pollData.sim = Math.floor(Math.random() * 40) + 45;
            pollData.talvez = Math.floor(Math.random() * 20) + 15;
            pollData.nao = Math.floor(Math.random() * 10) + 5;
        }

        // Marca a opção escolhida
        option.classList.add('selected');

        // Esconde opções e mostra resultados
        setTimeout(() => {
            pollOptionsContainer.style.display = 'none';
            pollResults.classList.add('active');
            updatePollResults();
        }, 500);

        voted = true;
    });
});

function updatePollResults() {
    const total = pollData.sim + pollData.talvez + pollData.nao;

    const percents = {
        sim: Math.round((pollData.sim / total) * 100),
        talvez: Math.round((pollData.talvez / total) * 100),
        nao: Math.round((pollData.nao / total) * 100)
    };

    // Descobre o maior valor para destacar
    const maxKey = Object.keys(percents).reduce((a, b) =>
        percents[a] > percents[b] ? a : b
    );

    Object.keys(percents).forEach(key => {
        const percentEl = document.querySelector(`[data-percent="${key}"]`);
        const fillEl = document.querySelector(`[data-fill="${key}"]`);

        percentEl.textContent = percents[key] + '%';
        fillEl.style.width = percents[key] + '%';

        if (key === maxKey) {
            fillEl.classList.add('highlight');
        }
    });
}

// ============================================
// CONTADOR DE "EU QUERO PROTEGER"
// ============================================
const joinBtn = document.getElementById('joinBtn');
const joinCount = document.getElementById('joinCount');

// Carrega do localStorage
let totalJoins = parseInt(localStorage.getItem('amazoniaJoins') || '1247');
joinCount.textContent = totalJoins.toLocaleString('pt-BR');

joinBtn.addEventListener('click', () => {
    totalJoins++;
    localStorage.setItem('amazoniaJoins', totalJoins);

    joinCount.textContent = totalJoins.toLocaleString('pt-BR');
    joinCount.classList.add('pulse');

    // Efeito de folhas voando
    for (let i = 0; i < 8; i++) {
        setTimeout(createLeaf, i * 100);
    }

    setTimeout(() => joinCount.classList.remove('pulse'), 500);

    joinBtn.style.transform = 'scale(0.95)';
    setTimeout(() => joinBtn.style.transform = '', 150);
});

// ============================================
// MODAL DE ESPÉCIES
// ============================================
const speciesData = {
    'Onça-pintada': 'A onça-pintada (Panthera onca) é o maior felino das Américas e o terceiro maior do mundo. Na Amazônia, é o predador de topo da cadeia alimentar, essencial para o equilíbrio do ecossistema. Estima-se que a população tenha caído 50% em 20 anos, principalmente pela perda de habitat e caça ilegal.',
    'Arara-azul': 'A arara-azul (Anodorhynchus hyacinthinus) é a maior arara do mundo, podendo atingir 1 metro de comprimento. Sua beleza única a tornou alvo do tráfico, quase levando à extinção nos anos 80. Hoje, projetos de conservação conseguiram recuperar parte da população, mas ainda é vulnerável.',
    'Boto-cor-de-rosa': 'O boto-cor-de-rosa (Inia geoffrensis) é um golfinho de água doce que habita os rios amazônicos. Sua coloração rosada é única entre os cetáceos. É um animal inteligente e essencial para o ecossistema aquático da Amazônia, mas sofre com a poluição e a pesca acidental.',
    'Preguiça-real': 'A preguiça-real (Bradypus tridactylus) vive nas copas das árvores amazônicas e se alimenta principalmente de folhas. Apesar da fama de lenta, é essencial para a dispersão de sementes na floresta. Sua maior ameaça é o desmatamento, que destrói seu habitat natural.',
    'Tucano-toco': 'O tucano-toco (Ramphastos toco) é o maior tucano do mundo, com um bico colorido que pode medir até 20 cm. É uma ave dispersora de sementes fundamental para a regeneração da floresta. Apesar de ainda ser comum, sofre com o tráfico de animais silvestres.',
    'Macaco-aranha': 'O macaco-aranha (Ateles paniscus) é conhecido por sua agilidade e cauda preênsil que funciona como uma quinta mão. Vive em grupos sociais complexos e depende de grandes áreas preservadas. Está em perigo devido ao desmatamento e à caça.'
};

document.querySelectorAll('.fauna-card').forEach(card => {
    card.addEventListener('click', () => {
        const title = card.querySelector('.fauna-info h3').textContent.trim().replace(/^[^\w]+\s*/, '');
        const img = card.querySelector('.fauna-img img').src;
        const text = speciesData[title] || 'Informações em breve.';

        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalText').textContent = text;
        document.getElementById('modalImg').src = img;
        document.getElementById('speciesModal').classList.add('active');

        document.body.style.overflow = 'hidden';
    });
});

document.getElementById('modalClose').addEventListener('click', closeModal);

document.getElementById('speciesModal').addEventListener('click', (e) => {
    if (e.target.id === 'speciesModal') closeModal();
});

function closeModal() {
    document.getElementById('speciesModal').classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// ============================================
// LOG DE INICIALIZAÇÃO
// ============================================
console.log('%c🌿 Amazônia Viva carregada com sucesso!', 
    'color: #2ecc71; font-size: 16px; font-weight: bold;');
console.log('💚 Cada escolha protege uma vida.');