import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { useApp } from '@/context/AppContext';

/**
 * Listens for file-association launches (e.g. user opens a .json backup
 * from a file manager). Uses @capacitor/app's appUrlOpen event.
 */
export const useBackupFileListener = () => {
  const { importData } = useApp();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      try {
        const { App } = await import('@capacitor/app');
        const { Filesystem } = await import('@capacitor/filesystem');

        const listener = await App.addListener('appUrlOpen', async (event) => {
          const url = event.url;
          if (!url) return;

          // Only handle .json files
          if (!url.endsWith('.json')) return;

          try {
            // Try reading the file
            const contents = await Filesystem.readFile({ path: url });
            const text = typeof contents.data === 'string'
              ? contents.data
              : new TextDecoder().decode(contents.data as unknown as ArrayBuffer);

            // Validate it looks like a HiYa backup
            try {
              const parsed = JSON.parse(text);
              if (!parsed.entries || !Array.isArray(parsed.entries)) {
                alert('❌ 无效的备份文件');
                return;
              }
            } catch {
              alert('❌ 无效的备份文件');
              return;
            }

            const confirmed = confirm('检测到 HiYa 备份文件，是否立即导入并覆盖当前数据？');
            if (!confirmed) return;

            const success = importData(text);
            if (success) {
              alert('✅ 导入成功！');
              window.location.reload();
            } else {
              alert('❌ 无效的备份文件');
            }
          } catch (err) {
            console.error('[backupFileListener] failed to read file:', err);
            alert('❌ 无法读取文件');
          }
        });

        cleanup = () => listener.remove();
      } catch (err) {
        console.log('[backupFileListener] @capacitor/app not available:', err);
      }
    })();

    return () => cleanup?.();
  }, [importData]);
};
