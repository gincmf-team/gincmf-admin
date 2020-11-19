const fabric = require('@umijs/fabric');

module.exports = {
    ...fabric.prettier,
    tabWidth: 4,
    singleQuote: true,
    trailingComma: 'es5',
    printWidth: 100,
    proseWrap: 'never',
    overrides: [
        {
            files: '.prettierrc',
            options: { parser: 'json' },
        },
    ],
    arrowParens: 'always',
};
