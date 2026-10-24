/**
 * Shared Type Definitions for the Image Converter and Compressor app
 */

export interface ConvertedFile {
  id: string;
  name: string;
  originalSize: number;
  originalType: string;
  originalUrl: string;
  convertedSize: number | null;
  convertedType: 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif';
  convertedUrl: string | null;
  status: 'idle' | 'pending' | 'processing' | 'success' | 'error';
  errorMsg?: string;
  width: number | null;
  height: number | null;
  targetWidth: number | null;
  targetHeight: number | null;
  maintainAspectRatio: boolean;
}

export interface CompressionTask {
  id: string;
  name: string;
  originalSize: number;
  originalUrl: string;
  compressedSize: number | null;
  compressedUrl: string | null;
  quality: number; // 1 to 100
  scale: number; // 10 to 100 percentage
  status: 'idle' | 'compressing' | 'success' | 'error';
  width: number | null;
  height: number | null;
  compressedWidth: number | null;
  compressedHeight: number | null;
}

export interface PdfPageImageTask {
  pageNumber: number;
  status: 'idle' | 'rendering' | 'success' | 'error';
  imageUrl: string | null;
  width: number;
  height: number;
  name: string;
  size: number | null;
}

export interface EditedImageState {
  id: string;
  name: string;
  originalUrl: string;
  editedUrl: string | null;
  rotation: number; // 0, 90, 180, 270
  flipHorizontal: boolean;
  flipVertical: boolean;
  brightness: number; // 50 to 150
  contrast: number; // 50 to 150
  saturation: number; // 0 to 200
  blur: number; // 0 to 20
  grayscale: boolean;
  sepia: boolean;
  invert: boolean;
  resizeWidth: number | null;
  resizeHeight: number | null;
}

export interface ExifMetadata {
  name: string;
  size: string;
  mimeType: string;
  dimensions: string;
  lastModified: string;
  aspectRatio: string;
}
