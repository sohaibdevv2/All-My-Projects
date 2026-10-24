/**
 * Helper utilities for client-side Image Processing and Conversion
 */

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      reject(new Error('Failed to load image to calculate dimensions'));
    };
  });
}

/**
 * Converts a file/image string to a specified file type and quality with custom sizes
 */
export function processImage(
  sourceUrl: string,
  options: {
    targetMimeType: string;
    quality: number; // 0.01 to 1.0
    targetWidth?: number | null;
    targetHeight?: number | null;
  }
): Promise<{ blob: Blob; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = sourceUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Could not get 2D context from canvas');
        }

        // Determine output dimensions
        const outWidth = options.targetWidth || img.naturalWidth;
        const outHeight = options.targetHeight || img.naturalHeight;

        canvas.width = outWidth;
        canvas.height = outHeight;

        // Draw image onto canvas (scaling if dimensions differ)
        ctx.drawImage(img, 0, 0, outWidth, outHeight);

        // Convert canvas content to blob with target format & quality
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ blob, width: outWidth, height: outHeight });
            } else {
              reject(new Error('Canvas compilation returned empty blob'));
            }
          },
          options.targetMimeType,
          options.quality
        );
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load source image for canvas writing'));
    };
  });
}

/**
 * Apply filters, flips, rotation and sizing to image, outputting a Blob & localized URL
 */
export function applyEditorAdjustments(
  sourceUrl: string,
  state: {
    rotation: number;
    flipHorizontal: boolean;
    flipVertical: boolean;
    brightness: number;
    contrast: number;
    saturation: number;
    blur: number;
    grayscale: boolean;
    sepia: boolean;
    invert: boolean;
    resizeWidth?: number | null;
    resizeHeight?: number | null;
  },
  outputFormat: string = 'image/png',
  quality: number = 0.92
): Promise<{ blob: Blob; url: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = sourceUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Canvas 2D context is not available');
        }

        const baseWidth = state.resizeWidth || img.naturalWidth;
        const baseHeight = state.resizeHeight || img.naturalHeight;

        // Account for rotation swaps dimensions if rotated 90 or 270 degrees
        const isRotated90or270 = state.rotation % 180 !== 0;
        const canvasWidth = isRotated90or270 ? baseHeight : baseWidth;
        const canvasHeight = isRotated90or270 ? baseWidth : baseHeight;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Build composite CSS filters
        let filterString = '';
        if (state.brightness !== 100) filterString += `brightness(${state.brightness}%) `;
        if (state.contrast !== 100) filterString += `contrast(${state.contrast}%) `;
        if (state.saturation !== 100) filterString += `saturate(${state.saturation}%) `;
        if (state.blur > 0) filterString += `blur(${state.blur}px) `;
        if (state.grayscale) filterString += 'grayscale(100%) ';
        if (state.sepia) filterString += 'sepia(100%) ';
        if (state.invert) filterString += 'invert(100%) ';

        ctx.filter = filterString.trim() || 'none';

        // Save canvas state before transforms
        ctx.save();

        // Translate to direct center
        ctx.translate(canvasWidth / 2, canvasHeight / 2);

        // Apply rotation
        ctx.rotate((state.rotation * Math.PI) / 180);

        // Apply scale/flips
        const scaleX = state.flipHorizontal ? -1 : 1;
        const scaleY = state.flipVertical ? -1 : 1;
        ctx.scale(scaleX, scaleY);

        // Draw image offset to top-left of transformed coords
        ctx.drawImage(img, -baseWidth / 2, -baseHeight / 2, baseWidth, baseHeight);

        // Restore canvas state
        ctx.restore();

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              resolve({ blob, url, width: canvasWidth, height: canvasHeight });
            } else {
              reject(new Error('Canvas image rendering failed'));
            }
          },
          outputFormat,
          quality
        );
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = (e) => {
      reject(new Error('Failed to load source image into editor canvas'));
    };
  });
}
