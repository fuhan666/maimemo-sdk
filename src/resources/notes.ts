import { AxiosInstance } from 'axios';
import { BaseService } from './base';
import {
  Note,
  CreateNoteParams,
  UpdateNoteParams,
  ApiResponseData,
} from '../types';

/**
 * 助记资源服务
 */
export class NoteService extends BaseService {
  /**
   * 创建助记服务
   * @param client Axios客户端实例
   */
  constructor(client: AxiosInstance) {
    super(client, '/api/v1/notes');
  }

  /**
   * 获取单词的助记列表
   * @param vocId 单词ID
   * @returns 助记列表
   */
  async list(vocId: string): Promise<Note[]> {
    try {
      const response = await this.client.get(this.basePath, {
        params: { voc_id: vocId },
      });
      const typedData = response.data as ApiResponseData<{ notes: Note[] }>;
      return typedData.data.notes;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 创建助记
   * @param params 创建助记参数
   * @returns 创建的助记
   */
  async create(params: CreateNoteParams): Promise<Note> {
    try {
      const { vocId, noteType, note } = params;

      const response = await this.client.post(this.basePath, {
        note: {
          voc_id: vocId,
          note_type: noteType,
          note,
        },
      });
      const typedData = response.data as ApiResponseData<{ note: Note }>;
      return typedData.data.note;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 更新助记
   * @param id 助记ID
   * @param params 更新助记参数
   * @returns 更新后的助记
   */
  async update(id: string, params: UpdateNoteParams): Promise<Note> {
    try {
      const { noteType, note } = params;

      const response = await this.client.post(`${this.basePath}/${id}`, {
        note: {
          note_type: noteType,
          note,
        },
      });
      const typedData = response.data as ApiResponseData<{ note: Note }>;
      return typedData.data.note;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 删除助记
   * @param id 助记ID
   * @returns 删除结果
   */
  async delete(id: string): Promise<boolean> {
    try {
      const response = await this.client.delete(`${this.basePath}/${id}`);
      const typedData = response.data as ApiResponseData<undefined>;
      return typedData.success; // 在墨墨官方文档中，该接口未标明返回值，实际测试中，该接口返回 errors 和 success 字段
    } catch (error) {
      this.handleError(error);
    }
  }
}
