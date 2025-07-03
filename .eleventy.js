module.exports = function(eleventyConfig) {
    // Copia as pastas css, js e images diretamente para a pasta de saída
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/images");
    eleventyConfig.addPassthroughCopy("src/admin");
	
	// Adiciona um filtro de data personalizado
    eleventyConfig.addFilter("dateFormat", function(dateObj, format) {
        const luxon = require('luxon'); // Certifique-se de ter luxon instalado (npm install luxon)
        return luxon.DateTime.fromJSDate(dateObj).toFormat(format);
    });

    // Adiciona filtros necessários para a página de vídeos
    eleventyConfig.addFilter("where", function(array, key, value) {
        if (!array) return [];
        return array.filter(item => item.data && item.data[key] === value);
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
        return str.replace(new RegExp(search, 'g'), replace);
    });

    eleventyConfig.addFilter("title", function(str) {
        return str.replace(/\w\S*/g, (txt) => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    });

    eleventyConfig.addFilter("join", function(array, separator) {
        return array.join(separator || ',');
    });

    eleventyConfig.addFilter("padStart", function(str, length, pad) {
        return str.toString().padStart(length, pad);
    });

    eleventyConfig.addFilter("date", function(dateObj, format) {
        const luxon = require('luxon');
        return luxon.DateTime.fromJSDate(new Date(dateObj)).toFormat(format);
    });

    eleventyConfig.addFilter("striptags", function(str) {
        return str.replace(/<[^>]*>/g, '');
    });

    // Configura a pasta de entrada (source) e a pasta de saída (output)
    return {
        dir: {
            input: "src",
            includes: "_includes", // Mantenha esta linha
            // REMOVA ESTA LINHA: layouts: "_includes/layouts", 
            data: "_data",
            output: "_site"
        },
        templateFormats: ["md", "njk", "html"],
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        dataTemplateEngine: "njk"
    };
};
