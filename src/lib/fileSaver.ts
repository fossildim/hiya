/**
 * Cross-platform file saver using pure Web APIs.
 * Uses navigator.share when available, falls back to long-press overlay or clipboard.
 */

/**
 * Share or save a file (JSON backup etc).
 * Strategy: navigator.share → download link → copy to clipboard
 */
export const saveFile = async (options: {
  fileName: string;
  data: string;
  mimeType: string;
  isBase64?: boolean;
}): Promise<{ success: boolean; message: string }> => {
  const { fileName, data, mimeType } = options;

  // Try navigator.share first
  if (navigator.share && navigator.canShare) {
    try {
      const blob = new Blob([data], { type: mimeType });
      const file = new File([blob], fileName, { type: mimeType });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: fileName });
        return { success: true, message: '分享成功！' };
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        return { success: true, message: '已取消分享' };
      }
      console.warn('navigator.share failed, falling back:', err);
    }
  }

  // Fallback: try download link
  try {
    const blob = new Blob([data], { type: mimeType });
    const link = document.createElement('a');
    link.download = fileName;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
    return { success: true, message: '下载已开始' };
  } catch (err) {
    console.warn('Download link failed:', err);
  }

  // Last resort for JSON: copy to clipboard
  if (mimeType.includes('json')) {
    try {
      await navigator.clipboard.writeText(data);
      return { success: true, message: '已复制到剪贴板，请粘贴到备忘录保存' };
    } catch {
      return { success: false, message: '保存失败，请重试' };
    }
  }

  return { success: false, message: '保存失败' };
};

/**
 * Save a canvas as a PNG image.
 * Strategy: navigator.share → show long-press overlay
 * Returns either success or a data URL for the long-press fallback.
 */
export const saveCanvasAsImage = async (
  canvas: HTMLCanvasElement,
  fileName: string
): Promise<{ success: boolean; message: string; fallbackDataUrl?: string }> => {
  // Convert canvas to blob
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/png', 1.0)
  );

  if (!blob) {
    return { success: false, message: '图片生成失败' };
  }

  // Try navigator.share
  if (navigator.share && navigator.canShare) {
    try {
      const file = new File([blob], fileName, { type: 'image/png' });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: '嗨呀！分享图',
          text: '来看看我的嗨呀记录！',
        });
        return { success: true, message: '分享成功！' };
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        return { success: true, message: '已取消分享' };
      }
      console.warn('navigator.share for image failed:', err);
    }
  }

  // Fallback: return data URL for long-press overlay
  const dataUrl = canvas.toDataURL('image/png', 1.0);
  return {
    success: false,
    message: '请长按图片保存到手机相册',
    fallbackDataUrl: dataUrl,
  };
};
