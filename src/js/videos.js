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
    
    // Organizar vídeos por categoria
    organizeVideosByCategory();
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
    
    if (!modal || !playerContainer) {
        console.error('Modal ou player container não encontrado');
        return;
    }
    
    console.log('Abrindo vídeo:', videoTitle, 'URL:', videoUrl);
    
    // Limpar URL
    videoUrl = videoUrl.trim();
    
    // Detectar plataforma e processar adequadamente
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        // YouTube
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
            showVideoError(playerContainer, videoUrl, 'YouTube');
        }
    } else if (videoUrl.includes('tiktok.com')) {
        // TikTok - embed direto
        console.log('Vídeo do TikTok detectado:', videoUrl);
        
        // Tentar extrair ID do TikTok
        const tiktokIdMatch = videoUrl.match(/video\/(\d+)/);
        const tiktokId = tiktokIdMatch ? tiktokIdMatch[1] : null;
        
        if (tiktokId) {
            console.log('TikTok ID encontrado:', tiktokId);
            
            // Embed direto do TikTok
            playerContainer.innerHTML = `
                <blockquote 
                    class="tiktok-embed" 
                    cite="${videoUrl}" 
                    data-video-id="${tiktokId}" 
                    style="max-width: 605px; min-width: 325px; margin: 0 auto; border-radius: 8px; overflow: hidden;">
                    <section>
                        <a target="_blank" title="@silkmachine" href="https://www.tiktok.com/@silkmachine">@silkmachine</a>
                    </section>
                </blockquote>
                <script async src="https://www.tiktok.com/embed.js"></script>
            `;
            
            // Fallback caso o embed não carregue
            setTimeout(() => {
                const tiktokEmbed = playerContainer.querySelector('.tiktok-embed');
                if (tiktokEmbed && tiktokEmbed.children.length <= 1) {
                    playerContainer.innerHTML = `
                        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: linear-gradient(135deg, #ff0050, #00f2ea); color: #fff; border-radius: 8px; text-align: center; padding: 20px;">
                            <div style="font-size: 48px; margin-bottom: 20px;">🎵</div>
                            <h3 style="margin: 0 0 10px 0; font-size: 18px;">Vídeo do TikTok</h3>
                            <p style="margin: 0 0 20px 0; opacity: 0.9;">Carregando vídeo...</p>
                            <p style="margin: 0 0 20px 0; font-size: 12px; opacity: 0.7;">ID: ${tiktokId}</p>
                            <a href="${videoUrl}" target="_blank" style="background: rgba(255,255,255,0.2); color: #fff; padding: 12px 24px; border-radius: 25px; text-decoration: none; font-weight: bold; border: 2px solid rgba(255,255,255,0.3); transition: all 0.3s ease;">
                                🚀 Assistir no TikTok
                            </a>
                        </div>
                    `;
                }
            }, 3000);
        } else {
            console.error('ID do TikTok não encontrado para:', videoUrl);
            showVideoError(playerContainer, videoUrl, 'TikTok');
        }
    } else if (videoUrl.includes('instagram.com')) {
        // Instagram - extrair ID se possível
        console.log('Vídeo do Instagram detectado:', videoUrl);
        
        // Tentar extrair ID do Instagram
        const instaIdMatch = videoUrl.match(/(?:reel|p)\/([A-Za-z0-9_-]+)/);
        const instaId = instaIdMatch ? instaIdMatch[1] : null;
        
        playerContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045); color: #fff; border-radius: 8px; text-align: center; padding: 20px;">
                <div style="font-size: 48px; margin-bottom: 20px;">📸</div>
                <h3 style="margin: 0 0 10px 0; font-size: 18px;">Vídeo do Instagram</h3>
                <p style="margin: 0 0 20px 0; opacity: 0.9;">Este vídeo está disponível no Instagram</p>
                ${instaId ? `<p style="margin: 0 0 20px 0; font-size: 12px; opacity: 0.7;">ID: ${instaId}</p>` : ''}
                <a href="${videoUrl}" target="_blank" style="background: rgba(255,255,255,0.2); color: #fff; padding: 12px 24px; border-radius: 25px; text-decoration: none; font-weight: bold; border: 2px solid rgba(255,255,255,0.3); transition: all 0.3s ease;">
                    🚀 Assistir no Instagram
                </a>
            </div>
        `;
    } else if (videoUrl.includes('facebook.com')) {
        // Facebook
        console.log('Vídeo do Facebook detectado:', videoUrl);
        playerContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: linear-gradient(135deg, #1877f2, #42a5f5); color: #fff; border-radius: 8px; text-align: center; padding: 20px;">
                <div style="font-size: 48px; margin-bottom: 20px;">📘</div>
                <h3 style="margin: 0 0 10px 0; font-size: 18px;">Vídeo do Facebook</h3>
                <p style="margin: 0 0 20px 0; opacity: 0.9;">Este vídeo está disponível no Facebook</p>
                <a href="${videoUrl}" target="_blank" style="background: rgba(255,255,255,0.2); color: #fff; padding: 12px 24px; border-radius: 25px; text-decoration: none; font-weight: bold; border: 2px solid rgba(255,255,255,0.3); transition: all 0.3s ease;">
                    🚀 Assistir no Facebook
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
    
    console.log('Tentando extrair ID do YouTube da URL:', url);
    
    // Limpar a URL removendo espaços e caracteres especiais
    url = url.trim();
    
    // Regex melhorado para capturar diferentes formatos de URL do YouTube
    const patterns = [
        /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,           // youtube.com/watch?v=ID
        /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,             // youtube.com/embed/ID
        /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,                 // youtube.com/v/ID
        /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,                       // youtu.be/ID
        /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,            // youtube.com/shorts/ID
        /(?:youtube\.com\/.*[?&]v=)([a-zA-Z0-9_-]{11})/,            // Outros formatos com v=
        /([a-zA-Z0-9_-]{11})$/                                      // Apenas o ID (fallback)
    ];
    
    for (let i = 0; i < patterns.length; i++) {
        const pattern = patterns[i];
        const match = url.match(pattern);
        if (match && match[1]) {
            console.log(`YouTube ID encontrado com padrão ${i + 1}:`, match[1], 'para URL:', url);
            return match[1];
        }
    }
    
    // Tentar extrair ID de URLs malformadas ou incompletas
    const possibleId = url.replace(/.*[\/=]/, '').replace(/[?&].*/, '');
    if (possibleId && possibleId.length === 11 && /^[a-zA-Z0-9_-]+$/.test(possibleId)) {
        console.log('YouTube ID extraído como fallback:', possibleId, 'para URL:', url);
        return possibleId;
    }
    
    console.error('ID do vídeo não encontrado para:', url);
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



// ===== ORGANIZAÇÃO POR CATEGORIAS =====

// Organizar vídeos por categoria em seções
function organizeVideosByCategory() {
    const videosContainer = document.querySelector('.videos-grid');
    const videoCards = Array.from(document.querySelectorAll('.video-card'));
    
    if (!videosContainer || videoCards.length === 0) return;
    
    // Agrupar vídeos por categoria
    const categories = {
        'destaque': { name: '⭐ Em Destaque', videos: [] },
        'demonstracoes': { name: '🎬 Demonstrações', videos: [] },
        'depoimentos': { name: '💬 Depoimentos', videos: [] },
        'treinamentos': { name: '🎓 Treinamentos', videos: [] },
        'dicas-negocio': { name: '💡 Dicas de Negócio', videos: [] },
        'novidades': { name: '📢 Novidades', videos: [] },
        'tutoriais': { name: '📚 Tutoriais', videos: [] }
    };
    
    // Separar vídeos em destaque primeiro
    videoCards.forEach(card => {
        const category = card.dataset.category;
        const isFeatured = card.querySelector('.video-badge');
        
        if (isFeatured) {
            categories.destaque.videos.push(card);
        } else if (categories[category]) {
            categories[category].videos.push(card);
        }
    });
    
    // Limpar container
    videosContainer.innerHTML = '';
    
    // Criar seções para cada categoria com vídeos
    Object.keys(categories).forEach(categoryKey => {
        const category = categories[categoryKey];
        if (category.videos.length > 0) {
            createCategorySection(videosContainer, category.name, category.videos, categoryKey);
        }
    });
}

// Criar seção de categoria
function createCategorySection(container, categoryName, videos, categoryKey) {
    // Criar seção da categoria
    const section = document.createElement('div');
    section.className = 'category-section';
    section.dataset.category = categoryKey;
    
    // Cabeçalho da categoria
    const header = document.createElement('div');
    header.className = 'category-header';
    header.innerHTML = `
        <h3 class="category-title">${categoryName}</h3>
        <span class="category-count">${videos.length} vídeo${videos.length > 1 ? 's' : ''}</span>
    `;
    
    // Grid de vídeos da categoria
    const grid = document.createElement('div');
    grid.className = 'category-grid';
    
    // Adicionar vídeos à grid
    videos.forEach(video => {
        grid.appendChild(video);
    });
    
    // Montar seção
    section.appendChild(header);
    section.appendChild(grid);
    container.appendChild(section);
}

// Atualizar função de filtro para trabalhar com categorias
function filterVideosByCategory(category) {
    const categorySections = document.querySelectorAll('.category-section');
    let visibleCount = 0;
    
    categorySections.forEach(section => {
        const sectionCategory = section.dataset.category;
        const videos = section.querySelectorAll('.video-card');
        
        if (category.includes('início') || category.includes('todos')) {
            section.style.display = 'block';
            visibleCount += videos.length;
        } else if (category.includes('destaque') && sectionCategory === 'destaque') {
            section.style.display = 'block';
            visibleCount += videos.length;
        } else if (category.includes('demonstrações') && sectionCategory === 'demonstracoes') {
            section.style.display = 'block';
            visibleCount += videos.length;
        } else if (category.includes('depoimentos') && sectionCategory === 'depoimentos') {
            section.style.display = 'block';
            visibleCount += videos.length;
        } else if (category.includes('treinamentos') && sectionCategory === 'treinamentos') {
            section.style.display = 'block';
            visibleCount += videos.length;
        } else if (category.includes('dicas') && sectionCategory === 'dicas-negocio') {
            section.style.display = 'block';
            visibleCount += videos.length;
        } else {
            section.style.display = 'none';
        }
    });
    
    // Atualizar contador
    updateVideoCount(visibleCount);
}

// Atualizar função de busca para trabalhar com categorias
function filterVideosBySearch(searchTerm) {
    const categorySections = document.querySelectorAll('.category-section');
    let visibleCount = 0;
    
    categorySections.forEach(section => {
        const videos = section.querySelectorAll('.video-card');
        let sectionHasVisibleVideos = false;
        
        videos.forEach(card => {
            const title = card.dataset.title || '';
            const description = card.dataset.description || '';
            const tags = card.dataset.tags || '';
            
            if (title.includes(searchTerm) || description.includes(searchTerm) || tags.includes(searchTerm)) {
                card.style.display = 'block';
                visibleCount++;
                sectionHasVisibleVideos = true;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Mostrar/ocultar seção baseado se tem vídeos visíveis
        section.style.display = sectionHasVisibleVideos ? 'block' : 'none';
        
        // Atualizar contador da categoria
        const categoryCount = section.querySelector('.category-count');
        const visibleVideosInSection = section.querySelectorAll('.video-card[style*="block"]').length;
        if (categoryCount) {
            categoryCount.textContent = `${visibleVideosInSection} vídeo${visibleVideosInSection !== 1 ? 's' : ''}`;
        }
    });
    
    updateVideoCount(visibleCount);
}

