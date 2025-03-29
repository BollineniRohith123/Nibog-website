const path = require('path');

module.exports = {
  resolve: {
    alias: {
      '@/components': path.resolve(__dirname, 'components'),
      '@/pages': path.resolve(__dirname, 'pages'),
      '@/utils': path.resolve(__dirname, 'utils'),
      '@/hooks': path.resolve(__dirname, 'hooks'),
      '@/styles': path.resolve(__dirname, 'styles'),
      '@/lib': path.resolve(__dirname, 'src/lib'),
      '@/services': path.resolve(__dirname, 'services')
    }
  }
};
