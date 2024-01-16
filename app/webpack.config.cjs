const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	entry: './src/index.tsx',
	output: {
		path: `${__dirname}/dist`,
		filename: 'bundle.js',
	},
	devtool: 'eval',
	mode: process.env.NODE_ENV || 'development',
	devServer: {
		static: {
			directory: path.join(__dirname, 'dist'),
		},
		hot: true,
		historyApiFallback: true,
		port: 3002,
		open: false,
		compress: true,
		client: {
			overlay: true,
		},
	},
	optimization:
		process.env.NODE_ENV === 'production'
			? {
					minimize: true,
					minimizer: [
						new TerserPlugin({
							extractComments: false,
						}),
					],
					usedExports: true,
			  }
			: {},
	ignoreWarnings: [
		{
			message:
				/Critical dependency: require function is used in a way in which dependencies cannot be statically extracted/,
		},
	],
	module: {
		rules: [
			{
				test: /\.md$/,
				use: 'raw-loader',
			},
			{
				test: /\.(ts|tsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							'@babel/preset-env',
							['@babel/preset-react', { runtime: 'automatic' }],
							'@babel/preset-typescript',
						],
					},
				},
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.m?js/,
				resolve: {
					fullySpecified: false,
				},
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: [
					'url-loader',
					{
						loader: 'image-webpack-loader',
						options: {
							mozjpeg: {
								progressive: true,
								quality: 65,
							},
							optipng: {
								enabled: false,
							},
							pngquant: {
								quality: [0.65, 0.9],
								speed: 4,
							},
							gifsicle: {
								interlaced: false,
							},
							webp: {
								quality: 75,
							},
						},
					},
				],
			},
			{
				test: /\.svg$/,
				use: [
					{
						loader: '@svgr/webpack',
						options: {
							icon: true,
						},
					},
					'url-loader',
				],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'public', 'index.html'),
		}),
		new CopyWebpackPlugin({
			patterns: [
				{ from: 'public/favicon.svg', to: 'favicon.svg' },
				{ from: 'public/manifest.json', to: 'manifest.json' },
			],
		}),
		new CleanWebpackPlugin(),
		new webpack.ProvidePlugin({
			process: 'process/browser',
			Buffer: ['buffer', 'Buffer'],
		}),
		new webpack.NoEmitOnErrorsPlugin(),
	],
	resolve: {
		extensions: ['.tsx', '.ts', '.jsx', '.js'],
		preferRelative: true,
		alias: {
			process: 'process/browser',
			crypto: 'crypto-browserify',
			stream: 'stream-browserify',
		},
		fallback: {
			fs: false,
			tls: false,
			net: false,
			path: false,
			zlib: require.resolve('browserify-zlib'),
			http: require.resolve('stream-http'),
			https: require.resolve('https-browserify'),
			events: require.resolve('events/'),
			stream: require.resolve('stream-browserify'),
			process: require.resolve('process/browser'),
			crypto: require.resolve('crypto-browserify'),
			stream: require.resolve('stream-browserify'),
			constants: require.resolve('constants-browserify'),
			path: require.resolve('path-browserify'),
			os: require.resolve('os-browserify'),
			util: require.resolve('util'),
			assert: require.resolve('assert'),
			url: require.resolve('url'),
			buffer: require.resolve('buffer'),
		},
		alias: {
			react: path.resolve(__dirname, 'node_modules/react'),
			process: 'process/browser',
			app: path.resolve(__dirname, 'src/app/'),
			api: path.resolve(__dirname, 'src/api/'),
			assets: path.resolve(__dirname, 'src/assets/'),
			components: path.resolve(__dirname, 'src/components/'),
			filters: path.resolve(__dirname, 'src/filters/'),
			gql: path.resolve(__dirname, 'src/gql/'),
			helpers: path.resolve(__dirname, 'src/helpers/'),
			hooks: path.resolve(__dirname, 'src/hooks/'),
			lib: path.resolve(__dirname, 'src/lib/'),
			navigation: path.resolve(__dirname, 'src/navigation/'),
			providers: path.resolve(__dirname, 'src/providers/'),
			root: path.resolve(__dirname, 'src/root/'),
			routes: path.resolve(__dirname, 'src/routes/'),
			store: path.resolve(__dirname, 'src/store/'),
			views: path.resolve(__dirname, 'src/views/'),
			wallet: path.resolve(__dirname, 'src/wallet/'),
			workers: path.resolve(__dirname, 'src/workers/'),
			wrappers: path.resolve(__dirname, 'src/wrappers/'),
			'asn1.js': path.resolve(__dirname, 'node_modules/asn1.js'),
			elliptic: path.resolve(__dirname, 'node_modules/elliptic'),
			'@bundlr-network/client': '@bundlr-network/client/build/cjs/web/bundlr',
			arweave: path.resolve(__dirname, 'node_modules/arweave'),
		},
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
};
