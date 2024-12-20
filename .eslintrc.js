module.exports = {
	extends: ["plugin:@typescript-eslint/recommended", "prettier"],
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
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
};
