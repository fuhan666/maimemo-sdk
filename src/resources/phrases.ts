import { AxiosInstance } from 'axios';
import { BaseService } from './base';
import { Phrase, CreatePhraseParams, UpdatePhraseParams } from '../types';

/**
 * 例句资源服务
 */
export class PhraseService extends BaseService {
  /**
   * 创建例句服务
   * @param client Axios客户端实例
   */
  constructor(client: AxiosInstance) {
    super(client, '/api/v1/phrases');
  }

  /**
   * 获取单词的例句列表
   * @param vocId 单词ID
   * @returns 例句列表
   */
  async list(vocId: string): Promise<Phrase[]> {
    try {
      const response = await this.client.get(this.basePath, {
        params: { voc_id: vocId },
      });
      return response.data.phrases;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * 创建例句
   * @param params 创建例句参数
   * @returns 创建的例句
   */
  async create(params: CreatePhraseParams): Promise<Phrase> {
    try {
      const { vocId, phrase, interpretation, tags, origin } = params;

      const response = await this.client.post(this.basePath, {
        phrase: {
          voc_id: vocId,
          phrase,
          interpretation,
          tags,
          origin,
        },
      });
      return response.data.phrase;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * 更新例句
   * @param id 例句ID
   * @param params 更新例句参数
   * @returns 更新后的例句
   */
  async update(id: string, params: UpdatePhraseParams): Promise<Phrase> {
    try {
      const { phrase, interpretation, tags, origin } = params;

      const response = await this.client.post(`${this.basePath}/${id}`, {
        phrase: {
          phrase,
          interpretation,
          tags,
          origin,
        },
      });
      return response.data.phrase;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * 删除例句
   * @param id 例句ID
   * @returns 删除的例句
   */
  async delete(id: string): Promise<Phrase> {
    try {
      const response = await this.client.delete(`${this.basePath}/${id}`);
      return response.data.phrase;
    } catch (error) {
      return this.handleError(error);
    }
  }
}
