// ===== FUNCIONALIDADES DA PÁGINA DE VÍDEOS =====

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página de vídeos carregada');
    
    // Configurar filtros
    setupFilters();
    
    // Configurar busca
    setupSearch();
    
    // Atualizar contador de vídeos
    updateVideoCount();
    
    // Configurar banner
    setupBanner();
});

// Configurar filtros de categoria
function setupFilters() {
    const filterButtons = document.querySelectorAll('.nav-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover classe active de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adicionar classe active ao botão clicado
            this.classList.add('active');
            
            // Filtrar vídeos
            const category = this.textContent.toLowerCase();
            filterVideosByCategory(category);
        });
    });
}

// Filtrar vídeos por categoria
function filterVideosByCategory(category) {
    const videoCards = document.querySelectorAll('.video-card');
    let visibleCount = 0;
    
    videoCards.forEach(card => {
        const cardCategory = card.dataset.category;
        
        if (category.includes('início') || category.includes('todos')) {
            card.style.display = 'block';
            visibleCount++;
        } else if (category.includes('destaque')) {
            const hasBadge = card.querySelector('.video-badge');
            if (hasBadge) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        } else if (cardCategory && cardCategory.includes(category.replace('🎬 ', '').replace('💬 ', '').replace('🎓 ', '').replace('💡 ', '').replace('📚 ', ''))) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Atualizar título e contador
    document.getElementById('current-section-title').textContent = category.charAt(0).toUpperCase() + category.slice(1);
    document.getElementById('videos-count').textContent = `${visibleCount} vídeos`;
}

// Configurar busca
function setupSearch() {
    const searchInput = document.getElementById('video-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterVideosBySearch(searchTerm);
        });
    }
}

// Filtrar vídeos por busca
function filterVideosBySearch(searchTerm) {
    const videoCards = document.querySelectorAll('.video-card');
    let visibleCount = 0;
    
    videoCards.forEach(card => {
        const title = card.dataset.title || '';
        const description = card.dataset.description || '';
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Atualizar contador
    document.getElementById('videos-count').textContent = `${visibleCount} vídeos`;
}

// Atualizar contador de vídeos
function updateVideoCount() {
    const videoCards = document.querySelectorAll('.video-card');
    document.getElementById('videos-count').textContent = `${videoCards.length} vídeos`;
}

// Abrir modal do vídeo
function openVideoModal(videoUrl, videoTitle) {
    const modal = document.getElementById('video-modal');
    const playerContainer = document.getElementById('video-player');
    const modalTitle = document.querySelector('.modal-title');
    
    if (!modal || !playerContainer) return;
    
    // Extrair ID do YouTube
    const videoId = extractYouTubeId(videoUrl);
    
    if (videoId) {
        console.log('Abrindo vídeo:', videoTitle, 'ID:', videoId);
        
        // Parâmetros do YouTube otimizados
        const embedUrl = `https://www.youtube.com/embed/${videoId}?` +
            'autoplay=1&' +           // Reproduzir automaticamente
            'controls=1&' +           // Manter controles básicos
            'modestbranding=1&' +     // Remover logo do YouTube
            'rel=0&' +                // Não mostrar vídeos relacionados
            'showinfo=0&' +           // Não mostrar informações do vídeo
            'iv_load_policy=3&' +     // Não carregar anotações
            'cc_load_policy=0&' +     // Não carregar legendas automáticas
            'fs=1&' +                 // Permitir tela cheia
            'playsinline=1&' +        // Reproduzir inline no mobile
            'enablejsapi=1';          // Habilitar API JavaScript
        
        playerContainer.innerHTML = `
            <iframe 
                src="${embedUrl}"
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowfullscreen
                style="width: 100%; height: 100%; border-radius: 8px;">
            </iframe>
        `;
    } else {
        console.error('ID do vídeo não encontrado para:', videoUrl);
        playerContainer.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #333; color: #fff; border-radius: 8px;">
                <p>Erro ao carregar o vídeo. <a href="${videoUrl}" target="_blank" style="color: #4ecdc4;">Assistir no YouTube</a></p>
            </div>
        `;
    }
    
    if (modalTitle) modalTitle.textContent = videoTitle;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Fechar modal do vídeo
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

// Extrair ID do YouTube
function extractYouTubeId(url) {
    if (!url) return null;
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// Configurar banner
function setupBanner() {
    const banner = document.getElementById('promo-banner');
    const closeBtn = document.querySelector('.banner-close');
    
    if (banner && closeBtn) {
        closeBtn.addEventListener('click', function() {
            banner.style.display = 'none';
            localStorage.setItem('bannerClosed', 'true');
        });
        
        // Verificar se o banner foi fechado anteriormente
        if (localStorage.getItem('bannerClosed') === 'true') {
            banner.style.display = 'none';
        }
    }
}

