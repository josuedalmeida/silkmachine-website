// ===== FUNCIONALIDADES DA PÁGINA DE VÍDEOS =====

// Função utilitária para extrair ID do YouTube
// (Mantida aqui, mas idealmente viria de videos-data.js ou um arquivo de utilidades global)
function extractYouTubeId(url) {
    if (!url) return null;
    url = url.trim();
    const patterns = [
        /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/.*[?&]v=)([a-zA-Z0-9_-]{11})/,
        /([a-zA-Z0-9_-]{11})$/
    ];
    for (let i = 0; i < patterns.length; i++) {
        const pattern = patterns[i];
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    const possibleId = url.replace(/.*[\/=]/, '').replace(/[?&].*/, '');
    if (possibleId && possibleId.length === 11 && /^[a-zA-Z0-9_-]+$/.test(possibleId)) {
        return possibleId;
    }
    return null;
}

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página de vídeos carregada');
    
    // Configurar filtros
    setupFilters();
    
    // Configurar busca
    setupSearch();
    
    // Configurar a abertura do modal para todos os botões "Assistir Vídeo"
    setupWatchButtons();

    // Configurar o botão "Assistir Agora" do vídeo principal em destaque
    setupMainFeaturedWatchButton();
});

// Configurar filtros de categoria
function setupFilters() {
    const filterButtons = document.querySelectorAll('.category-filters .filter-btn'); // Corrigido o seletor
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover classe active de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adicionar classe active ao botão clicado
            this.classList.add('active');
            
            // Filtrar vídeos
            const category = this.dataset.category; // Usar data-category
            filterVideosByCategory(category);
        });
    });
}

// Filtrar vídeos por categoria
function filterVideosByCategory(category) {
    const categorySections = document.querySelectorAll('.category-section');
    const featuredVideosSection = document.querySelector('.featured-videos'); // Seção de outros vídeos em destaque

    categorySections.forEach(section => {
        const sectionCategory = section.dataset.category;
        
        // Esconder todas as seções por padrão
        section.classList.add('hidden'); // Usar a classe 'hidden' do CSS
        
        // Mostrar a seção 'featured-videos' se estiver filtrando por 'all' ou 'destaque'
        if ((category === 'all' || category === 'destaque') && featuredVideosSection) {
            featuredVideosSection.classList.remove('hidden');
        } else if (featuredVideosSection) {
            featuredVideosSection.classList.add('hidden');
        }

        // Lógica para mostrar as seções de categoria específicas
        if (category === 'all') {
            section.classList.remove('hidden'); // Mostrar todas as seções
        } else if (sectionCategory === category) {
            section.classList.remove('hidden'); // Mostrar apenas a seção da categoria clicada
        } else if (category === 'destaque' && sectionCategory === 'destaque') { // Para o caso de ter uma seção 'destaque' separada para outros vídeos
            section.classList.remove('hidden');
        }
        
        // Resetar a visibilidade dos cards dentro das seções visíveis (se a busca estava ativa)
        const videosInVisibleSection = section.querySelectorAll('.video-card');
        videosInVisibleSection.forEach(card => {
            card.classList.remove('hidden');
            card.style.display = ''; // Remover inline style de display:none se houver
        });
    });
    
    // Se a categoria for 'all', garantir que a seção de "Outros Vídeos em Destaque" também apareça
    if (category === 'all' && featuredVideosSection) {
        featuredVideosSection.classList.remove('hidden');
    }
    // Se a categoria for 'destaque', garantir que a seção de "Outros Vídeos em Destaque" apareça
    else if (category === 'destaque' && featuredVideosSection) {
        featuredVideosSection.classList.remove('hidden');
    }
}

// Configurar busca
function setupSearch() {
    const searchInput = document.getElementById('video-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim(); // Trim para remover espaços em branco
            filterVideosBySearch(searchTerm);
        });
    }
}

