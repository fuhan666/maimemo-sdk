/**
 * 通用配置类型
 */
export interface MaimemoOptions {
  baseUrl?: string;
  headers?: Record<string, string>;
}

/**
 * 释义状态
 */
export enum InterpretationStatus {
  PUBLISHED = 'PUBLISHED',
  UNPUBLISHED = 'UNPUBLISHED',
  DELETED = 'DELETED',
}

/**
 * 释义类型
 */
export interface Interpretation {
  id: string;
  interpretation: string;
  tags: string[];
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
  tags: string[];
  status?: InterpretationStatus;
}

/**
 * 更新释义参数
 */
export interface UpdateInterpretationParams {
  interpretation: string;
  tags: string[];
  status?: InterpretationStatus;
}

/**
 * 助记状态
 */
export enum NoteStatus {
  PUBLISHED = 'PUBLISHED',
  DELETED = 'DELETED',
}

/**
 * 助记类型
 */
export interface Note {
  id: string;
  note_type: string;
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
  noteType: string;
  note: string;
}

/**
 * 更新助记参数
 */
export interface UpdateNoteParams {
  noteType: string;
  note: string;
}

/**
 * 云词本状态
 */
export enum NotepadStatus {
  PUBLISHED = 'PUBLISHED',
  UNPUBLISHED = 'UNPUBLISHED',
  DELETED = 'DELETED',
}

/**
 * 云词本类型
 */
export enum NotepadType {
  FAVORITE = 'FAVORITE',
  NOTEPAD = 'NOTEPAD',
}

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
  tags: string[];
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
  tags: string[];
  status?: NotepadStatus;
}

/**
 * 更新云词本参数
 */
export interface UpdateNotepadParams {
  title: string;
  content: string;
  brief: string;
  tags: string[];
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
  tags: string[];
  created_time: string;
  updated_time: string;
}

/**
 * 例句状态
 */
export enum PhraseStatus {
  PUBLISHED = 'PUBLISHED',
  DELETED = 'DELETED',
}

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
  tags: string[];
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
  tags: string[];
  origin: string;
}

/**
 * 更新例句参数
 */
export interface UpdatePhraseParams {
  phrase: string;
  interpretation: string;
  tags: string[];
  origin: string;
}

/**
 * 单词类型
 */
export interface Vocabulary {
  id: string;
  spelling: string;
}
