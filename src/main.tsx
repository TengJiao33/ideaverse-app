import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// 引入 Mantine 的核心样式文件
import '@mantine/core/styles.css';

// 引入 Mantine 的 Provider 组件
import { MantineProvider } from '@mantine/core';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 在新版Mantine中，我们不再需要 withGlobalStyles 和 withNormalizeCSS 属性 */}
    <MantineProvider>
      <App />
    </MantineProvider>
  </React.StrictMode>,
);