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

    // Adiciona filtros necessários para a página de vídeos
    eleventyConfig.addFilter("where", function(array, key, value) {
        if (!array) return []; // Retorna array vazio se a entrada não for um array
        return array.filter(item => {
            // Garante que 'item.data' e a 'key' existam no item
            if (item.data && key in item.data) {
                // Se o valor procurado for explicitamente booleano true
                if (value === true) {
                    // Retorna o item se a propriedade for estritamente booleana true
                    return item.data[key] === true;
                }
                // Se o valor procurado for explicitamente booleano false
                if (value === false) {
                    // Retorna o item se a propriedade for estritamente booleana false
                    return item.data[key] === false;
                }
                // Para outros tipos de valores (string, número, etc.), usa a comparação estrita padrão
                return item.data[key] === value;
            }
            return false; // Exclui itens que não possuem a estrutura de dados esperada
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

    eleventyConfig.addFilter("replace", function(str, search, replace) {
        // Usa uma expressão regular para substituir todas as ocorrências
        return str.replace(new RegExp(search, 'g'), replace);
    });

    eleventyConfig.addFilter("title", function(str) {
        if (!str) return '';
        return str.replace(/\w\S*/g, (txt) => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    });

    eleventyConfig.addFilter("join", function(array, separator) {
        if (!array) return ''; // Retorna string vazia para array nulo/indefinido
        return array.join(separator || ',');
    });

    eleventyConfig.addFilter("padStart", function(str, length, pad) {
        if (str === null || str === undefined) return '';
        return str.toString().padStart(length, pad);
    });
	

    // REMOVIDO: eleventyConfig.addFilter("date", function(dateObj, format) { ... });
    // Use luxonDate no lugar.

    // FILTRO extractYouTubeId OTIMIZADO PARA SER USADO NO NUNJUCKS
    eleventyConfig.addFilter("extractYouTubeId", function(url) {
        if (!url) return null;
        const patterns = [
            /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/,
            /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/,
            /(?:youtu\.be\/)([a-zA-Z0-9_-]+)/,
            /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
            /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]+)/, // Adicionado
            /(?:youtube\.com\/.*[?&]v=)([a-zA-Z0-9_-]{11})/, // Mais genérico
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
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
            includes: "_includes",
            data: "_data",
            output: "_site"
        },
        templateFormats: ["md", "njk", "html"],
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        dataTemplateEngine: "njk"
    };
};