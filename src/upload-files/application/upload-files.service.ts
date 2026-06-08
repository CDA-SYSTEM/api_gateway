import { Injectable } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { UploadFilesInfrastructureService } from '../infrastructure/upload-files.service';
import { CacheInfrastructureService } from '../../cache/infrastructure/cache.service';
import { CACHE_TTL } from '../../cache/application/cache-keys.constant';
import { decrypt } from '../../common/utils/encryption.util';

@Injectable()
export class UploadFilesService {
  constructor(
    private readonly uploadFilesInfrastructure: UploadFilesInfrastructureService,
    private readonly cacheService: CacheInfrastructureService,
  ) {}

  healthCheck(token: string): Observable<any> {
    return this.cacheService.getOrFetch('upload:health', token, () =>
      this.uploadFilesInfrastructure.proxyRequest('GET', '/', null, {
        Authorization: `Bearer ${token}`,
      }),
      CACHE_TTL.SHORT,
    );
  }

  listFiles(limit: number, token: string): Observable<any> {
    return this.uploadFilesInfrastructure.proxyRequest('GET', `/storage/files?limit=${limit}`, null, {
      Authorization: `Bearer ${token}`,
    }).pipe(
      map((response: any) => {
        const items: any[] = response?.data ?? response ?? [];
        return items.map((item: any) => ({
          ...item,
          url: `${process.env.API_GATEWAY_BASE_URL}/storage/files/${item.id}`,
        }));
      }),
    );
  }

  deleteFileById(id: string, token: string): Observable<any> {
    return this.uploadFilesInfrastructure.proxyRequest('DELETE', `/storage/files/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  getFileById(id: string, token: string): Observable<any> {
    return this.uploadFilesInfrastructure.proxyRequest('GET', `/storage/files/${id}`, null, {
      Authorization: `Bearer ${token}`,
    }, true).pipe(
      map((result: any) => {
        const secretKey = process.env.API_SECRET_KEY || '';
        if (secretKey && result.data) {
          result.data = decrypt(result.data, secretKey);
          if (result.data[0] === 0x25 && result.data[1] === 0x50 && result.data[2] === 0x44 && result.data[3] === 0x46) {
            result.contentType = 'application/pdf';
          }
        }
        return result;
      }),
    );
  }

  uploadFile(file: Express.Multer.File, token: string): Observable<any> {
    const formData = new FormData();
    const blob = new Blob([file.buffer as any], { type: file.mimetype });
    formData.append('file', blob, file.originalname);

    return this.uploadFilesInfrastructure.proxyRequest('POST', '/storage/upload', formData, {
      Authorization: `Bearer ${token}`,
    });
  }

  getStorageStats(token: string): Observable<any> {
    return this.uploadFilesInfrastructure.proxyRequest('GET', '/storage/stats', null, {
      Authorization: `Bearer ${token}`,
    });
  }
}
