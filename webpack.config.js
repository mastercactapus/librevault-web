module.exports = {
  entry: "./src/main",
  output: {
    filename: "dist/bundle.js"
  },
  module: {
    loaders: [
      {test:/\.js$/, exclude:/node_modules/, loader: "babel"},
      {test:/\.css$/, loader: "style!css"}
    ]
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false
      }
    }
  }
}
