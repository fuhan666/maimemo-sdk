import axios, { AxiosInstance } from 'axios';
import { MaimemoOptions } from './types.js';
import { ValidationError } from './errors.js';

// 导入资源服务
import { VocabularyService } from './resources/vocabulary.js';
import { InterpretationService } from './resources/interpretations.js';
import { NoteService } from './resources/notes.js';
import { NotepadService } from './resources/notepads.js';
import { PhraseService } from './resources/phrases.js';

/**
 * 墨墨背单词API客户端
 */
export class Maimemo {
  private _client: AxiosInstance;

  private _vocabulary?: VocabularyService;
  private _interpretations?: InterpretationService;
  private _notes?: NoteService;
  private _notepads?: NotepadService;
  private _phrases?: PhraseService;

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

    const { axiosConfig } = options;

    // 创建axios实例
    this._client = axios.create({
      ...axiosConfig,
      baseURL: baseUrl,
      headers: {
        ...(axiosConfig?.headers || {}),
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  public get vocabulary(): VocabularyService {
    if (!this._vocabulary) {
      this._vocabulary = new VocabularyService(this._client);
    }
    return this._vocabulary;
  }

  public get interpretations(): InterpretationService {
    if (!this._interpretations) {
      this._interpretations = new InterpretationService(this._client);
    }
    return this._interpretations;
  }

  public get notes(): NoteService {
    if (!this._notes) {
      this._notes = new NoteService(this._client);
    }
    return this._notes;
  }

  public get notepads(): NotepadService {
    if (!this._notepads) {
      this._notepads = new NotepadService(this._client);
    }
    return this._notepads;
  }

  public get phrases(): PhraseService {
    if (!this._phrases) {
      this._phrases = new PhraseService(this._client);
    }
    return this._phrases;
  }
}
