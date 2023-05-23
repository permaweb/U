import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: [
      { find: 'app', replacement: path.resolve(__dirname, 'src/app/') },
      { find: 'api', replacement: path.resolve(__dirname, 'src/api/') },
      { find: 'assets', replacement: path.resolve(__dirname, 'src/assets/') },
      {
        find: 'components',
        replacement: path.resolve(__dirname, 'src/components/'),
      },
      { find: 'global', replacement: path.resolve(__dirname, 'src/global/') },
      { find: 'helpers', replacement: path.resolve(__dirname, 'src/helpers/') },
      {
        find: 'navigation',
        replacement: path.resolve(__dirname, 'src/navigation/'),
      },
      {
        find: 'providers',
        replacement: path.resolve(__dirname, 'src/providers/'),
      },
      { find: 'routes', replacement: path.resolve(__dirname, 'src/routes/') },
      { find: 'views', replacement: path.resolve(__dirname, 'src/views/') },
      { find: 'wallet', replacement: path.resolve(__dirname, 'src/wallet/') },
      {
        find: 'wrappers',
        replacement: path.resolve(__dirname, 'src/wrappers/'),
      },
    ],
  },
});
