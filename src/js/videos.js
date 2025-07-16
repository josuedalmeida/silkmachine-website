// ===== PÁGINA DE VÍDEOS - JAVASCRIPT COMPLETO =====

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    // Configurar busca
    setupSearch();
    
    // Configurar filtros
    setupFilters();
    
    // Configurar carrosséis
    setupCarousels();
    
    // Configurar modal
    setupModal();
});

// ===== CONFIGURAÇÃO DE BUSCA =====
function setupSearch() {
    const searchInput = document.getElementById('video-search');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        filterVideos(searchTerm);
    });
}

// ===== CONFIGURAÇÃO DE FILTROS =====
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adiciona active ao botão clicado
            this.classList.add('active');
            
            // Filtra por categoria
            const category = this.dataset.category;
            filterByCategory(category);
        });
    });
}

// ===== FILTRAR VÍDEOS =====
function filterVideos(searchTerm) {
    const videoCards = document.querySelectorAll('.video-card-small');
    let visibleCount = 0;
    
    videoCards.forEach(card => {
        const title = card.dataset.title || '';
        const description = card.dataset.description || '';
        const tags = card.dataset.tags || '';
        
        const isVisible = title.includes(searchTerm) || 
                         description.includes(searchTerm) || 
                         tags.includes(searchTerm);
        
        if (isVisible) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Atualizar visibilidade das seções
    updateSectionVisibility();
}

// ===== FILTRAR POR CATEGORIA =====
function filterByCategory(category) {
    const carouselSections = document.querySelectorAll('.carousel-section');
    
    if (category === 'all') {
        // Mostrar todas as seções
        carouselSections.forEach(section => {
            section.style.display = 'block';
        });
    } else {
        // Mostrar apenas a seção da categoria selecionada
        carouselSections.forEach(section => {
            if (section.dataset.category === category) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    }
}

// ===== ATUALIZAR VISIBILIDADE DAS SEÇÕES =====
function updateSectionVisibility() {
    const carouselSections = document.querySelectorAll('.carousel-section');
    
    carouselSections.forEach(section => {
        const visibleCards = section.querySelectorAll('.video-card-small[style*="block"], .video-card-small:not([style*="none"])');
        
        if (visibleCards.length === 0) {
            section.style.display = 'none';
        } else {
            section.style.display = 'block';
        }
    });
}

// ===== CONFIGURAÇÃO DOS CARROSSÉIS =====
function setupCarousels() {
    const carousels = document.querySelectorAll('.video-carousel');
    
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const prevBtn = carousel.querySelector('.carousel-prev');
        const nextBtn = carousel.querySelector('.carousel-next');
        
        if (!track || !prevBtn || !nextBtn) return;
        
        const cardWidth = 180 + 16; // largura do card + gap
        let currentPosition = 0;
        
        // Botão anterior
        prevBtn.addEventListener('click', () => {
            const maxScroll = track.scrollWidth - track.clientWidth;
            currentPosition = Math.max(0, currentPosition - cardWidth * 3);
            track.scrollTo({
                left: currentPosition,
                behavior: 'smooth'
            });
            updateCarouselButtons(carousel, currentPosition, maxScroll);
        });
        
        // Botão próximo
        nextBtn.addEventListener('click', () => {
            const maxScroll = track.scrollWidth - track.clientWidth;
            currentPosition = Math.min(maxScroll, currentPosition + cardWidth * 3);
            track.scrollTo({
                left: currentPosition,
                behavior: 'smooth'
            });
            updateCarouselButtons(carousel, currentPosition, maxScroll);
        });
        
        // Atualizar estado inicial dos botões
        track.addEventListener('scroll', () => {
            currentPosition = track.scrollLeft;
            const maxScroll = track.scrollWidth - track.clientWidth;
            updateCarouselButtons(carousel, currentPosition, maxScroll);
        });
        
        // Estado inicial
        const maxScroll = track.scrollWidth - track.clientWidth;
        updateCarouselButtons(carousel, 0, maxScroll);
    });
}

// ===== ATUALIZAR BOTÕES DO CARROSSEL =====
function updateCarouselButtons(carousel, currentPosition, maxScroll) {
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    
    if (prevBtn) {
        prevBtn.style.opacity = currentPosition <= 0 ? '0.5' : '1';
        prevBtn.style.pointerEvents = currentPosition <= 0 ? 'none' : 'auto';
    }
    
    if (nextBtn) {
        nextBtn.style.opacity = currentPosition >= maxScroll ? '0.5' : '1';
        nextBtn.style.pointerEvents = currentPosition >= maxScroll ? 'none' : 'auto';
    }
}

// ===== CONFIGURAÇÃO DO MODAL =====
function setupModal() {
    const modal = document.getElementById('video-modal');
    const overlay = modal?.querySelector('.modal-overlay');
    const closeBtn = modal?.querySelector('.modal-close');
    
    if (!modal) return;
    
    // Fechar modal clicando no overlay
    overlay?.addEventListener('click', closeVideoModal);
    
    // Fechar modal clicando no botão X
    closeBtn?.addEventListener('click', closeVideoModal);
    
    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeVideoModal();
        }
    });
}

