const { override, addBabelPlugin, babelInclude } = require('customize-cra');
const path = require('path');

module.exports = override(
  // Add Babel plugin for class properties syntax
  addBabelPlugin('@babel/plugin-proposal-class-properties'),
  
  // Include fast-png, jspdf, framer-motion, and their dependencies in Babel transpilation
  babelInclude([
    path.resolve('src'), // Include source files
    path.resolve('node_modules/fast-png'), // Include fast-png for transpilation
    path.resolve('node_modules/jspdf'), // Include jspdf for transpilation
    path.resolve('node_modules/iobuffer'), // Include iobuffer (dependency of fast-png) for transpilation
    path.resolve('node_modules/framer-motion') // Include framer-motion for transpilation
  ])
  // Note: CRA 3.4.1 automatically uses postcss.config.js for PostCSS processing
);

