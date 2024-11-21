const path = require('path'); // Импортируем модуль "path" для работы с путями файлов
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Подключаем плагин для генерации HTML

module.exports = {
  entry: './src/index.js', // Точка входа для сборки проекта
  output: {
    filename: 'bundle.js', // Имя выходного файла сборки
    path: path.resolve(__dirname, 'dist'), // Путь для выходного файла сборки
  },
  module: {
    rules: [
      {
        test: /\.css$/, // Регулярное выражение для обработки файлов с расширением .css
        use: ['style-loader', 'css-loader'], // Загрузчики для обработки CSS-файлов
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // Шаблон для HTML файла
      inject: true,
      chunks: ['index'],
      filename: 'index.html', // Имя выходного HTML файла
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Каталог для статики
    },
    open: true, // Автоматически открывать браузер
  },
  mode: 'development', // Режим сборки (development или production)
};