// ===== EXTRAIR ID DO YOUTUBE =====
function extractYouTubeId(url) {
    console.log('Extraindo ID do YouTube para:', url);
    
    if (!url) return null;
    
    // Regex mais robusta para diferentes formatos de URL do YouTube
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
        /^([a-zA-Z0-9_-]{11})$/ // ID direto
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
            console.log('ID extraído:', match[1]);
            return match[1];
        }
    }
    
    console.log('ID do vídeo não encontrado para:', url);
    return null;
}

// ===== DETECTAR PROPORÇÃO DO VÍDEO =====
function detectVideoAspectRatio(videoUrl, platform) {
    // YouTube Shorts são sempre verticais (9:16)
    if (videoUrl.includes('/shorts/')) {
        return '9x16';
    }
    
    // TikTok é sempre vertical (9:16)
    if (platform === 'tiktok' || videoUrl.includes('tiktok.com')) {
        return '9x16';
    }
    
    // Instagram Stories/Reels são geralmente verticais
    if (platform === 'instagram' || videoUrl.includes('instagram.com')) {
        if (videoUrl.includes('/reel/') || videoUrl.includes('/stories/')) {
            return '9x16';
        }
        return '16x9'; // Posts normais do Instagram
    }
    
    // YouTube normal é horizontal (16:9)
    if (platform === 'youtube' || videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        return '16x9';
    }
    
    // Facebook vídeos são geralmente horizontais
    if (platform === 'facebook' || videoUrl.includes('facebook.com')) {
        return '16x9';
    }
    
    // Default para horizontal
    return '16x9';
}

