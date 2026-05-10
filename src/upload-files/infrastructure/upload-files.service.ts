import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Observable, map, catchError } from 'rxjs';
import { AxiosResponse, AxiosError } from 'axios';
import { safeParse } from '../../common/utils/parse.util';

@Injectable()
export class UploadFilesInfrastructureService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('UPLOAD_FILES_SERVICE_BASE_URL') || '';
    if (!this.baseUrl) {
      throw new Error('UPLOAD_FILES_SERVICE_BASE_URL is not defined');
    }
  }

  proxyRequest(method: string, path: string, data?: any, headers?: any, rawBuffer?: boolean): Observable<any> {
    const url = `${this.baseUrl}${path}`;
    const config: any = { method, url, data, headers };
    if (rawBuffer) {
      config.responseType = 'arraybuffer';
    }
    return this.httpService.request(config).pipe(
      map((response: AxiosResponse) => {
        if (rawBuffer) {
          return { data: response.data, contentType: response.headers['content-type'] };
        }
        return safeParse(response.data);
      }),
      catchError((error: AxiosError) => {
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
          throw new HttpException('Upload files service no disponible', HttpStatus.BAD_GATEWAY);
        }
        throw new HttpException(
          error.response?.data || `Service error: ${error.message}`,
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }
}