// Filtrar vídeos por busca
function filterVideosBySearch(searchTerm) {
    const allVideoCards = document.querySelectorAll('.video-card, .featured-video-card-small'); // Incluir ambos os tipos de cards
    const categorySections = document.querySelectorAll('.category-section');
    const featuredVideosSection = document.querySelector('.featured-videos'); // Seção de outros vídeos em destaque

    let totalVisibleVideos = 0;

    // Primeiro, ocultar todas as seções e cards
    allVideoCards.forEach(card => card.classList.add('hidden'));
    categorySections.forEach(section => section.classList.add('hidden'));
    if (featuredVideosSection) featuredVideosSection.classList.add('hidden');

    if (searchTerm === '') {
        // Se a busca estiver vazia, mostre tudo
        allVideoCards.forEach(card => card.classList.remove('hidden'));
        categorySections.forEach(section => section.classList.remove('hidden'));
        if (featuredVideosSection) featuredVideosSection.classList.remove('hidden');
        return; // Sair da função
    }

    // Iterar sobre todos os cards de vídeo (incluindo os destacados secundários)
    allVideoCards.forEach(card => {
        const title = card.querySelector('.video-title')?.textContent.toLowerCase() || '';
        const description = card.querySelector('.video-description')?.textContent.toLowerCase() || '';
        const tagsElement = card.querySelector('.video-tags');
        const tags = tagsElement ? Array.from(tagsElement.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()).join(' ') : '';
        const category = card.dataset.category || ''; // Obtém a categoria do data-attribute

        if (title.includes(searchTerm) || description.includes(searchTerm) || tags.includes(searchTerm) || category.includes(searchTerm)) {
            card.classList.remove('hidden'); // Mostrar o card
            totalVisibleVideos++;

            // Se o card for do tipo 'featured-video-card-small', mostre a seção 'featured-videos'
            if (card.classList.contains('featured-video-card-small') && featuredVideosSection) {
                featuredVideosSection.classList.remove('hidden');
            } else {
                // Se o card for um 'video-card' normal, mostre a seção da qual ele faz parte
                const parentSection = card.closest('.category-section');
                if (parentSection) {
                    parentSection.classList.remove('hidden');
                }
            }
        }
    });
}


// Atualizar contador de vídeos - Esta função não é mais estritamente necessária no layout atual
// a menos que você adicione um elemento específico para exibir a contagem total
// Deixo-a vazia por enquanto para evitar erros. Se precisar de um contador, avise onde ele deve ir.
function updateVideoCount() {
    // Não há um elemento com ID 'videos-count' no novo layout HTML.
    // Se você deseja exibir a contagem total de vídeos, precisaremos adicionar um elemento para isso.
    // Por enquanto, esta função não fará nada ou pode ser removida.
}


// Configurar todos os botões "Assistir Vídeo" (dos carrosséis)
function setupWatchButtons() {
    // Seleciona todos os botões de assistir vídeo, incluindo o do vídeo principal
    const watchButtons = document.querySelectorAll('.watch-btn'); 
    
    watchButtons.forEach(button => {
        button.addEventListener('click', function() {
            const videoUrl = this.dataset.videoUrl;
            const videoTitle = this.dataset.videoTitle;
            openVideoModal(videoUrl, videoTitle);
        });
    });
}

// Configurar o botão "Assistir Agora" do vídeo em destaque principal
function setupMainFeaturedWatchButton() {
    const mainWatchBtn = document.querySelector('.main-watch-btn'); // Novo seletor para o botão principal
    if (mainWatchBtn) {
        mainWatchBtn.addEventListener('click', function() {
            const videoUrl = this.dataset.videoUrl;
            const videoTitle = this.dataset.videoTitle;
            openVideoModal(videoUrl, videoTitle);
        });
    }
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
    
    videoUrl = videoUrl.trim();
    
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) { // Ajustado para ser mais genérico
        const videoId = extractYouTubeId(videoUrl);
        
        if (videoId) {
            const embedUrl = `https://www.youtube.com/embed/${videoId}?` + // Protocolo HTTPS
                'autoplay=1&' +
                'controls=1&' +
                'modestbranding=1&' +
                'rel=0&' +
                'showinfo=0&' +
                'iv_load_policy=3&' +
                'cc_load_policy=0&' +
                'fs=1&' +
                'playsinline=1&' +
                'enablejsapi=1';
            
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
            showVideoError(playerContainer, videoUrl, 'YouTube');
        }
    } else if (videoUrl.includes('tiktok.com')) {
        const tiktokIdMatch = videoUrl.match(/video\/(\d+)/);
        const tiktokId = tiktokIdMatch ? tiktokIdMatch[1] : null;
        
        if (tiktokId) {
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
        } else {
            showVideoError(playerContainer, videoUrl, 'TikTok');
        }
    } else if (videoUrl.includes('instagram.com')) {
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
    } else if (videoUrl.includes('facebook.com')) {
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
        showVideoError(playerContainer, videoUrl, 'Plataforma não suportada');
    }
    
    if (modalTitle) modalTitle.textContent = videoTitle;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Se for YouTube e o autoplay não funcionar, pode ser uma restrição do navegador.
    // Pode-se adicionar um evento para tentar dar play novamente.
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
        // Interrompe o vídeo limpando o innerHTML
        playerContainer.innerHTML = '';
    }
}

// Event listeners para fechar o modal
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('video-modal');
    const closeModalBtn = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeVideoModal);
    }
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeVideoModal); // Fechar ao clicar fora do conteúdo do modal
    }
    // Adicionar escutador para a tecla ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            closeVideoModal();
        }
    });
});