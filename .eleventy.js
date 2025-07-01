module.exports = function(eleventyConfig) {
    // Copia as pastas css, js e images diretamente para a pasta de saída
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/images");
    eleventyConfig.addPassthroughCopy("src/admin"); // Certifique-se que a pasta admin também é copiada

    // Configura a pasta de entrada (source) e a pasta de saída (output)
    return {
        dir: {
            input: "src",
            includes: "_includes", // Adiciona esta linha
            layouts: "_includes/layouts", // Adiciona esta linha
            data: "_data", // Opcional, se você tiver arquivos de dados
            output: "_site"
        },
        templateFormats: ["md", "njk", "html"], // Adiciona esta linha para garantir que ele processa esses formatos
        markdownTemplateEngine: "njk", // Adiciona esta linha para usar Nunjucks para Markdown
        htmlTemplateEngine: "njk", // Adiciona esta linha para usar Nunjucks para HTML
        dataTemplateEngine: "njk" // Adiciona esta linha para usar Nunjucks para dados
    };
};
