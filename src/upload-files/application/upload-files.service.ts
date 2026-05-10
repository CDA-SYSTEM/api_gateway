import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UploadFilesInfrastructureService } from '../infrastructure/upload-files.service';

@Injectable()
export class UploadFilesService {
  constructor(private readonly uploadFilesInfrastructure: UploadFilesInfrastructureService) {}

  healthCheck(token: string): Observable<any> {
    return this.uploadFilesInfrastructure.proxyRequest('GET', '/', null, {
      Authorization: `Bearer ${token}`,
    });
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
