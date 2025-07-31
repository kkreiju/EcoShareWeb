import { createClient } from "@/lib/supabase/client";

export interface FileUploadResult {
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

export class MessageFileUploader {
  private supabase = createClient();
  private bucket = "message-attachments";

  async uploadFile(file: File, userId: string): Promise<FileUploadResult> {
    try {
      // Validate file
      this.validateFile(file);

      // Generate unique filename
      const fileExtension = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

      // Upload to Supabase Storage
      const { data, error } = await this.supabase.storage
        .from(this.bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = this.supabase.storage
        .from(this.bucket)
        .getPublicUrl(data.path);

      return {
        url: urlData.publicUrl,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      };
    } catch (error) {
      throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async uploadImage(file: File, userId: string): Promise<FileUploadResult> {
    try {
      // Validate image
      this.validateImage(file);

      // Optionally resize image here if needed
      const processedFile = await this.processImage(file);
      
      return this.uploadFile(processedFile, userId);
    } catch (error) {
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private validateFile(file: File): void {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB');
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error('File type not supported');
    }
  }

  private validateImage(file: File): void {
    const maxSize = 5 * 1024 * 1024; // 5MB for images
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (file.size > maxSize) {
      throw new Error('Image size must be less than 5MB');
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Image type not supported. Please use JPEG, PNG, GIF, or WebP');
    }
  }

  private async processImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const maxWidth = 1920;
      const maxHeight = 1080;
      const quality = 0.8;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const processedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(processedFile);
            } else {
              reject(new Error('Failed to process image'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      // Extract file path from URL
      const url = new URL(fileUrl);
      const filePath = url.pathname.split('/').slice(-1)[0];

      const { error } = await this.supabase.storage
        .from(this.bucket)
        .remove([filePath]);

      if (error) throw error;
    } catch (error) {
      throw new Error(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFileIcon(fileType: string): string {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType === 'application/pdf') return '📄';
    if (fileType.startsWith('text/')) return '📝';
    if (fileType.includes('word')) return '📄';
    return '📎';
  }
}

export const messageFileUploader = new MessageFileUploader();
