import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config, Services } from '../common/config/configuration';
import { TF2SchemaItemsResponse } from './interfaces/schema.interface';

@Injectable()
export class SchemaService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<Config>,
  ) {}

  async enqueueSchema(next: number): Promise<void> {
    const url = `${
      this.configService.get<Services>('services').schema
    }/schema/refresh`;

    await this.httpService
      .post<any>(url, {
        start: next,
      })
      .toPromise();
  }

  async saveSchemaItems(items: any): Promise<void> {
    const url = `${this.configService.get<Services>('services').schema}/schema`;

    await this.httpService
      .post<any>(url, {
        items,
      })
      .toPromise();
  }

  getSchemaItems(start?: number): Promise<TF2SchemaItemsResponse> {
    return this.httpService
      .get<TF2SchemaItemsResponse>(
        'https://api.steampowered.com/IEconItems_440/GetSchemaItems/v0001/',
        {
          params: {
            key: this.configService.get<string>('steamApiKey'),
            start: start ?? 0,
            language: 'English',
          },
          responseType: 'json',
        },
      )
      .toPromise()
      .then((response) => response.data);
  }
}
