import eslintPluginAstro from "eslint-plugin-astro";

export default [
    //add more generic rule sets here such as;
    // js.config.recommended
    ...eslintPluginAstro.configs.recommended,
    {
        rules: {
            //override/add rule sewttings here, such as:
            // "astro/no-set-html-directive": "error"

        },
    },
]