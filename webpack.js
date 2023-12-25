const MergeJsonWebpackPlugin = require('merge-jsons-webpack-plugin');

module.exports = {
  plugins: [
    new MergeJsonWebpackPlugin({
      output: {
        groupBy: [
          { pattern: './src/i18n/en/*.json', fileName: './i18n/en.json' },
          { pattern: './src/i18n/hi/*.json', fileName: './i18n/hi.json' },
          { pattern: './src/i18n/mr/*.json', fileName: './i18n/mr.json' },
        ],
      },
    }),
  ],
};
