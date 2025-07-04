// ===== FUNCIONALIDADES DA PÁGINA DE VÍDEOS - LAYOUT SIDEBAR =====

document.addEventListener('DOMContentLoaded', function() {
    initializeVideosPage();
});

function initializeVideosPage() {
    if (!window.videosData) {
        console.error('Dados dos vídeos não encontrados');
        return;
    }
    
    renderAllVideos();
    setupEventListeners();
    updateVideosCount();
}

function setupEventListeners() {
    // Navegação da sidebar
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active de todos
            navItems.forEach(nav => nav.classList.remove('active'));
            // Adiciona active no clicado
            this.classList.add('active');
            
            const category = this.dataset.category;
            filterVideosByCategory(category);
            updateSectionTitle(category);
        });
    });
    
    // Busca de vídeos
    const searchInput = document.getElementById('video-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            searchVideos(searchTerm);
        });
    }
    
    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeVideoModal();
        }
    });
}

function renderAllVideos() {
    const container = document.getElementById('videos-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    window.videosData.forEach(video => {
        const videoCard = createVideoCard(video);
        container.appendChild(videoCard);
    });
}

function createVideoCard(video) {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.dataset.category = video.category;
    card.dataset.title = video.title.toLowerCase();
    card.dataset.description = video.description.toLowerCase();
    
    // Extrair ID do YouTube para thumbnail
    const videoId = window.videoUtils.extractYouTubeId(video.url);
    let thumbnailUrl = '/images/video-placeholder.jpg'; // Fallback padrão
    
    if (videoId) {
        // Tentar diferentes qualidades de thumbnail
        thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    
    card.innerHTML = `
        <div class="video-thumbnail">
            <img src="${thumbnailUrl}" 
                 alt="${video.title}"
                 onerror="this.onerror=null; this.src='https://img.youtube.com/vi/${videoId}/default.jpg';"
                 onload="this.style.opacity='1';"
                 style="opacity: 0; transition: opacity 0.3s ease;">
            <div class="play-overlay">
                <div class="play-button">▶</div>
            </div>
            ${video.featured ? '<div class="video-badge">⭐ Destaque</div>' : ''}
        </div>
        <div class="video-info">
            <h3 class="video-title">${video.title}</h3>
            <p class="video-description">${video.description}</p>
            <div class="video-meta">
                <span class="video-category">${getCategoryName(video.category)}</span>
                <span class="video-duration">${video.duration}</span>
            </div>
        </div>
    `;
    
    // Adicionar evento de clique
    card.addEventListener('click', () => {
        openVideoModal(video.url, video.title);
    });
    
    return card;
}

function getCategoryName(category) {
    const categoryNames = {
        'demonstracoes': '🎬 Demonstrações',
        'depoimentos': '💬 Depoimentos',
        'treinamentos': '🎓 Treinamentos',
        'dicas-negocio': '💡 Dicas de Negócio',
        'tutoriais': '📚 Tutoriais',
        'novidades': '🆕 Novidades'
    };
    return categoryNames[category] || category;
}

function filterVideosByCategory(category) {
    const cards = document.querySelectorAll('.video-card');
    
    cards.forEach(card => {
        if (category === 'all') {
            card.style.display = 'block';
        } else if (category === 'featured') {
            // Mostrar apenas vídeos em destaque
            const hasBadge = card.querySelector('.video-badge');
            card.style.display = hasBadge ? 'block' : 'none';
        } else {
            const cardCategory = card.dataset.category;
            card.style.display = cardCategory === category ? 'block' : 'none';
        }
    });
    
    updateVideosCount();
}

function searchVideos(searchTerm) {
    const cards = document.querySelectorAll('.video-card');
    
    cards.forEach(card => {
        const title = card.dataset.title;
        const description = card.dataset.description;
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    updateVideosCount();
}

function updateSectionTitle(category) {
    const titleElement = document.getElementById('current-section-title');
    if (!titleElement) return;
    
    const titles = {
        'all': 'Todos os Vídeos',
        'featured': '⭐ Vídeos em Destaque',
        'demonstracoes': '🎬 Demonstrações',
        'depoimentos': '💬 Depoimentos',
        'treinamentos': '🎓 Treinamentos',
        'dicas-negocio': '💡 Dicas de Negócio',
        'tutoriais': '📚 Tutoriais',
        'novidades': '🆕 Novidades'
    };
    
    titleElement.textContent = titles[category] || 'Vídeos';
}

function updateVideosCount() {
    const visibleCards = document.querySelectorAll('.video-card[style*="block"], .video-card:not([style*="none"])');
    const countElement = document.getElementById('videos-count');
    
    if (countElement) {
        const count = visibleCards.length;
        countElement.textContent = `${count} vídeo${count !== 1 ? 's' : ''}`;
    }
}

function openVideoModal(videoUrl, videoTitle) {
    const modal = document.getElementById('video-modal');
    const playerContainer = document.getElementById('video-player');
    const modalTitle = document.querySelector('.modal-title');
    
    if (!modal || !playerContainer) return;
    
    // Extrair ID do YouTube e criar embed
    const videoId = window.videoUtils.extractYouTubeId(videoUrl);
    
    if (videoId) {
        // Parâmetros corretos para manter controles básicos
        const embedUrl = `https://www.youtube.com/embed/${videoId}?` +
            `autoplay=1` +           // Reproduzir automaticamente
            `&controls=1` +          // ✅ MANTER controles básicos (play/pause, volume, progresso)
            `&rel=0` +               // ❌ REMOVER vídeos relacionados
            `&showinfo=0` +          // ❌ REMOVER informações do vídeo
            `&modestbranding=1` +    // ❌ REMOVER logo do YouTube
            `&iv_load_policy=3` +    // ❌ REMOVER anotações e pop-ups
            `&cc_load_policy=0` +    // ❌ REMOVER legendas automáticas
            `&fs=1` +                // ✅ MANTER botão tela cheia
            `&disablekb=0` +         // ✅ MANTER controles de teclado
            `&playsinline=1` +       // Reproduzir inline no mobile
            `&color=white` +         // Cor da barra de progresso
            `&theme=dark` +          // Tema escuro
            `&autohide=1`;           // Auto-ocultar controles
            
        playerContainer.innerHTML = `
            <iframe 
                src="${embedUrl}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowfullscreen>
            </iframe>
        `;
    } else {
        playerContainer.innerHTML = `
            <div class="error-message">
                <p>Não foi possível carregar o vídeo.</p>
                <a href="${videoUrl}" target="_blank" class="external-link">Assistir no YouTube</a>
            </div>
        `;
    }
    
    if (modalTitle) modalTitle.textContent = videoTitle;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    const playerContainer = document.getElementById('video-player');
    
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (playerContainer) {
        playerContainer.innerHTML = '';
    }
}

// Utilitários para extrair ID do YouTube
window.videoUtils = {
    extractYouTubeId: function(url) {
        if (!url) return null;
        
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
            /^([a-zA-Z0-9_-]{11})$/
        ];
        
        for (let pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        
        return null;
    }
};

// Responsividade - Toggle sidebar no mobile
function toggleSidebar() {
    const sidebar = document.querySelector('.videos-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

// Adicionar botão de menu no mobile (se necessário)
if (window.innerWidth <= 768) {
    const mainContent = document.querySelector('.videos-main');
    if (mainContent) {
        const menuButton = document.createElement('button');
        menuButton.innerHTML = '☰ Menu';
        menuButton.className = 'mobile-menu-btn';
        menuButton.style.cssText = `
            position: fixed;
            top: 1rem;
            left: 1rem;
            z-index: 1000;
            background: rgba(0,0,0,0.8);
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            cursor: pointer;
        `;
        menuButton.addEventListener('click', toggleSidebar);
        document.body.appendChild(menuButton);
    }
}


// ===== FUNÇÕES DO BANNER GERENCIÁVEL =====
function closeBanner() {
    const banner = document.getElementById('banner-section');
    if (banner) {
        banner.style.animation = 'slideUp 0.3s ease-out forwards';
        setTimeout(() => {
            banner.classList.add('hidden');
        }, 300);
        
        // Salvar no localStorage que o banner foi fechado
        localStorage.setItem('bannerClosed', 'true');
    }
}

// Verificar se o banner deve ser mostrado
function checkBannerVisibility() {
    const bannerClosed = localStorage.getItem('bannerClosed');
    const banner = document.getElementById('banner-section');
    
    if (bannerClosed === 'true' && banner) {
        banner.classList.add('hidden');
    }
}

// Adicionar animação de slideUp
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(-100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Verificar visibilidade do banner quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    checkBannerVisibility();
});

