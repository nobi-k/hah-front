import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
        return {
          root: '.',
          define: {
            'process.env.APP_DOMAIN': JSON.stringify('otclick24.ru'),
            'process.env.APP_NAME': JSON.stringify('отклик24'),
            'process.env.GIGACHAT_CLIENT_ID': JSON.stringify(env.GIGACHAT_CLIENT_ID || '01998729-eeed-75c4-a31c-d403d300ab9a'),
            'process.env.GIGACHAT_CLIENT_SECRET': JSON.stringify(env.GIGACHAT_CLIENT_SECRET || '4bf43499-46f8-4181-81a5-7e62be1b3d6b'),
            'process.env.HH_CLIENT_ID': JSON.stringify(env.HH_CLIENT_ID || 'HS1C0TBDQV7FNH1H2B9M9TMS7SV3E2BF4EPU7ON29SGOV2BNK9NEK0LOTB02DT80'),
            'process.env.HH_CLIENT_SECRET': JSON.stringify(env.HH_CLIENT_SECRET || 'MGUVQPCBD5UTKNLIE6P0VKC1BFCEPCRLO48QFUFNJV3BCUTKVL8J1HL2GGIN420N'),
            'process.env.HH_REDIRECT_URI': JSON.stringify(env.HH_REDIRECT_URI || 'https://otclick24.ru/account')
          },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src'),
        }
      }
    };
});
