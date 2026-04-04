/**
 * Cross-platform file saver that works on both web and Capacitor (APK).
 * On Capacitor, uses the Filesystem plugin to save to Downloads.
 * On web, falls back to creating a download link.
 */

const isCapacitor = (): boolean => {
  return typeof (window as any)?.Capacitor !== 'undefined';
};

export const saveFile = async (options: {
  fileName: string;
  data: string;
  mimeType: string;
  isBase64?: boolean;
}) => {
  const { fileName, data, mimeType, isBase64 = false } = options;

  if (isCapacitor()) {
    try {
      const { Filesystem, Directory } = await import('@capacitor/filesystem');
      
      await Filesystem.writeFile({
        path: fileName,
        data: isBase64 ? data : btoa(unescape(encodeURIComponent(data))),
        directory: Directory.Documents,
      });
      
      return { success: true, message: `已保存到 Documents/${fileName}` };
    } catch (err) {
      console.error('Capacitor save failed:', err);
      return webDownload(fileName, data, mimeType, isBase64);
    }
  } else {
    return webDownload(fileName, data, mimeType, isBase64);
  }
};

const webDownload = (fileName: string, data: string, mimeType: string, isBase64: boolean) => {
  try {
    const link = document.createElement('a');
    link.download = fileName;
    if (isBase64) {
      link.href = `data:${mimeType};base64,${data}`;
    } else {
      const blob = new Blob([data], { type: mimeType });
      link.href = URL.createObjectURL(blob);
    }
    link.click();
    if (!isBase64) URL.revokeObjectURL(link.href);
    return { success: true, message: '下载已开始' };
  } catch (err) {
    console.error('Web download failed:', err);
    return { success: false, message: '保存失败' };
  }
};

/**
 * Save a canvas as a PNG image file.
 * On Capacitor, saves to Documents and optionally opens native share sheet.
 */
export const saveCanvasAsImage = async (canvas: HTMLCanvasElement, fileName: string) => {
  if (isCapacitor()) {
    try {
      const { Filesystem, Directory } = await import('@capacitor/filesystem');
      const base64 = canvas.toDataURL('image/png', 1.0).split(',')[1];
      
      const writeResult = await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.Documents,
      });
      
      // Try to open native share sheet
      try {
        const { Share } = await import('@capacitor/share');
        await Share.share({
          title: '分享嗨呀！',
          text: '来看看我的嗨呀记录！',
          url: writeResult.uri,
          dialogTitle: '分享到...',
        });
      } catch {
        // Share cancelled or unavailable, file is still saved
      }
      
      return { success: true, message: `图片已保存到 Documents/${fileName}` };
    } catch (err) {
      console.error('Capacitor image save failed:', err);
    }
  }
  
  // Web fallback
  const link = document.createElement('a');
  link.download = fileName;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
  return { success: true, message: '下载已开始' };
};
