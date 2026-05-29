import { AxiosInstance } from 'axios';
import { BaseService } from './base.js';
import {
  AddWordsParams,
  AdvanceStudyParams,
  ApiResponseData,
  GetTodayItemsParams,
  QueryStudyRecordsParams,
  QueryStudyRecordsResult,
  StudyProgress,
  StudyTodayItem,
} from '../types.js';

/**
 * 学习数据资源服务（公测）
 */
export class StudyService extends BaseService {
  /**
   * 创建学习数据服务
   * @param client Axios客户端实例
   */
  constructor(client: AxiosInstance) {
    super(client, '/api/v1/study');
  }

  /**
   * 获取今日学习进度
   * @returns 今日学习进度
   */
  async getStudyProgress(): Promise<StudyProgress> {
    try {
      const response = await this.client.post(
        `${this.basePath}/get_study_progress`,
      );
      const typedData = response.data as ApiResponseData<{
        progress: StudyProgress;
      }>;
      return typedData.data.progress;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 获取今日学习单词
   * @param params 查询参数
   * @returns 今日学习单词列表
   */
  async getTodayItems(
    params: GetTodayItemsParams = {},
  ): Promise<StudyTodayItem[]> {
    try {
      const response = await this.client.post(
        `${this.basePath}/get_today_items`,
        params,
      );
      const typedData = response.data as ApiResponseData<{
        today_items: StudyTodayItem[];
      }>;
      return typedData.data.today_items;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 查询学习记录
   * @param params 查询参数
   * @returns 学习记录和总数
   */
  async queryStudyRecords(
    params: QueryStudyRecordsParams = {},
  ): Promise<QueryStudyRecordsResult> {
    try {
      const response = await this.client.post(
        `${this.basePath}/query_study_records`,
        params,
      );
      const typedData =
        response.data as ApiResponseData<QueryStudyRecordsResult>;
      return typedData.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 添加单词到学习计划
   * @param params 添加参数
   * @returns 成功添加的数量
   */
  async addWords(params: AddWordsParams): Promise<number> {
    try {
      const response = await this.client.post(
        `${this.basePath}/add_words`,
        params,
      );
      const typedData = response.data as ApiResponseData<{
        added_count: number;
      }>;
      return typedData.data.added_count;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 提前复习单词
   * @param params 提前复习参数
   * @returns 成功提前复习的数量
   */
  async advanceStudy(params: AdvanceStudyParams): Promise<number> {
    try {
      const response = await this.client.post(
        `${this.basePath}/advance_study`,
        params,
      );
      const typedData = response.data as ApiResponseData<{
        advanced_count: number;
      }>;
      return typedData.data.advanced_count;
    } catch (error) {
      this.handleError(error);
    }
  }
}