// ===== ABRIR MODAL DO VÍDEO =====
function openVideoModal(videoUrl, videoTitle) {
    console.log('Abrindo vídeo:', videoTitle, 'URL:', videoUrl);
    
    const modal = document.getElementById('video-modal');
    const modalTitle = modal?.querySelector('.modal-title');
    const videoPlayer = document.getElementById('video-player');
    
    if (!modal || !videoPlayer) {
        console.error('Modal ou player não encontrado');
        return;
    }
    
    // Detectar proporção do vídeo
    const aspectRatio = detectVideoAspectRatio(videoUrl);
    console.log('Proporção detectada:', aspectRatio);
    
    // Aplicar classes CSS baseadas na proporção
    modal.classList.remove('video-modal--horizontal', 'video-modal--vertical');
    if (aspectRatio === '9x16') {
        modal.classList.add('video-modal--vertical');
    } else {
        modal.classList.add('video-modal--horizontal');
    }
    
    // Definir título
    if (modalTitle) {
        modalTitle.textContent = videoTitle || 'Vídeo';
    }
    
    // Limpar player anterior
    videoPlayer.innerHTML = '';
    
    // Criar container responsivo
    const videoContainer = document.createElement('div');
    videoContainer.className = `video-container video-container--${aspectRatio}`;
    
    // Determinar tipo de vídeo e criar embed
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        // YouTube
        const videoId = extractYouTubeId(videoUrl);
        if (videoId) {
            videoContainer.innerHTML = `
                <iframe 
                    src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen
                    onload="this.parentElement.classList.add('loaded')">
                </iframe>
            `;
        } else {
            videoContainer.innerHTML = `
                <div class="video-placeholder">
                    <div>
                        <h3>Erro ao carregar vídeo</h3>
                        <p>Não foi possível carregar o vídeo do YouTube</p>
                        <a href="${videoUrl}" target="_blank" class="btn">Assistir no YouTube</a>
                    </div>
                </div>
            `;
        }
    } else if (videoUrl.includes('tiktok.com')) {
        // TikTok - usar embed oficial
        const tiktokId = videoUrl.match(/video\/(\d+)/)?.[1];
        if (tiktokId) {
            videoContainer.innerHTML = `
                <iframe 
                    src="https://www.tiktok.com/embed/v2/${tiktokId}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen
                    onload="this.parentElement.classList.add('loaded')">
                </iframe>
            `;
        } else {
            // Fallback para TikTok
            videoContainer.innerHTML = `
                <div class="video-placeholder">
                    <div style="background: linear-gradient(135deg, #ff0050, #000000); color: white; padding: 3rem; text-align: center; border-radius: 15px; height: 100%;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">🎵</div>
                        <h3 style="margin-bottom: 1rem;">${videoTitle}</h3>
                        <p style="margin-bottom: 2rem; opacity: 0.8;">Este vídeo está disponível no TikTok</p>
                        <a href="${videoUrl}" target="_blank" class="btn" style="background: white; color: #ff0050;">
                            Assistir no TikTok
                        </a>
                    </div>
                </div>
            `;
        }
    } else if (videoUrl.includes('instagram.com')) {
        // Instagram
        videoContainer.innerHTML = `
            <div class="video-placeholder">
                <div style="background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045); color: white; padding: 3rem; text-align: center; border-radius: 15px; height: 100%;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📸</div>
                    <h3 style="margin-bottom: 1rem;">${videoTitle}</h3>
                    <p style="margin-bottom: 2rem; opacity: 0.8;">Este vídeo está disponível no Instagram</p>
                    <a href="${videoUrl}" target="_blank" class="btn" style="background: white; color: #833ab4;">
                        Assistir no Instagram
                    </a>
                </div>
            </div>
        `;
    } else if (videoUrl.includes('facebook.com')) {
        // Facebook
        videoContainer.innerHTML = `
            <div class="video-placeholder">
                <div style="background: linear-gradient(135deg, #1877f2, #42a5f5); color: white; padding: 3rem; text-align: center; border-radius: 15px; height: 100%;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">👥</div>
                    <h3 style="margin-bottom: 1rem;">${videoTitle}</h3>
                    <p style="margin-bottom: 2rem; opacity: 0.8;">Este vídeo está disponível no Facebook</p>
                    <a href="${videoUrl}" target="_blank" class="btn" style="background: white; color: #1877f2;">
                        Assistir no Facebook
                    </a>
                </div>
            </div>
        `;
    } else {
        // Formato não suportado
        videoContainer.innerHTML = `
            <div class="video-placeholder">
                <div>
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🎬</div>
                    <h3 style="margin-bottom: 1rem;">${videoTitle}</h3>
                    <p style="margin-bottom: 2rem; opacity: 0.8;">Clique no link abaixo para assistir</p>
                    <a href="${videoUrl}" target="_blank" class="btn">
                        Assistir Vídeo
                    </a>
                </div>
            </div>
        `;
    }
    
    // Adicionar container ao player
    videoPlayer.appendChild(videoContainer);
    
    // Mostrar modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Log para debug
    console.log('Modal configurado com proporção:', aspectRatio);
}

// ===== FECHAR MODAL DO VÍDEO =====
function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    const videoPlayer = document.getElementById('video-player');
    
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Remover classes de proporção
        modal.classList.remove('video-modal--horizontal', 'video-modal--vertical');
    }
    
    if (videoPlayer) {
        videoPlayer.innerHTML = '';
    }
}

// ===== FUNÇÕES GLOBAIS (para compatibilidade) =====
window.openVideoModal = openVideoModal;
window.closeVideoModal = closeVideoModal;

