module.exports = { 
  runtimeCompiler: true,
  pwa: {
      workboxOptions: {
          skipWaiting: true
      }
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/'
    : '/'
}