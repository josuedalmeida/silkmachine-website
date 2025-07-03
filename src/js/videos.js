// ===== FUNCIONALIDADES DA PÁGINA DE VÍDEOS =====

document.addEventListener('DOMContentLoaded', function() {
    initializeVideosPage();
});

function initializeVideosPage() {
    // Inicializar componentes
    initializeSearch();
    initializeFilters();
    initializeVideoModal();
    initializeCarousels();
    initializeLazyLoading();
    
    console.log('Página de vídeos inicializada');
}

// ===== SISTEMA DE BUSCA =====
function initializeSearch() {
    const searchInput = document.getElementById('video-search');
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = this.value.toLowerCase().trim();
            filterVideos(searchTerm);
        }, 300);
    });
}

function filterVideos(searchTerm) {
    const videoCards = document.querySelectorAll('.video-card, .featured-video-card');
    const categorySections = document.querySelectorAll('.category-section');
    
    videoCards.forEach(card => {
        const title = card.querySelector('.video-title')?.textContent.toLowerCase() || '';
        const description = card.querySelector('.video-description')?.textContent.toLowerCase() || '';
        const tags = card.dataset.tags?.toLowerCase() || '';
        const category = card.dataset.category?.toLowerCase() || '';
        
        const matches = title.includes(searchTerm) || 
                       description.includes(searchTerm) || 
                       tags.includes(searchTerm) || 
                       category.includes(searchTerm);
        
        if (searchTerm === '' || matches) {
            card.classList.remove('hidden');
            card.style.display = '';
        } else {
            card.classList.add('hidden');
            card.style.display = 'none';
        }
    });
    
    // Mostrar/ocultar seções baseado nos vídeos visíveis
    categorySections.forEach(section => {
        const visibleVideos = section.querySelectorAll('.video-card:not(.hidden)');
        if (visibleVideos.length > 0 || searchTerm === '') {
            section.classList.remove('hidden');
            section.style.display = '';
        } else {
            section.classList.add('hidden');
            section.style.display = 'none';
        }
    });
}

// ===== SISTEMA DE FILTROS POR CATEGORIA =====
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover classe active de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adicionar classe active ao botão clicado
            this.classList.add('active');
            
            const category = this.dataset.category;
            filterByCategory(category);
        });
    });
}

function filterByCategory(category) {
    const videoCards = document.querySelectorAll('.video-card, .featured-video-card');
    const categorySections = document.querySelectorAll('.category-section');
    const featuredSection = document.querySelector('.featured-videos');
    
    // Limpar busca
    const searchInput = document.getElementById('video-search');
    if (searchInput) searchInput.value = '';
    
    if (category === 'all') {
        // Mostrar todos os vídeos
        videoCards.forEach(card => {
            card.classList.remove('hidden');
            card.style.display = '';
        });
        
        categorySections.forEach(section => {
            section.classList.remove('hidden');
            section.style.display = '';
        });
        
        if (featuredSection) {
            featuredSection.style.display = '';
        }
    } else {
        // Filtrar por categoria específica
        videoCards.forEach(card => {
            if (card.dataset.category === category) {
                card.classList.remove('hidden');
                card.style.display = '';
            } else {
                card.classList.add('hidden');
                card.style.display = 'none';
            }
        });
        
        categorySections.forEach(section => {
            if (section.dataset.category === category) {
                section.classList.remove('hidden');
                section.style.display = '';
            } else {
                section.classList.add('hidden');
                section.style.display = 'none';
            }
        });
        
        // Ocultar seção de destaques se não for "all"
        if (featuredSection) {
            featuredSection.style.display = 'none';
        }
    }
}

// ===== MODAL DO PLAYER DE VÍDEO =====
function initializeVideoModal() {
    const modal = document.getElementById('video-modal');
    const modalTitle = document.getElementById('modal-video-title');
    const videoPlayer = document.getElementById('video-player');
    const closeBtn = document.querySelector('.close-modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    if (!modal) return;
    
    // Abrir modal ao clicar em "Assistir"
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('watch-btn') || e.target.closest('.watch-btn')) {
            e.preventDefault();
            
            const button = e.target.classList.contains('watch-btn') ? e.target : e.target.closest('.watch-btn');
            const videoUrl = button.dataset.videoUrl;
            const videoTitle = button.dataset.videoTitle;
            
            openVideoModal(videoUrl, videoTitle);
        }
    });
    
    // Fechar modal
    if (closeBtn) {
        closeBtn.addEventListener('click', closeVideoModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeVideoModal);
    }
    
    // Fechar com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeVideoModal();
        }
    });
    
    function openVideoModal(videoUrl, videoTitle) {
        const embedUrl = getEmbedUrl(videoUrl);
        
        if (modalTitle) modalTitle.textContent = videoTitle;
        if (videoPlayer) {
            videoPlayer.innerHTML = `<iframe src="${embedUrl}" allowfullscreen></iframe>`;
        }
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeVideoModal() {
        modal.classList.remove('active');
        if (videoPlayer) videoPlayer.innerHTML = '';
        document.body.style.overflow = '';
    }
}

