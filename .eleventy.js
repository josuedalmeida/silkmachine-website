module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/images");
    eleventyConfig.addPassthroughCopy("src/admin");

    return {
        dir: {
            input: "src",
            includes: "_includes", // Mantenha esta linha
            // layouts: "_includes/layouts", // ESTA LINHA DEVE ESTAR REMOVIDA OU COMENTADA
            data: "_data",
            output: "_site"
        },
        templateFormats: ["md", "njk", "html"],
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        dataTemplateEngine: "njk"
    };
};
