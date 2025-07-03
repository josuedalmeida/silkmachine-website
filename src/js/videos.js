// ===== FUNCIONALIDADES DA PÁGINA DE VÍDEOS =====

document.addEventListener('DOMContentLoaded', function() {
    console.log('Página de vídeos inicializada');
    
    // Aguardar carregamento dos dados
    if (typeof window.videosData !== 'undefined') {
        initializeVideosPage();
    } else {
        // Aguardar um pouco para os dados carregarem
        setTimeout(() => {
            if (typeof window.videosData !== 'undefined') {
                initializeVideosPage();
            } else {
                console.error('Dados dos vídeos não encontrados');
            }
        }, 100);
    }
});

function initializeVideosPage() {
    console.log('Inicializando página de vídeos com', window.videosData.length, 'vídeos');
    
    // Renderizar vídeos em destaque
    renderFeaturedVideos();
    
    // Renderizar vídeos por categoria
    renderVideosByCategory();
    
    // Configurar filtros
    setupFilters();
    
    // Configurar busca
    setupSearch();
    
    // Configurar modal
    setupVideoModal();
}

function renderFeaturedVideos() {
    const featuredContainer = document.querySelector('.featured-carousel');
    if (!featuredContainer) return;
    
    const featuredVideos = window.videosData.filter(video => video.featured);
    
    if (featuredVideos.length === 0) {
        featuredContainer.innerHTML = '<p class="no-videos">Nenhum vídeo em destaque encontrado.</p>';
        return;
    }
    
    featuredContainer.innerHTML = featuredVideos.map(video => createVideoCard(video, true)).join('');
}

function renderVideosByCategory() {
    const categories = ['demonstracoes', 'depoimentos', 'treinamentos', 'dicas-negocio', 'tutoriais', 'novidades'];
    
    categories.forEach(category => {
        const categorySection = document.querySelector(`[data-category="${category}"] .videos-carousel`);
        if (!categorySection) return;
        
        const categoryVideos = window.videosData.filter(video => video.category === category);
        
        if (categoryVideos.length === 0) {
            categorySection.innerHTML = '<p class="no-videos">Nenhum vídeo encontrado nesta categoria.</p>';
            return;
        }
        
        categorySection.innerHTML = categoryVideos.map(video => createVideoCard(video, false)).join('');
    });
}

function createVideoCard(video, isFeatured = false) {
    const thumbnail = window.videoUtils.getYouTubeThumbnail(video.video_url);
    const duration = video.duration ? window.videoUtils.formatDuration(video.duration) : '';
    const date = window.videoUtils.formatDate(video.date);
    const category = window.videoUtils.formatCategory(video.category);
    const cardClass = isFeatured ? 'featured-video-card' : 'video-card';
    
    return `
        <div class="${cardClass}" data-category="${video.category}" data-tags="${video.tags.join(',')}">
            <div class="video-thumbnail">
                <img src="${thumbnail}" alt="${video.title}" loading="lazy">
                <div class="play-overlay">
                    <div class="play-button">▶</div>
                </div>
                ${duration ? `<div class="video-duration">${duration}</div>` : ''}
                ${video.featured ? '<div class="featured-badge">Destaque</div>' : ''}
            </div>
            <div class="video-info">
                <h${isFeatured ? '3' : '4'} class="video-title">${video.title}</h${isFeatured ? '3' : '4'}>
                <p class="video-description">${video.description.substring(0, 100)}${video.description.length > 100 ? '...' : ''}</p>
                <div class="video-meta">
                    <span class="video-category">${category}</span>
                    <span class="video-date">${date}</span>
                </div>
                <div class="video-tags">
                    ${video.tags.slice(0, 3).map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
            </div>
            <button class="watch-btn" data-video-url="${video.video_url}" data-video-title="${video.title}">
                <span class="btn-icon">▶</span>
                Assistir
            </button>
        </div>
    `;
}

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover classe active de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adicionar classe active ao botão clicado
            this.classList.add('active');
            
            const category = this.dataset.category;
            filterVideosByCategory(category);
        });
    });
}

function filterVideosByCategory(category) {
    const videoCards = document.querySelectorAll('.video-card, .featured-video-card');
    
    videoCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function setupSearch() {
    const searchInput = document.getElementById('video-search');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        searchVideos(searchTerm);
    });
}

function searchVideos(searchTerm) {
    const videoCards = document.querySelectorAll('.video-card, .featured-video-card');
    
    videoCards.forEach(card => {
        const title = card.querySelector('.video-title').textContent.toLowerCase();
        const description = card.querySelector('.video-description').textContent.toLowerCase();
        const tags = card.dataset.tags.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm) || tags.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function setupVideoModal() {
    const modal = document.getElementById('video-modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const closeBtn = document.querySelector('.modal-close');
    const playerContainer = document.getElementById('video-player');
    
    if (!modal) return;
    
    // Abrir modal ao clicar em "Assistir"
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('watch-btn') || e.target.closest('.watch-btn')) {
            const button = e.target.classList.contains('watch-btn') ? e.target : e.target.closest('.watch-btn');
            const videoUrl = button.dataset.videoUrl;
            const videoTitle = button.dataset.videoTitle;
            
            openVideoModal(videoUrl, videoTitle);
        }
    });
    
    // Fechar modal
    function closeModal() {
        modal.classList.remove('active');
        playerContainer.innerHTML = '';
        document.body.style.overflow = 'auto';
    }
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
    
    // Fechar com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

function openVideoModal(videoUrl, videoTitle) {
    const modal = document.getElementById('video-modal');
    const playerContainer = document.getElementById('video-player');
    const modalTitle = document.querySelector('.modal-title');
    
    if (!modal || !playerContainer) return;
    
    // Extrair ID do YouTube e criar embed
    const videoId = window.videoUtils.extractYouTubeId(videoUrl);
    
    if (videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        playerContainer.innerHTML = `
            <iframe 
                src="${embedUrl}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
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

