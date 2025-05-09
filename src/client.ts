import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { DEFAULT_OPTIONS } from './config';
import { MaimemoOptions } from './types';
import { AuthenticationError, MaimemoError, ValidationError } from './errors';

// 导入资源服务
import { VocabularyService } from './resources/vocabulary';
import { InterpretationService } from './resources/interpretations';
import { NoteService } from './resources/notes';
import { NotepadService } from './resources/notepads';
import { PhraseService } from './resources/phrases';

/**
 * 请求重试配置选项
 */
export interface RetryConfig {
  enabled: boolean;
  retries: number;
  retryDelay: number;
  retryCondition: (error: AxiosError) => boolean;
}

/**
 * 墨墨背单词API客户端
 */
export class Maimemo {
  private client: AxiosInstance;
  private options: MaimemoOptions;
  private retryConfig: RetryConfig;

  // 资源服务
  public vocabulary: VocabularyService;
  public interpretations: InterpretationService;
  public notes: NoteService;
  public notepads: NotepadService;
  public phrases: PhraseService;

  /**
   * 创建墨墨背单词API客户端
   * @param token 认证令牌
   * @param options 可选配置项
   */
  constructor(token: string, options: MaimemoOptions = {}) {
    if (!token) {
      throw new ValidationError('Token is required');
    }

    this.options = { ...DEFAULT_OPTIONS, ...options };

    // 设置请求重试配置
    this.retryConfig = {
      enabled: options.retryEnabled ?? true,
      retries: options.maxRetries ?? 3,
      retryDelay: options.retryDelay ?? 1000,
      retryCondition: (error: AxiosError) => {
        // 默认只在网络错误或5xx错误时重试
        return Boolean(
          error.code === 'ECONNABORTED' || !error.response || error.response.status >= 500,
        );
      },
    };

    // 创建axios实例
    this.client = axios.create({
      baseURL: this.options.baseUrl,
      timeout: this.options.timeout,
      headers: {
        ...this.options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    // 设置请求拦截器
    this.setupInterceptors();

    // 初始化资源服务
    this.vocabulary = new VocabularyService(this.client);
    this.interpretations = new InterpretationService(this.client);
    this.notes = new NoteService(this.client);
    this.notepads = new NotepadService(this.client);
    this.phrases = new PhraseService(this.client);
  }

  /**
   * 设置请求拦截器
   */
  private setupInterceptors(): void {
    // 请求拦截器 - 可以在这里添加通用的请求处理逻辑
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 在请求发送前可以进行一些处理
        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      },
    );

    // 响应拦截器 - 处理响应并添加重试逻辑
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // 处理成功的响应
        return response;
      },
      async (error: AxiosError) => {
        // 请求失败的处理逻辑
        const config = error.config as AxiosRequestConfig & { _retryCount?: number };

        // 如果未启用重试或已达最大重试次数，直接返回错误
        if (
          !this.retryConfig.enabled ||
          !config ||
          config._retryCount === undefined ||
          config._retryCount >= this.retryConfig.retries ||
          (this.retryConfig.retryCondition && !this.retryConfig.retryCondition(error))
        ) {
          return Promise.reject(error);
        }

        // 增加重试计数
        config._retryCount = (config._retryCount || 0) + 1;

        // 延迟后重试
        const delay = this.retryConfig.retryDelay;
        await new Promise((resolve) => setTimeout(resolve, delay));

        // 重新发送请求
        return this.client(config);
      },
    );
  }

  /**
   * 检查用户认证状态
   * @returns 如果认证有效返回true
   */
  async checkAuth(): Promise<boolean> {
    try {
      // 尝试一个简单的API调用来验证认证状态
      await this.client.get('/api/v1/vocabulary', {
        params: { spelling: 'test' },
      });
      return true;
    } catch (error) {
      if (error instanceof AuthenticationError) {
        return false;
      }
      throw error;
    }
  }
}
