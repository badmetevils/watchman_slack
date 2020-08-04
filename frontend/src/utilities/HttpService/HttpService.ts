import { IHttpConfigInterface } from './interface';
import { isValidJson, ObjectToQueryString, getCookie } from '../helpers';

class HttpService {
  private setHeaders(excludeHeaders: string[] = []) {
    let header: SimpleJson = new Object();
    header['Content-Type'] = 'application/json';
    excludeHeaders.forEach((h: string) => {
      if (h in header) {
        delete header[h.toUpperCase()];
      }
    });
    return header;
  }

  private mergeConfigs(userConfig: IHttpConfigInterface): SimpleJson {
    let defaultHeaders = this.setHeaders(userConfig.excludeHeaders);

    let config: SimpleJson = {
      credentials: 'include',
      headers: {
        ...defaultHeaders,
        ...userConfig.headers
      },
      method: userConfig.method
    };

    if (userConfig.method !== 'GET' && !!userConfig.body) {
      config.body = userConfig.body;
    }
    return config;
  }

  private parseResponse(response: any, isBlob: boolean = false) {
    if (isBlob) {
      return response.blob();
    }
    return response.text().then((res: any) => {
      return isValidJson(res) ? JSON.parse(res) : {};
    });
  }

  public request<T>(url: string, config: IHttpConfigInterface, queryParam: object = {}): Promise<T> {
    const c = this.mergeConfigs(config);
    const u = `${url}${ObjectToQueryString(queryParam, config?.encodeURI)}`;
    return fetch(u, c).then(response => {
      return this.parseResponse(response);
    });
  }
}

const http = new HttpService();

export default http;
