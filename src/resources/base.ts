import { AxiosInstance, AxiosError } from 'axios';
import {
  MaimemoError,
  NetworkError,
  APIError,
  AuthenticationError,
  TimeoutError,
  NotFoundError,
} from '../errors.js';
import { ApiResponseData } from '../types.js';

/**
 * 基础资源服务类
 */
export abstract class BaseService {
  protected client: AxiosInstance;
  protected basePath: string;

  /**
   * 创建基础服务
   * @param client Axios客户端实例
   * @param basePath API基础路径
   */
  constructor(client: AxiosInstance, basePath: string) {
    this.client = client;
    this.basePath = basePath;
  }

  /**
   * 处理API错误
   * @param error 错误对象
   */
  protected handleError(error: any): never {
    if (error instanceof MaimemoError) {
      // 如果已经是自定义错误则直接抛出
      throw error;
    }

    if ((error as AxiosError).isAxiosError) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        // 服务器返回了错误状态码
        const { status } = axiosError.response;
        const data = axiosError.response.data as ApiResponseData;

        // 认证错误
        if (status === 401 || status === 403) {
          throw new AuthenticationError(
            status,
            `Authentication failed: ${axiosError.message}`,
            data,
          );
        }

        // 资源未找到
        if (status === 404) {
          throw new NotFoundError('Resource');
        }

        throw new APIError(
          status,
          `API Error ${status}: ${JSON.stringify(data)}`,
          data,
        );
      } else if (axiosError.request) {
        // 请求已发送但没有收到响应
        if (axiosError.code === 'ECONNABORTED') {
          throw new TimeoutError(`Request timeout: ${axiosError.message}`);
        }

        throw new NetworkError(`No response received: ${axiosError.message}`);
      }
    }

    // 其他错误
    let errorMessage: string;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error && typeof error.message === 'string') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      errorMessage = error.message;
    } else {
      errorMessage = String(error);
    }
    throw new MaimemoError(`Unexpected error: ${errorMessage}`);
  }
}
