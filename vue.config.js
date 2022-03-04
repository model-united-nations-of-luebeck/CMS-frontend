module.exports = {
  "transpileDependencies": [
    "vuetify",
    "vue-tel-input-vuetify"
  ],
  devServer: {
    host: 'localhost'
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/trix/cms/'
    : '/'
}