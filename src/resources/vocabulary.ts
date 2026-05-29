import { AxiosInstance } from 'axios';
import { BaseService } from './base.js';
import { ApiResponseData, ListVocabularyParams, Vocabulary } from '../types.js';

/**
 * 单词资源服务
 */
export class VocabularyService extends BaseService {
  /**
   * 创建单词服务
   * @param client Axios客户端实例
   */
  constructor(client: AxiosInstance) {
    super(client, '/api/v1/vocabulary');
  }

  /**
   * 获取单词
   * @param spelling 单词拼写
   * @returns 单词信息
   */
  async get(spelling: string): Promise<Vocabulary> {
    try {
      const response = await this.client.get(this.basePath, {
        params: { spelling },
      });
      const typedData = response.data as ApiResponseData<{ voc: Vocabulary }>;
      return typedData.data.voc;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 查询单词
   * @deprecated 请使用 get(spelling)。该方法为兼容旧版本保留，行为不变。
   * @param spelling 单词拼写
   * @returns 单词信息
   */
  async query(spelling: string): Promise<Vocabulary> {
    return this.get(spelling);
  }

  /**
   * 批量查询单词
   * @param params 批量查询参数，可按 spellings 或 ids 查询
   * @returns 单词列表
   */
  async list(params: ListVocabularyParams): Promise<Vocabulary[]> {
    try {
      const response = await this.client.post(`${this.basePath}/query`, params);
      const typedData = response.data as ApiResponseData<{ voc: Vocabulary[] }>;
      return typedData.data.voc;
    } catch (error) {
      this.handleError(error);
    }
  }
}
