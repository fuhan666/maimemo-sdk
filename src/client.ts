import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { MaimemoOptions } from './types';
import { ValidationError } from './errors';

// 导入资源服务
import { VocabularyService } from './resources/vocabulary';
import { InterpretationService } from './resources/interpretations';
import { NoteService } from './resources/notes';
import { NotepadService } from './resources/notepads';
import { PhraseService } from './resources/phrases';

/**
 * 墨墨背单词API客户端
 */
export class Maimemo {
  private client: AxiosInstance;

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

    // 根据 env 设置 baseUrl
    let baseUrl: string;
    if (options.env === 'development') {
      baseUrl = 'https://open-dev.maimemo.com/open';
    } else {
      // 默认为生产环境
      baseUrl = 'https://open.maimemo.com/open';
    }

    // 创建axios实例
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        Accept: 'application/json',
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
    // 响应拦截器 - 处理响应
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // 处理成功的响应
        return response;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      },
    );
  }
}
