// ===== DADOS DOS VÍDEOS - SILK MACHINE =====
// Solução robusta para garantir que os vídeos apareçam na página

const videosData = [
    {
        title: "Impressão em Garrafas Shaker com K3-350",
        description: "Demonstração da máquina K3-350 fazendo impressão em garrafas shaker, mostrando a versatilidade e precisão da máquina para diferentes tipos de produtos.",
        video_url: "https://www.youtube.com/shorts/4fX3PMNvgTU",
        category: "demonstracoes",
        tags: ["K3-350", "garrafas", "shaker", "impressão", "serigrafia"],
        featured: true,
        date: "2025-01-15",
        duration: 60,
        platform: "youtube"
    },
    {
        title: "Clientes Fazendo Canecas na Aula Presencial",
        description: "Vídeos de clientes aprendendo a fazer canecas personalizadas durante as aulas presenciais da Silk Machine.",
        video_url: "https://www.youtube.com/shorts/x55BMhZPTvU",
        category: "treinamentos",
        tags: ["canecas", "aula", "treinamento", "clientes"],
        featured: false,
        date: "2025-01-10",
        duration: 45,
        platform: "youtube"
    },
    {
        title: "Clientes Fazendo Copos Descartáveis",
        description: "Demonstração de clientes produzindo copos descartáveis personalizados durante o treinamento prático.",
        video_url: "https://www.youtube.com/shorts/agwiGEn6lSQ",
        category: "treinamentos",
        tags: ["copos", "descartáveis", "treinamento", "aula"],
        featured: false,
        date: "2025-01-08",
        duration: 50,
        platform: "youtube"
    },
    {
        title: "Tempo de Execução - Copos Descartáveis",
        description: "Vídeo mostrando o tempo real de execução para produção de copos descartáveis, demonstrando a eficiência da K3-350.",
        video_url: "https://www.youtube.com/shorts/94ASuQumbLc",
        category: "demonstracoes",
        tags: ["tempo", "execução", "copos", "eficiência"],
        featured: true,
        date: "2025-01-12",
        duration: 40,
        platform: "youtube"
    },
    {
        title: "Josué Fala Sobre Lucratividade",
        description: "Josué explica sobre a lucratividade em personalizar copos descartáveis e como maximizar os ganhos com a K3-350.",
        video_url: "https://www.youtube.com/shorts/BQzpQ-WytfM",
        category: "dicas-negocio",
        tags: ["lucratividade", "negócio", "copos", "Josué"],
        featured: true,
        date: "2025-01-14",
        duration: 90,
        platform: "youtube"
    },
    {
        title: "Impressão em 2 Cores no Copo Térmico",
        description: "Demonstração de como fazer impressão em duas cores no copo térmico, mostrando as possibilidades avançadas da máquina.",
        video_url: "https://www.youtube.com/shorts/pzD9MJosGrU",
        category: "tutoriais",
        tags: ["duas cores", "copo térmico", "técnica", "avançado"],
        featured: false,
        date: "2025-01-11",
        duration: 75,
        platform: "youtube"
    },
    {
        title: "Impressão em Cadernos com Kit Base Plana",
        description: "Vídeo mostrando como usar o kit base plana para impressão em cadernos, expandindo as possibilidades de produtos.",
        video_url: "https://www.youtube.com/shorts/nOTiPV9vozI",
        category: "tutoriais",
        tags: ["cadernos", "base plana", "kit", "produtos"],
        featured: false,
        date: "2025-01-09",
        duration: 65,
        platform: "youtube"
    },
    {
        title: "Produção com Alto Faturamento e Baixo Investimento",
        description: "Demonstração de como é possível faturar alto com baixo investimento usando a máquina K3-350.",
        video_url: "https://www.youtube.com/shorts/zPBJ175gDRo",
        category: "dicas-negocio",
        tags: ["faturamento", "investimento", "negócio", "produção"],
        featured: true,
        date: "2025-01-13",
        duration: 80,
        platform: "youtube"
    },
    {
        title: "Entrega de Máquina para Potes de Vidro UV",
        description: "Vídeo da entrega de uma máquina para empresa que trabalha com potes de vidros e impressão com cura UV.",
        video_url: "https://www.youtube.com/shorts/iNoUEB7K1Eo",
        category: "demonstracoes",
        tags: ["potes", "vidro", "UV", "entrega", "empresa"],
        featured: false,
        date: "2025-01-07",
        duration: 55,
        platform: "youtube"
    },
    {
        title: "Impressão em Frascos de Cosméticos",
        description: "Demonstração de impressão em frascos de embalagens de cosméticos para linha industrial.",
        video_url: "https://youtu.be/c1MvJ5Bzo0s?si=UPMsZWldwT8to8QR",
        category: "demonstracoes",
        tags: ["cosméticos", "frascos", "industrial", "embalagens"],
        featured: false,
        date: "2025-01-06",
        duration: 120,
        platform: "youtube"
    },
    {
        title: "Cliente Faturando Mais de 60 Mil por Mês",
        description: "Depoimento inspirador de cliente que está faturando mais de 60 mil por mês vendendo canecas personalizadas de times de futebol.",
        video_url: "https://youtu.be/3ifHYrdiFYk",
        category: "depoimentos",
        tags: ["depoimento", "60mil", "canecas", "futebol", "sucesso"],
        featured: true,
        date: "2025-01-16",
        duration: 180,
        platform: "youtube"
    }
];

// Função para extrair ID do YouTube de diferentes formatos de URL
function extractYouTubeId(url) {
    const patterns = [
        /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/,
        /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/,
        /(?:youtu\.be\/)([a-zA-Z0-9_-]+)/,
        /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

// Função para obter thumbnail do YouTube
function getYouTubeThumbnail(url) {
    const videoId = extractYouTubeId(url);
    if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    return '/images/video-placeholder.jpg';
}

// Função para formatar duração
function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Função para formatar data
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Função para capitalizar categoria
function formatCategory(category) {
    return category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Exportar dados para uso global
window.videosData = videosData;
window.videoUtils = {
    extractYouTubeId,
    getYouTubeThumbnail,
    formatDuration,
    formatDate,
    formatCategory
};

