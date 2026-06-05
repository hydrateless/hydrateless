module.exports = {
  plugins: [
    require('postcss-import')(),
    // Preserve native `@layer` rules; the cascade-layers polyfill would flatten
    // them and break the documented reset → tokens → theme → components order.
    require('postcss-preset-env')({ stage: 1, features: { 'cascade-layers': false } }),
    require('autoprefixer')(),
  ],
};