// ===== UTILITÁRIOS PARA URLs DE VÍDEO =====
function getEmbedUrl(videoUrl) {
    // YouTube
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        let videoId = '';
        
        if (videoUrl.includes('youtube.com/watch')) {
            videoId = videoUrl.split('v=')[1]?.split('&')[0];
        } else if (videoUrl.includes('youtube.com/shorts/')) {
            videoId = videoUrl.split('/shorts/')[1]?.split('?')[0];
        } else if (videoUrl.includes('youtu.be/')) {
            videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
        }
        
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }
    
    // Instagram (limitado - apenas link direto)
    if (videoUrl.includes('instagram.com')) {
        return videoUrl + 'embed/';
    }
    
    // TikTok (limitado - apenas link direto)
    if (videoUrl.includes('tiktok.com')) {
        return videoUrl;
    }
    
    // Facebook (limitado)
    if (videoUrl.includes('facebook.com')) {
        return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(videoUrl)}`;
    }
    
    return videoUrl;
}

// ===== CARROSSÉIS HORIZONTAIS =====
function initializeCarousels() {
    const carousels = document.querySelectorAll('.videos-carousel');
    
    carousels.forEach(carousel => {
        // Adicionar botões de navegação se necessário
        addCarouselNavigation(carousel);
        
        // Scroll suave com mouse wheel
        carousel.addEventListener('wheel', function(e) {
            if (e.deltaY !== 0) {
                e.preventDefault();
                this.scrollLeft += e.deltaY;
            }
        });
    });
}

function addCarouselNavigation(carousel) {
    const container = carousel.parentElement;
    
    // Verificar se já tem navegação
    if (container.querySelector('.carousel-nav')) return;
    
    // Criar botões de navegação
    const navContainer = document.createElement('div');
    navContainer.className = 'carousel-nav';
    navContainer.innerHTML = `
        <button class="carousel-btn prev" aria-label="Anterior">‹</button>
        <button class="carousel-btn next" aria-label="Próximo">›</button>
    `;
    
    container.style.position = 'relative';
    container.appendChild(navContainer);
    
    const prevBtn = navContainer.querySelector('.prev');
    const nextBtn = navContainer.querySelector('.next');
    
    prevBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: -320, behavior: 'smooth' });
    });
    
    nextBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: 320, behavior: 'smooth' });
    });
    
    // Mostrar/ocultar botões baseado na posição do scroll
    function updateNavButtons() {
        const isAtStart = carousel.scrollLeft <= 0;
        const isAtEnd = carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth;
        
        prevBtn.style.opacity = isAtStart ? '0.3' : '1';
        nextBtn.style.opacity = isAtEnd ? '0.3' : '1';
        prevBtn.disabled = isAtStart;
        nextBtn.disabled = isAtEnd;
    }
    
    carousel.addEventListener('scroll', updateNavButtons);
    updateNavButtons();
}

// ===== LAZY LOADING PARA IMAGENS =====
function initializeLazyLoading() {
    const images = document.querySelectorAll('.video-thumbnail img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const thumbnail = img.closest('.video-thumbnail');
                    
                    // Adicionar classe de loading
                    if (thumbnail) thumbnail.classList.add('loading');
                    
                    img.onload = () => {
                        if (thumbnail) thumbnail.classList.remove('loading');
                    };
                    
                    img.onerror = () => {
                        if (thumbnail) thumbnail.classList.remove('loading');
                        // Fallback para thumbnail padrão
                        img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180"><rect width="320" height="180" fill="%23333"/><text x="160" y="90" text-anchor="middle" fill="%23fff" font-family="Arial" font-size="14">Vídeo</text></svg>';
                    };
                    
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// ===== UTILITÁRIOS GERAIS =====
function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== ANALYTICS E TRACKING (OPCIONAL) =====
function trackVideoView(videoTitle, videoUrl) {
    // Implementar tracking de visualizações se necessário
    console.log('Vídeo visualizado:', videoTitle, videoUrl);
    
    // Exemplo com Google Analytics (se configurado)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'video_view', {
            'video_title': videoTitle,
            'video_url': videoUrl
        });
    }
}

// ===== ESTILOS DINÂMICOS PARA NAVEGAÇÃO DOS CARROSSÉIS =====
const carouselNavStyles = `
.carousel-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    display: flex;
    justify-content: space-between;
    pointer-events: none;
    z-index: 10;
}

.carousel-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(0,0,0,0.7);
    color: white;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    pointer-events: all;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
}

.carousel-btn:hover {
    background: rgba(78, 205, 196, 0.8);
    transform: scale(1.1);
}

.carousel-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.carousel-btn.prev {
    margin-left: -20px;
}

.carousel-btn.next {
    margin-right: -20px;
}

@media (max-width: 768px) {
    .carousel-nav {
        display: none;
    }
}
`;

// Adicionar estilos ao documento
if (!document.getElementById('carousel-nav-styles')) {
    const style = document.createElement('style');
    style.id = 'carousel-nav-styles';
    style.textContent = carouselNavStyles;
    document.head.appendChild(style);
}

