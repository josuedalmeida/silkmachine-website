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
    
    console.log('Abrindo vídeo:', videoTitle, 'URL:', videoUrl);
    
    // Detectar plataforma e processar adequadamente
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        // YouTube
        const videoId = extractYouTubeId(videoUrl);
        
        if (videoId) {
            console.log('YouTube ID encontrado:', videoId);
            
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
            console.error('ID do YouTube não encontrado para:', videoUrl);
            showVideoError(playerContainer, videoUrl, 'YouTube');
        }
    } else if (videoUrl.includes('tiktok.com')) {
        // TikTok - não pode ser embedado, mostrar link direto
        console.log('Vídeo do TikTok detectado:', videoUrl);
        playerContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: linear-gradient(135deg, #ff0050, #00f2ea); color: #fff; border-radius: 8px; text-align: center; padding: 20px;">
                <div style="font-size: 48px; margin-bottom: 20px;">🎵</div>
                <h3 style="margin: 0 0 10px 0; font-size: 18px;">Vídeo do TikTok</h3>
                <p style="margin: 0 0 20px 0; opacity: 0.9;">Este vídeo está disponível no TikTok</p>
                <a href="${videoUrl}" target="_blank" style="background: rgba(255,255,255,0.2); color: #fff; padding: 12px 24px; border-radius: 25px; text-decoration: none; font-weight: bold; border: 2px solid rgba(255,255,255,0.3); transition: all 0.3s ease;">
                    🚀 Assistir no TikTok
                </a>
            </div>
        `;
    } else if (videoUrl.includes('instagram.com')) {
        // Instagram - não pode ser embedado facilmente, mostrar link direto
        console.log('Vídeo do Instagram detectado:', videoUrl);
        playerContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045); color: #fff; border-radius: 8px; text-align: center; padding: 20px;">
                <div style="font-size: 48px; margin-bottom: 20px;">📸</div>
                <h3 style="margin: 0 0 10px 0; font-size: 18px;">Vídeo do Instagram</h3>
                <p style="margin: 0 0 20px 0; opacity: 0.9;">Este vídeo está disponível no Instagram</p>
                <a href="${videoUrl}" target="_blank" style="background: rgba(255,255,255,0.2); color: #fff; padding: 12px 24px; border-radius: 25px; text-decoration: none; font-weight: bold; border: 2px solid rgba(255,255,255,0.3); transition: all 0.3s ease;">
                    🚀 Assistir no Instagram
                </a>
            </div>
        `;
    } else {
        // Outras plataformas ou URLs diretas
        console.log('Plataforma não reconhecida:', videoUrl);
        showVideoError(playerContainer, videoUrl, 'Plataforma não suportada');
    }
    
    if (modalTitle) modalTitle.textContent = videoTitle;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Mostrar erro de vídeo
function showVideoError(container, videoUrl, platform) {
    container.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: #333; color: #fff; border-radius: 8px; text-align: center; padding: 20px;">
            <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
            <h3 style="margin: 0 0 10px 0;">Erro ao carregar o vídeo</h3>
            <p style="margin: 0 0 20px 0; opacity: 0.7;">Não foi possível reproduzir este vídeo (${platform})</p>
            <a href="${videoUrl}" target="_blank" style="background: #4ecdc4; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                🚀 Assistir na plataforma original
            </a>
        </div>
    `;
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
    
    // Regex melhorado para capturar diferentes formatos de URL do YouTube
    const patterns = [
        /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,           // youtube.com/watch?v=ID
        /(?:youtube\.com\/embed\/)([^&\n?#]+)/,             // youtube.com/embed/ID
        /(?:youtube\.com\/v\/)([^&\n?#]+)/,                 // youtube.com/v/ID
        /(?:youtu\.be\/)([^&\n?#]+)/,                       // youtu.be/ID
        /(?:youtube\.com\/shorts\/)([^&\n?#]+)/,            // youtube.com/shorts/ID
        /(?:youtube\.com\/.*[?&]v=)([^&\n?#]+)/             // Outros formatos com v=
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            console.log('YouTube ID encontrado:', match[1], 'para URL:', url);
            return match[1];
        }
    }
    
    console.log('YouTube ID não encontrado para URL:', url);
    return null;
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

