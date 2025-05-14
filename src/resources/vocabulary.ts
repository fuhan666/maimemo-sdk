import { AxiosInstance } from 'axios';
import { BaseService } from './base';
import { Vocabulary, ApiResponseData } from '../types';

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
   * 查询单词
   * @param spelling 单词拼写
   * @returns 单词信息
   */
  async query(spelling: string): Promise<Vocabulary> {
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
}
