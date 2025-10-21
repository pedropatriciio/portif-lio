// --- LÓGICA DE CONTROLE DO TSPARTICLES ---

let tsParticlesInstance = null;

// Função que contém a configuração e inicializa as partículas
function initParticles() {
    // Se já existir uma instância, não faz nada
    if (tsParticlesInstance) {
        return;
    }
    
    tsParticles.load("tsparticles", {
        background: {
            color: { value: "#0d1117" }
        },
        fpsLimit: 120,
        interactivity: {
            events: {
                onClick: { enable: true, mode: "push" },
                onHover: { enable: true, mode: "repulse" },
                resize: true
            },
            modes: {
                push: { quantity: 4 },
                repulse: { distance: 150, duration: 0.4 }
            }
        },
        particles: {
            color: { value: "#ffffff" },
            links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1
            },
            move: {
                direction: "none",
                enable: true,
                outModes: { default: "bounce" },
                random: false,
                speed: 1,
                straight: false
            },
            number: {
                density: { enable: true, area: 800 },
                value: 80
            },
            opacity: { value: 0.5 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } }
        },
        detectRetina: true
    }).then(container => {
        // Guarda a instância para poder destruí-la depois
        tsParticlesInstance = container;
    });
}

// Função para destruir a instância de partículas e liberar recursos
function destroyParticles() {
    if (tsParticlesInstance) {
        tsParticlesInstance.destroy();
        tsParticlesInstance = null;
    }
}


// --- LÓGICA DO EFEITO TEXT SCRAMBLE (sem alterações) ---
class TextScramble {
  constructor(el) { this.el = el; this.chars = '!<>-_\\/[]{}—=+*^?#_'; this.update = this.update.bind(this); }
  setText(newText) { const oldText = this.el.innerText; const length = Math.max(oldText.length, newText.length); const promise = new Promise((resolve) => (this.resolve = resolve)); this.queue = []; for (let i = 0; i < length; i++) { const from = oldText[i] || ''; const to = newText[i] || ''; const start = Math.floor(Math.random() * 40); const end = start + Math.floor(Math.random() * 40); this.queue.push({ from, to, start, end }); } cancelAnimationFrame(this.frameRequest); this.frame = 0; this.update(); return promise; }
  update() { let output = ''; let complete = 0; for (let i = 0, n = this.queue.length; i < n; i++) { let { from, to, start, end, char } = this.queue[i]; if (this.frame >= end) { complete++; output += to; } else if (this.frame >= start) { if (!char || Math.random() < 0.28) { char = this.randomChar(); this.queue[i].char = char; } output += `<span class="dud">${char}</span>`; } else { output += from; } } this.el.innerHTML = output; if (complete === this.queue.length) { this.resolve(); } else { this.frameRequest = requestAnimationFrame(this.update); this.frame++; } }
  randomChar() { return this.chars[Math.floor(Math.random() * this.chars.length)]; }
}


// --- INICIALIZAÇÃO GERAL DA PÁGINA ---
document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DE CONTROLE DE TEMA E PARTÍCULAS ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');

    // Função para aplicar o tema (claro ou escuro)
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            initParticles(); // Inicializa partículas no modo escuro
        } else {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            destroyParticles(); // Destrói partículas no modo claro
        }
    }

    // Verifica o tema salvo no localStorage ao carregar a página
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    // Evento de clique para trocar o tema
    themeToggleBtn.addEventListener('click', () => {
        let currentTheme = localStorage.getItem('theme') || 'light';
        let newTheme = currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });

    // --- INICIALIZAÇÃO DO TEXT SCRAMBLE ---
    const phrases = ['Estudante de Engenharia de Software', 'Desenvolvedor Front-End', 'CS/CX', 'Aspirante a DJ'];
    const el = document.getElementById('typing-effect');
    const fx = new TextScramble(el);
    let counter = 0;
    const next = () => { fx.setText(phrases[counter]).then(() => { setTimeout(next, 2500); }); counter = (counter + 1) % phrases.length; };
    next();

    // --- INICIALIZAÇÃO DE OUTRAS FUNCIONALIDADES (SCROLL, FILTROS, ETC.) ---
    
    // NAVEGAÇÃO SUAVE
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            window.scrollTo({ top: targetSection.offsetTop - 70, behavior: 'smooth' });
        });
    });

    // FILTRAGEM DE PROJETOS
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(button => button.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            document.querySelectorAll('.project-card').forEach(card => {
                card.style.display = (filter === 'all' || card.getAttribute('data-category') === filter) ? 'block' : 'none';
            });
        });
    });

    // ANIMAÇÕES DE ROLAGEM
    const sr = ScrollReveal({ origin: 'bottom', distance: '50px', duration: 1500, delay: 200, reset: true }); // Reset false para animar apenas uma vez
    sr.reveal('.hero-content', { origin: 'top' });
    sr.reveal('.about-section, .skills-section, .projects-section, .contact-section', { interval: 100 });
});