import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Observable, forkJoin, of, from } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs';
import * as Handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { InvoiceInfrastructureService } from '../infrastructure/invoice.service';
import { StatusService } from '../../status/application/status.service';
import { UploadFilesService } from '../../upload-files/application/upload-files.service';
import { VehicleService } from '../../vehicle/application/vehicle.service';
import { InvoicePaidHandler } from './invoice-paid.handler';
import { encrypt } from '../../common/utils/encryption.util';

@Injectable()
export class InvoiceService implements OnModuleDestroy {
  private readonly logger = new Logger(InvoiceService.name);
  private template: HandlebarsTemplateDelegate<any> | null = null;
  private browser: puppeteer.Browser | null = null;
  private browserReady: Promise<puppeteer.Browser> | null = null;

  constructor(
    private readonly infrastructure: InvoiceInfrastructureService,
    private readonly statusService: StatusService,
    private readonly uploadFilesService: UploadFilesService,
    private readonly vehicleService: VehicleService,
    private readonly invoicePaidHandler: InvoicePaidHandler,
  ) {
    Handlebars.registerHelper('eq', (a: any, b: any) => a === b);
    Handlebars.registerHelper('formatNumber', (n: number) =>
      new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n ?? 0),
    );
  }

  async onModuleDestroy(): Promise<void> {
    if (this.browser) {
      await this.browser.close().catch(() => {});
      this.browser = null;
      this.browserReady = null;
    }
  }

  private getBrowser = async (): Promise<puppeteer.Browser> => {
    if (this.browser) return this.browser;
    if (this.browserReady) return this.browserReady;
    const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || undefined;
    this.browserReady = puppeteer.launch({
      executablePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    }).then((b) => {
      this.browser = b;
      this.browserReady = null;
      return b;
    }).catch((err) => {
      this.browserReady = null;
      throw err;
    });
    return this.browserReady;
  };

  private loadTemplate = (dynamicBody?: string): HandlebarsTemplateDelegate<any> => {
    if (dynamicBody) {
      return Handlebars.compile(dynamicBody);
    }
    if (this.template) return this.template;
    const templatePath = path.join(__dirname, 'pdf', 'template.hbs');
    if (fs.existsSync(templatePath)) {
      const source = fs.readFileSync(templatePath, 'utf-8');
      this.template = Handlebars.compile(source);
      return this.template;
    }
    // Deep fallback if no file exists
    return Handlebars.compile('<html><body><h1>Invoice {{invoice.number}}</h1></body></html>');
  };

  private mapVariables = (invoice: any, vehicle?: any) => {
    const createdAt = new Date(invoice.createdAt || new Date());
    return {
      invoice: {
        id: invoice.id ?? '',
        number: invoice.invoice_number ?? '',
        items: Array.isArray(invoice.items) ? invoice.items.map((item: any) => ({
          description: item.description ?? item.concept ?? '',
          quantity: item.quantity ?? 0,
          unitPrice: item.unitPrice ?? 0,
          total: item.total ?? 0,
        })) : [],
        subtotal: invoice.subtotal ?? 0,
        tax: invoice.tax ?? 0,
        total: invoice.total ?? 0,
        observations: invoice.observations ?? '',
      },
      client: {
        name: invoice.client?.name || 'Consumidor Final',
        document: invoice.client?.document || 'N/A',
      },
      vehicle: vehicle ? {
        plate: vehicle.plate ?? vehicle.placa ?? '',
        brand: vehicle.brand ?? vehicle.marca?.nombre ?? '',
        model: vehicle.model ?? vehicle.modelo ?? '',
        line: vehicle.line ?? vehicle.linea?.nombre ?? '',
        color: vehicle.color ?? vehicle.color?.nombre ?? '',
      } : null,
      date: {
        day: createdAt.getDate().toString().padStart(2, '0'),
        month: (createdAt.getMonth() + 1).toString().padStart(2, '0'),
        year: createdAt.getFullYear(),
        full: this.formatDate(invoice.createdAt),
      },
    };
  };

  private generatePdfBuffer = async (data: any, dynamicTemplate?: string): Promise<Buffer> => {
    const template = this.loadTemplate(dynamicTemplate);
    const html = template(data);

    const browser = await this.getBrowser();
    const page = await browser.newPage();
    try {
      await page.setContent(html, { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => Promise.allSettled(
        Array.from(document.images).map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          });
        }),
      ));
      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
        printBackground: true,
      });
      return Buffer.from(pdfBuffer);
    } finally {
      await page.close().catch(() => {});
    }
  };

  private formatDate = (iso: string): string => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  create(data: any, token: string): Observable<any> {
    return this.infrastructure.proxyRequest('POST', '/api/invoices', data, {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  findAll(
    token: string,
    invoiceNumber?: string,
    statusId?: string,
    inspectionId?: string,
    search?: string,
    includeDeleted?: string,
    page?: number,
    size?: number,
  ): Observable<any> {
    const params = new URLSearchParams();
    if (invoiceNumber) params.append('invoice_number', invoiceNumber);
    if (statusId) params.append('statusId', statusId);
    if (inspectionId) params.append('inspection_id', inspectionId);
    if (search) params.append('search', search);
    if (includeDeleted) params.append('includeDeleted', includeDeleted);
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    const qs = params.toString();
    return this.infrastructure.proxyRequest('GET', `/api/invoices${qs ? '?' + qs : ''}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  findOne(id: string, token: string): Observable<any> {
    return this.infrastructure.proxyRequest('GET', `/api/invoices/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  update(id: string, data: any, token: string): Observable<any> {
    const incomingStatusId = data?.statusId;

    if (!incomingStatusId) {
      return this.infrastructure.proxyRequest('PATCH', `/api/invoices/${id}`, data, {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      });
    }

    return forkJoin({
      update: this.infrastructure.proxyRequest('PATCH', `/api/invoices/${id}`, data, {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
      paidStatus: this.statusService.findAll(token, 'PAID').pipe(
        map((res) => {
          const list = Array.isArray(res?.data) ? res.data : (res?.data?.data ?? []);
          return list?.[0]?.id ?? null;
        }),
      ),
    }).pipe(
      map(({ update, paidStatus }) => {
        if (paidStatus && incomingStatusId === paidStatus) {
          this.logger.log(`[Invoice] Invoice ${id} updated to PAID, triggering checklist creation`);
          this.invoicePaidHandler.handle(id, token);
        }
        return update;
      }),
      catchError((err) => {
        this.logger.error(`[Invoice] Update failed for ${id}: ${err.message}`);
        return this.infrastructure.proxyRequest('PATCH', `/api/invoices/${id}`, data, {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        });
      }),
    );
  }

  remove(id: string, token: string): Observable<any> {
    return this.infrastructure.proxyRequest('DELETE', `/api/invoices/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });
  }

  getDocument(id: string, token: string): Observable<any> {
    return this.infrastructure.proxyRequest('GET', `/api/invoices/${id}`, null, {
      Authorization: `Bearer ${token}`,
    }).pipe(
      switchMap((response: any) => {
        const invoice = response?.data ?? response;
        if (!invoice) return of({ error: 'Invoice not found' });

        if (invoice.urlInvoice) {
          return of({ url: invoice.urlInvoice, invoiceId: id });
        }

        const vehicleId = invoice.vehicle_id;
        const inspectionId = invoice.inspection_id;

        const vehicle$ = vehicleId
          ? this.vehicleService.getVehicleById(vehicleId, token).pipe(
              map((r: any) => { const v = r?.data ?? r; return v?.id ? v : null; }),
              catchError(() => of(null)),
            )
          : of(null);

        const fetchInspection$ = inspectionId && !vehicleId
          ? this.infrastructure.proxyRequest('GET', `/api/inspections/${inspectionId}`, null, {
              Authorization: `Bearer ${token}`,
            }).pipe(
              map((r: any) => {
                const insp = r?.data ?? r;
                return insp?.vehicle_id ?? null;
              }),
              catchError(() => of(null)),
            )
          : of(null);

        return forkJoin({
          vehicle: vehicle$,
          inspectionVehicle: fetchInspection$,
          template: this.infrastructure.proxyRequest('GET', '/api/invoice-templates/active/INVOICE', null, {
            Authorization: `Bearer ${token}`,
          }).pipe(
            map(res => res?.data || res),
            catchError(() => of(null))
          ),
        }).pipe(
          switchMap(({ vehicle: vehicleData, inspectionVehicle: fetchedVehicleId, template: templateData }) => {
            const finalVehicleId = vehicleData ? vehicleId : (fetchedVehicleId ?? null);

            const vehicleFinal$ = finalVehicleId && !vehicleData
              ? this.vehicleService.getVehicleById(finalVehicleId, token).pipe(
                  map((r: any) => { const v = r?.data ?? r; return v?.id ? v : null; }),
                  catchError(() => of(null)),
                )
              : of(vehicleData);

            return vehicleFinal$.pipe(
              switchMap((vehicle) => {
                const mappedData = this.mapVariables(invoice, vehicle);
                const dynamicTemplate = templateData?.body || undefined;

                return from(this.generatePdfBuffer(mappedData, dynamicTemplate)).pipe(
                  switchMap((pdfBuffer) => {
                    const secretKey = process.env.API_SECRET_KEY || '';
                    const encryptedBuffer = secretKey ? encrypt(pdfBuffer, secretKey, 'application/pdf') : pdfBuffer;
                    const useEncrypted = secretKey && encryptedBuffer !== pdfBuffer;
                    const pdfFile: Express.Multer.File = {
                      buffer: encryptedBuffer,
                      originalname: `invoice-${invoice.invoice_number ?? id}.pdf`,
                      mimetype: useEncrypted ? 'application/octet-stream' : 'application/pdf',
                      size: encryptedBuffer.length,
                      fieldname: 'file',
                      encoding: '7bit',
                      destination: '',
                      filename: `invoice-${invoice.invoice_number ?? id}.pdf`,
                      path: '',
                      stream: null as any,
                    };

                    return this.uploadFilesService.uploadFile(pdfFile, token).pipe(
                      switchMap((uploadResult: any) => {
                        const fileId = uploadResult?.file?.id ?? uploadResult?.data?.file?.id ?? uploadResult?.data?.id ?? uploadResult?.id;
                        if (!fileId) {
                          this.logger.error(`[Invoice] Failed to upload PDF for invoice ${id}`);
                          return of({ error: 'Failed to upload PDF' });
                        }

                        const baseUrl = (process.env.API_GATEWAY_BASE_URL || '').replace(/\/+$/, '');
                        const url = `${baseUrl}/api/v1/storage/files/${fileId}`;

                        return this.infrastructure.proxyRequest('PATCH', `/api/invoices/${id}`, { urlInvoice: url }, {
                          Authorization: `Bearer ${token}`,
                          'Content-Type': 'application/json',
                        }).pipe(
                          map(() => ({ url, invoiceId: id })),
                          catchError((err) => {
                            this.logger.error(`[Invoice] Failed to save urlInvoice: ${err.message}`);
                            return of({ url, invoiceId: id });
                          }),
                        );
                      }),
                      catchError((err) => {
                        this.logger.error(`[Invoice] Upload failed: ${err.message}`);
                        return of({ error: 'Upload failed' });
                      }),
                    );
                  }),
                  catchError((err) => {
                    this.logger.error(`[Invoice] PDF generation failed: ${err.message}`);
                    return of({ error: 'PDF generation failed' });
                  }),
                );
              }),
            );
          }),
        );
      }),
      catchError((err) => {
        this.logger.error(`[Invoice] getDocument error: ${err.message}`);
        return of({ error: err.message });
      }),
    );
  }
}
