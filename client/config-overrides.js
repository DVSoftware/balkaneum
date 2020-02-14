const { injectBabelPlugin } = require('react-app-rewired');

const {
	override,
	fixBabelImports,
	addLessLoader,
} = require('customize-cra');

module.exports = override(
	fixBabelImports('antd', {
		libraryDirectory: 'es',
		libraryName: 'antd',
		style: 'css',
	}),
);