import { AxiosInstance } from 'axios';
import { BaseService } from './base.js';
import {
  BriefNotepad,
  Notepad,
  NotepadStatus,
  CreateNotepadParams,
  UpdateNotepadParams,
  ApiResponseData,
} from '../types.js';

/**
 * 云词本资源服务
 */
export class NotepadService extends BaseService {
  /**
   * 创建云词本服务
   * @param client Axios客户端实例
   */
  constructor(client: AxiosInstance) {
    super(client, '/api/v1/notepads');
  }

  /**
   * 查询云词本列表
   * @param limit 查询数量
   * @param offset 查询起始位置
   * @param ids 指定的云词本ID列表（可选）
   * @returns 云词本列表
   */
  async list(
    limit: number = 10,
    offset: number = 0,
    ids?: string[],
  ): Promise<BriefNotepad[]> {
    try {
      const params: Record<string, any> = { limit, offset };
      if (ids && ids.length > 0) {
        params.ids = ids;
      }

      const response = await this.client.get(this.basePath, { params });
      const typedData = response.data as ApiResponseData<{
        notepads: BriefNotepad[];
      }>;
      return typedData.data.notepads;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 获取云词本详情
   * @param id 云词本ID
   * @returns 云词本详情
   */
  async get(id: string): Promise<Notepad> {
    try {
      const response = await this.client.get(`${this.basePath}/${id}`);
      const typedData = response.data as ApiResponseData<{ notepad: Notepad }>;
      return typedData.data.notepad;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 创建云词本
   * @param params 创建云词本参数
   * @returns 创建的云词本
   */
  async create(params: CreateNotepadParams): Promise<Notepad> {
    try {
      const {
        title,
        content,
        brief,
        tags,
        status = NotepadStatus.PUBLISHED,
      } = params;

      const response = await this.client.post(this.basePath, {
        notepad: {
          title,
          content,
          brief,
          tags,
          status,
        },
      });
      const typedData = response.data as ApiResponseData<{ notepad: Notepad }>;
      return typedData.data.notepad;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 更新云词本
   * @param id 云词本ID
   * @param params 更新云词本参数
   * @returns 更新后的云词本
   */
  async update(id: string, params: UpdateNotepadParams): Promise<Notepad> {
    try {
      const {
        title,
        content,
        brief,
        tags,
        status = NotepadStatus.PUBLISHED,
      } = params;

      const response = await this.client.post(`${this.basePath}/${id}`, {
        notepad: {
          title,
          content,
          brief,
          tags,
          status,
        },
      });
      const typedData = response.data as ApiResponseData<{ notepad: Notepad }>;
      return typedData.data.notepad;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 删除云词本
   * @param id 云词本ID
   * @returns 删除结果
   */
  async delete(id: string): Promise<boolean> {
    try {
      const response = await this.client.delete(`${this.basePath}/${id}`);
      const typedData = response.data as ApiResponseData<undefined>;
      return typedData.success; // 在墨墨官方文档中，返回值中包含被删除的云词本完整信息，但实际上接口返回值只包含了 errors 和 success 字段
    } catch (error) {
      this.handleError(error);
    }
  }
}
