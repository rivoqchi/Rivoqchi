import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync, unlink } from 'fs';
import { extname, join } from 'path';
import { promisify } from 'util';
import { randomUUID } from 'crypto';

const unlinkAsync = promisify(unlink);

const GALLERY_DIR = join(process.cwd(), 'uploads', 'gallery');
const ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_IMAGE_EXT = /\.(jpe?g|png|webp)$/i;

@Injectable()
export class StorageService implements OnModuleInit {
  onModuleInit() {
    this.ensureGalleryDir();
  }

  ensureGalleryDir() {
    if (!existsSync(GALLERY_DIR)) {
      mkdirSync(GALLERY_DIR, { recursive: true });
    }
  }

  static getGalleryMulterOptions() {
    return {
      storage: diskStorage({
        destination: (
          _req: Express.Request,
          _file: Express.Multer.File,
          callback: (error: Error | null, destination: string) => void,
        ) => {
          if (!existsSync(GALLERY_DIR)) {
            mkdirSync(GALLERY_DIR, { recursive: true });
          }
          callback(null, GALLERY_DIR);
        },
        filename: (
          _req: Express.Request,
          file: Express.Multer.File,
          callback: (error: Error | null, filename: string) => void,
        ) => {
          const uniqueName = `${randomUUID()}${extname(file.originalname).toLowerCase()}`;
          callback(null, uniqueName);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (
        _req: Express.Request,
        file: Express.Multer.File,
        callback: (error: Error | null, acceptFile: boolean) => void,
      ) => {
        if (ALLOWED_IMAGE_MIMES.includes(file.mimetype)) {
          callback(null, true);
          return;
        }
        callback(new BadRequestException('Faqat JPG, PNG yoki WebP rasmlar qabul qilinadi'), false);
      },
    };
  }

  static getMulterOptions(destination = './uploads') {
    return {
      storage: diskStorage({
        destination,
        filename: (
          _req: Express.Request,
          file: Express.Multer.File,
          callback: (error: Error | null, filename: string) => void,
        ) => {
          const uniqueName = `${randomUUID()}${extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (
        _req: Express.Request,
        file: Express.Multer.File,
        callback: (error: Error | null, acceptFile: boolean) => void,
      ) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
        if (allowedMimes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new Error('Invalid file type'), false);
        }
      },
    };
  }

  async deleteGalleryImage(filename: string) {
    if (!ALLOWED_IMAGE_EXT.test(filename) || filename.includes('..') || filename.includes('/')) {
      throw new BadRequestException('Noto‘g‘ri fayl nomi');
    }

    const filepath = join(GALLERY_DIR, filename);
    try {
      await unlinkAsync(filepath);
    } catch {
      // File may already be removed
    }
  }
}
