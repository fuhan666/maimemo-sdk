/**
 * 通用配置类型
 */
export interface MaimemoOptions {
  env?: 'production' | 'development';
}

/**
 * API响应数据接口
 */
export interface ApiResponseData<T = any> {
  data: T;
  errors: Array<{
    code?: string;
    msg?: string;
    info?: string;
    [key: string]: unknown;
  }>;
  success: boolean;
}

/**
 * 释义状态
 */
export const InterpretationStatus = {
  PUBLISHED: 'PUBLISHED',
  UNPUBLISHED: 'UNPUBLISHED',
  DELETED: 'DELETED',
} as const;

export type InterpretationStatus =
  (typeof InterpretationStatus)[keyof typeof InterpretationStatus];

/**
 * 释义标签类型
 */
export type InterpretationTag =
  | '考研'
  | '简明'
  | '详细'
  | '英英'
  | '小学'
  | '初中'
  | '高中'
  | '四级'
  | '六级'
  | '专升本'
  | '专四'
  | '专八'
  | '考博'
  | '雅思'
  | '托福'
  | '托业'
  | '新概念'
  | 'GRE'
  | 'GMAT'
  | 'BEC'
  | 'MBA'
  | 'SAT'
  | 'ACT'
  | '法学'
  | '医学'
  | (string & {});

/**
 * 释义类型
 */
export interface Interpretation {
  id: string;
  interpretation: string;
  tags: InterpretationTag[];
  status: InterpretationStatus;
  created_time: string;
  updated_time: string;
}

/**
 * 创建释义参数
 */
export interface CreateInterpretationParams {
  vocId: string;
  interpretation: string;
  tags: InterpretationTag[];
  status: InterpretationStatus;
}

/**
 * 更新释义参数
 */
export interface UpdateInterpretationParams {
  interpretation: string;
  tags: InterpretationTag[];
  status: InterpretationStatus;
}

/**
 * 助记状态
 */
export const NoteStatus = {
  PUBLISHED: 'PUBLISHED',
  DELETED: 'DELETED',
} as const;

export type NoteStatus = (typeof NoteStatus)[keyof typeof NoteStatus];

/**
 * 助记类型
 */
export type NoteType =
  | '词根词缀'
  | '固定搭配'
  | '近反义词'
  | '派生'
  | '词源'
  | '辨析'
  | '语法'
  | '联想'
  | '谐音'
  | '串记'
  | '口诀'
  | '扩展'
  | '合成'
  | '其他'
  | (string & {});

/**
 * 助记
 */
export interface Note {
  id: string;
  note_type: NoteType;
  note: string;
  status: NoteStatus;
  created_time: string;
  updated_time: string;
}

/**
 * 创建助记参数
 */
export interface CreateNoteParams {
  vocId: string;
  noteType: NoteType;
  note: string;
}

/**
 * 更新助记参数
 */
export interface UpdateNoteParams {
  noteType: NoteType;
  note: string;
}

/**
 * 云词本状态
 */
export const NotepadStatus = {
  PUBLISHED: 'PUBLISHED',
  UNPUBLISHED: 'UNPUBLISHED',
  DELETED: 'DELETED',
} as const;

export type NotepadStatus = (typeof NotepadStatus)[keyof typeof NotepadStatus];

/**
 * 云词本类型
 */
export const NotepadType = {
  FAVORITE: 'FAVORITE',
  NOTEPAD: 'NOTEPAD',
} as const;

export type NotepadType = (typeof NotepadType)[keyof typeof NotepadType];

/**
 * 云词本标签类型
 */
export type NotepadTag =
  | '小学'
  | '初中'
  | '高中'
  | '大学教科书'
  | '四级'
  | '六级'
  | '专四'
  | '专八'
  | '考研'
  | '新概念'
  | 'SAT'
  | '托福'
  | '雅思'
  | 'GRE'
  | 'GMAT'
  | '托业'
  | 'BEC'
  | '词典'
  | '词频'
  | '其他'
  | (string & {});

/**
 * 云词本解析结果项目类型
 */
export interface NotepadParsedItem {
  type: 'CHAPTER' | 'WORD';
  data: {
    chapter: string;
    word?: string;
  };
}

/**
 * 云词本类型
 */
export interface Notepad {
  id: string;
  type: NotepadType;
  creator: number;
  status: NotepadStatus;
  content: string;
  title: string;
  brief: string;
  tags: NotepadTag[];
  list: NotepadParsedItem[];
  created_time: string;
  updated_time: string;
}

/**
 * 创建云词本参数
 */
export interface CreateNotepadParams {
  title: string;
  content: string;
  brief: string;
  tags: NotepadTag[];
  status?: NotepadStatus;
}

/**
 * 更新云词本参数
 */
export interface UpdateNotepadParams {
  title: string;
  content: string;
  brief: string;
  tags: NotepadTag[];
  status?: NotepadStatus;
}

/**
 * 简要云词本类型
 */
export interface BriefNotepad {
  id: string;
  type: NotepadType;
  creator: number;
  status: NotepadStatus;
  title: string;
  brief: string;
  tags: NotepadTag[];
  created_time: string;
  updated_time: string;
}

/**
 * 例句状态
 */
export const PhraseStatus = {
  PUBLISHED: 'PUBLISHED',
  DELETED: 'DELETED',
} as const;

export type PhraseStatus = (typeof PhraseStatus)[keyof typeof PhraseStatus];

/**
 * 例句标签类型
 */
export type PhraseTag =
  | '小学'
  | '初中'
  | '高中'
  | '四级'
  | '六级'
  | '专升本'
  | '专四'
  | '专八'
  | '考研'
  | '考博'
  | '新概念'
  | 'SAT'
  | '托福'
  | '雅思'
  | 'GRE'
  | 'GMAT'
  | '托业'
  | 'BEC'
  | '词典'
  | 'MBA'
  | 'ACT'
  | '法学'
  | '医学'
  | '短语'
  | (string & {});

/**
 * 例句中的单词高亮区间
 */
export interface PhraseHighlightRange {
  start: number;
  end: number;
}

/**
 * 例句类型
 */
export interface Phrase {
  id: string;
  phrase: string;
  interpretation: string;
  tags: PhraseTag[];
  highlight: PhraseHighlightRange[];
  status: PhraseStatus;
  created_time: string;
  updated_time: string;
  origin: string;
}

/**
 * 创建例句参数
 */
export interface CreatePhraseParams {
  vocId: string;
  phrase: string;
  interpretation: string;
  tags: PhraseTag[];
  origin: string;
}

/**
 * 更新例句参数
 */
export interface UpdatePhraseParams {
  phrase: string;
  interpretation: string;
  tags: PhraseTag[];
  origin: string;
}

/**
 * 单词类型
 */
export interface Vocabulary {
  id: string;
  spelling: string;
}
