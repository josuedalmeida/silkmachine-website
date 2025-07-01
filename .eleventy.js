module.exports = function(eleventyConfig) {
    // Copia as pastas css, js e images diretamente para a pasta de saída
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/images");

    // Configura a pasta de entrada (source) e a pasta de saída (output)
    return {
        dir: {
            input: "src", // Isso é importante!
            output: "_site"
        }
    };
};
