module.exports = {
	extends: ["plugin:@next/next/recommended", "plugin:@typescript-eslint/recommended", "prettier"],
	ignorePatterns: [
		".github",
		"**/*.cy.js",
		"**/*.cy.ts",
		"**/*.test.js",
		"**/*.test.ts",
		"**/*.bench.js",
		"**/*.bench.ts",
		"**/*.stories.tsx",
	],
	rules: {
		'@typescript-eslint/no-empty-object-type': 'off',
	},
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
};
