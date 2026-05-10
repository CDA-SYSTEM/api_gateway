import { Injectable } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { UploadFilesInfrastructureService } from '../infrastructure/upload-files.service';

@Injectable()
export class UploadFilesService {
  constructor(private readonly uploadFilesInfrastructure: UploadFilesInfrastructureService) {}

  healthCheck(token: string): Observable<any> {
    return this.uploadFilesInfrastructure.proxyRequest('GET', '/', null, {
      Authorization: `Bearer ${token}`,
    });
  }

  listFiles(limit: number, token: string): Observable<any> {
    return this.uploadFilesInfrastructure.proxyRequest('GET', `/storage/files?limit=${limit}`, null, {
      Authorization: `Bearer ${token}`,
    }).pipe(
      map((response: any) => {
        const items: any[] = response?.data ?? response ?? [];
        return items.map((item: any) => ({
          ...item,
          url: `${process.env.UPLOAD_FILES_SERVICE_BASE_URL}/storage/files/${item.id}`,
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
    }, true);
  }

  uploadFile(file: Express.Multer.File, token: string): Observable<any> {
    const formData = new FormData();
    const blob = new Blob([file.buffer as any], { type: file.mimetype });
    formData.append('file', blob, file.originalname);

    return this.uploadFilesInfrastructure.proxyRequest('POST', '/storage/upload', formData, {
      Authorization: `Bearer ${token}`,
    });
  }
}
