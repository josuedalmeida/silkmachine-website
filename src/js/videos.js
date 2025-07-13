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
            const carousel = section.querySelector('.video-carousel');
            if (carousel && carousel.dataset.category === category) {
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

// ===== ABRIR MODAL DO VÍDEO =====
function openVideoModal(videoUrl, videoTitle) {
    console.log('Abrindo vídeo:', videoTitle, 'ID:', videoUrl);
    
    const modal = document.getElementById('video-modal');
    const modalTitle = modal?.querySelector('.modal-title');
    const videoPlayer = document.getElementById('video-player');
    
    if (!modal || !videoPlayer) {
        console.error('Modal ou player não encontrado');
        return;
    }
    
    // Definir título
    if (modalTitle) {
        modalTitle.textContent = videoTitle || 'Vídeo';
    }
    
    // Limpar player anterior
    videoPlayer.innerHTML = '';
    
    // Determinar tipo de vídeo e criar embed
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        // YouTube
        const videoId = extractYouTubeId(videoUrl);
        if (videoId) {
            videoPlayer.innerHTML = `
                <iframe 
                    src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            `;
        } else {
            videoPlayer.innerHTML = '<p style="color: white; text-align: center; padding: 2rem;">Erro ao carregar vídeo do YouTube</p>';
        }
    } else if (videoUrl.includes('tiktok.com')) {
        // TikTok - usar embed oficial
        const tiktokId = videoUrl.match(/video\/(\d+)/)?.[1];
        if (tiktokId) {
            videoPlayer.innerHTML = `
                <iframe 
                    src="https://www.tiktok.com/embed/v2/${tiktokId}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            `;
        } else {
            // Fallback para TikTok
            videoPlayer.innerHTML = `
                <div style="background: linear-gradient(135deg, #ff0050, #000000); color: white; padding: 3rem; text-align: center; border-radius: 15px;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🎵</div>
                    <h3 style="margin-bottom: 1rem;">${videoTitle}</h3>
                    <p style="margin-bottom: 2rem; opacity: 0.8;">Este vídeo está disponível no TikTok</p>
                    <a href="${videoUrl}" target="_blank" style="background: white; color: #ff0050; padding: 1rem 2rem; border-radius: 25px; text-decoration: none; font-weight: 600; display: inline-block;">
                        Assistir no TikTok
                    </a>
                </div>
            `;
        }
    } else if (videoUrl.includes('instagram.com')) {
        // Instagram
        videoPlayer.innerHTML = `
            <div style="background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045); color: white; padding: 3rem; text-align: center; border-radius: 15px;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">📸</div>
                <h3 style="margin-bottom: 1rem;">${videoTitle}</h3>
                <p style="margin-bottom: 2rem; opacity: 0.8;">Este vídeo está disponível no Instagram</p>
                <a href="${videoUrl}" target="_blank" style="background: white; color: #833ab4; padding: 1rem 2rem; border-radius: 25px; text-decoration: none; font-weight: 600; display: inline-block;">
                    Assistir no Instagram
                </a>
            </div>
        `;
    } else if (videoUrl.includes('facebook.com')) {
        // Facebook
        videoPlayer.innerHTML = `
            <div style="background: linear-gradient(135deg, #1877f2, #42a5f5); color: white; padding: 3rem; text-align: center; border-radius: 15px;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">👥</div>
                <h3 style="margin-bottom: 1rem;">${videoTitle}</h3>
                <p style="margin-bottom: 2rem; opacity: 0.8;">Este vídeo está disponível no Facebook</p>
                <a href="${videoUrl}" target="_blank" style="background: white; color: #1877f2; padding: 1rem 2rem; border-radius: 25px; text-decoration: none; font-weight: 600; display: inline-block;">
                    Assistir no Facebook
                </a>
            </div>
        `;
    } else {
        // Formato não suportado
        videoPlayer.innerHTML = `
            <div style="background: rgba(255, 255, 255, 0.1); color: white; padding: 3rem; text-align: center; border-radius: 15px;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🎬</div>
                <h3 style="margin-bottom: 1rem;">${videoTitle}</h3>
                <p style="margin-bottom: 2rem; opacity: 0.8;">Clique no link abaixo para assistir</p>
                <a href="${videoUrl}" target="_blank" style="background: linear-gradient(45deg, #00d4ff, #ff6b6b); color: white; padding: 1rem 2rem; border-radius: 25px; text-decoration: none; font-weight: 600; display: inline-block;">
                    Assistir Vídeo
                </a>
            </div>
        `;
    }
    
    // Mostrar modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// ===== FECHAR MODAL DO VÍDEO =====
function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    const videoPlayer = document.getElementById('video-player');
    
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    if (videoPlayer) {
        videoPlayer.innerHTML = '';
    }
}

// ===== FUNÇÕES GLOBAIS (para compatibilidade) =====
window.openVideoModal = openVideoModal;
window.closeVideoModal = closeVideoModal;

