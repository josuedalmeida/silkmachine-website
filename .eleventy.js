module.exports = function(eleventyConfig) {
    // Copia as pastas css, js e images diretamente para a pasta de saída
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/images");
    eleventyConfig.addPassthroughCopy("src/admin");
	
	// Adiciona um filtro de data personalizado (renomeado para evitar conflito)
    eleventyConfig.addFilter("luxonDate", function(dateObj, format) { // Renomeado
        const { DateTime } = require('luxon'); // Desestruturação para melhor prática
        // Garante que a entrada seja um objeto Date ou uma string ISO válida
        const date = dateObj instanceof Date ? dateObj : new Date(dateObj);
        return DateTime.fromJSDate(date).toFormat(format);
    });

    // Remova ou comente o filtro "where" antigo
    // eleventyConfig.addFilter("where", function(array, key, value) {
    //     if (!array) return [];
    //     return array.filter(item => item.data && item.data[key] === value);
    // });

    // NOVO FILTRO: filterFeaturedVideos
    eleventyConfig.addFilter("filterFeaturedVideos", function(videos) {
        if (!videos) return [];
        return videos.filter(video => {
            // Retorna o vídeo se ele tem 'data' e 'data.featured' é estritamente booleano 'true'
            return video.data && video.data.featured === true;
        });
    });

    eleventyConfig.addFilter("reverse", function(array) {
        if (!array) return [];
        return array.slice().reverse();
    });

    eleventyConfig.addFilter("slice", function(array, start, end) {
        return array.slice(start, end);
    });

    eleventyConfig.addFilter("truncate", function(str, length) {
        if (!str) return '';
        if (str.length <= length) return str;
        return str.substring(0, length) + '...';
    });

    eleventyConfig.addFilter("extractYouTubeId", function(url) {
        if (!url) return null;
        url = url.trim();
        const patterns = [
            /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
            /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
            /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
            /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
            /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
            /(?:youtube\.com\/.*[?&]v=)([a-zA-Z0-9_-]{11})/
        ];
        for (let i = 0; i < patterns.length; i++) {
            const pattern = patterns[i];
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }
        // Fallback para IDs puros se a URL for apenas o ID
        const possibleId = url.replace(/.*[\/=]/, '').replace(/[?&].*/, '');
        if (possibleId && possibleId.length === 11 && /^[a-zA-Z0-9_-]+$/.test(possibleId)) {
            return possibleId;
        }
        return null;
    });


    eleventyConfig.addFilter("getCategoryName", function(category) {
        const categoryNames = {
            'demonstracoes': '🎬 Demonstrações',
            'depoimentos': '💬 Depoimentos',
            'treinamentos': '🎓 Treinamentos',
            'dicas-negocio': '💡 Dicas de Negócio',
            'tutoriais': '📚 Tutoriais',
            'novidades': '📢 Novidades' // Adicionado
        };
        return categoryNames[category] || category;
    });

    eleventyConfig.addFilter("striptags", function(str) {
        if (!str) return '';
        return str.replace(/<[^>]*>/g, '');
    });

    // Adiciona collection para vídeos
    eleventyConfig.addCollection("videos", function(collectionApi) {
        return collectionApi.getFilteredByGlob("src/videos/*.md");
    });

    // Configura a pasta de entrada (source) e a pasta de saída (output)
    return {
        dir: {
            input: "src",
            includes: "_includes", // Mantenha esta linha
            data: "_data",
            output: "docs" // Alterado para 'docs' para GitHub Pages
        },
        templateFormats: ["njk", "md"], // Adiciona markdown como um formato de template
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        dataTemplateEngine: "njk"
    };
};