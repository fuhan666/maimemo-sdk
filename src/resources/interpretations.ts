import { AxiosInstance } from 'axios';
import { BaseService } from './base';
import {
  Interpretation,
  InterpretationStatus,
  CreateInterpretationParams,
  UpdateInterpretationParams,
} from '../types';

/**
 * 释义资源服务
 */
export class InterpretationService extends BaseService {
  /**
   * 创建释义服务
   * @param client Axios客户端实例
   */
  constructor(client: AxiosInstance) {
    super(client, '/api/v1/interpretations');
  }

  /**
   * 获取单词的释义列表
   * @param vocId 单词ID
   * @returns 释义列表
   */
  async list(vocId: string): Promise<Interpretation[]> {
    try {
      const response = await this.client.get(this.basePath, {
        params: { voc_id: vocId },
      });
      return response.data.interpretations;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * 创建释义
   * @param params 创建释义参数
   * @returns 创建的释义
   */
  async create(params: CreateInterpretationParams): Promise<Interpretation> {
    try {
      const { vocId, interpretation, tags, status = InterpretationStatus.PUBLISHED } = params;

      const response = await this.client.post(this.basePath, {
        interpretation: {
          voc_id: vocId,
          interpretation,
          tags,
          status,
        },
      });
      return response.data.interpretation;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * 更新释义
   * @param id 释义ID
   * @param params 更新释义参数
   * @returns 更新后的释义
   */
  async update(id: string, params: UpdateInterpretationParams): Promise<Interpretation> {
    try {
      const { interpretation, tags, status = InterpretationStatus.PUBLISHED } = params;

      const response = await this.client.post(`${this.basePath}/${id}`, {
        interpretation: {
          interpretation,
          tags,
          status,
        },
      });
      return response.data.interpretation;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * 删除释义
   * @param id 释义ID
   */
  async delete(id: string): Promise<void> {
    try {
      await this.client.delete(`${this.basePath}/${id}`);
    } catch (error) {
      this.handleError(error);
    }
  }
}
