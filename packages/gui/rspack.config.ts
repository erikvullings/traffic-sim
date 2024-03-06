import { config } from 'dotenv';
import { resolve } from 'path';
import { Configuration } from '@rspack/cli';
import {
  DefinePlugin,
  HtmlRspackPlugin,
  HotModuleReplacementPlugin,
  SwcCssMinimizerRspackPlugin,
  SwcJsMinimizerRspackPlugin,
} from '@rspack/core';

config();

const devMode = (process.env as any).NODE_ENV === 'development';
const isProduction = !devMode;
const outputPath = resolve(__dirname, isProduction ? '../server/public' : 'dist');
const SERVER = process.env.SERVER || 'http://localhost:1234';
const publicPath = isProduction ? '/' : '/';
const APP_TITLE = 'Traffic Simulator';
const APP_DESC = 'A traffic simulator that allows you to plan traffic and which simulates its progress in time.';
const APP_PORT = +(process.env.PORT || 3423);

console.log(
  `Running in ${
    isProduction ? 'production' : 'development'
  } mode, serving from ${SERVER} and public path ${publicPath}, output directed to ${outputPath}.`
);

const configuration: Configuration = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    main: './src/app.ts',
  },
  devServer: {
    port: APP_PORT,
  },
  plugins: [
    new DefinePlugin({
      'process.env.SERVER': `'${SERVER}'`,
    }),
    new HtmlRspackPlugin({
      title: APP_TITLE,
      publicPath,
      scriptLoading: 'defer',
      minify: !devMode,
      favicon: './src/favicon.ico',
      meta: {
        viewport: 'width=device-width, initial-scale=1',
        'og:title': APP_TITLE,
        'og:description': APP_DESC,
        'og:url': SERVER || '',
        'og:site_name': APP_TITLE,
        'og:image:alt': APP_TITLE,
        'og:image': './src/assets/logo.svg',
        'og:image:type': 'image/svg',
        'og:image:width': '200',
        'og:image:height': '200',
      },
    }),
    new HotModuleReplacementPlugin(),
    new SwcCssMinimizerRspackPlugin(),
    new SwcJsMinimizerRspackPlugin({
      compress: !devMode,
      mangle: !devMode,
    }),
  ],
  resolve: {
    extensions: ['...', '.ts', '*.wasm', '*.csv', '*.json'], // "..." means to extend from the default extensions
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loader: 'builtin:swc-loader',
        options: {
          sourceMap: true,
          jsc: {
            parser: {
              syntax: 'typescript',
            },
          },
        },
        type: 'javascript/auto',
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /^BUILD_ID$/,
        type: 'asset/source',
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                modifyVars: {
                  // Options
                },
                javascriptEnabled: true,
              },
            },
          },
        ],
        type: 'css', // This is must, which tells rspack this is type of css resources
      },
    ],
  },
  output: {
    filename: '[id].bundle.js',
    publicPath,
    path: outputPath,
  },
};

export default configuration;
