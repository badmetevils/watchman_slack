interface ICommonConfig {
  headers?: SimpleJson;
  isBlob?: boolean;
  encodeURI?: boolean;
  excludeHeaders?: string[];
}
export interface IPost extends ICommonConfig {
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: BodyInit;
}

export interface IGet extends ICommonConfig {
  method: 'GET';
}

export type IHttpConfigInterface = IPost | IGet;
