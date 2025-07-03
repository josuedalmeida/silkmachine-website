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
