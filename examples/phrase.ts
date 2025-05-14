import { Maimemo, AuthenticationError, NotFoundError, APIError } from '../src';
import { CreatePhraseParams, UpdatePhraseParams } from '../src/types';

// 请替换为你的墨墨API令牌
const TOKEN = 'your-token';

// 初始化客户端
const client = new Maimemo(TOKEN);

// 查询单词（获取vocId，为后续操作做准备）
async function queryVocabulary(spelling: string) {
  try {
    const vocabulary = await client.vocabulary.query(spelling);
    console.log('单词信息:', vocabulary);
    return vocabulary;
  } catch (error) {
    if (error instanceof NotFoundError) {
      console.error('单词未找到');
      throw error;
    }
    console.error('查询单词失败:', error);
    throw error;
  }
}

// 获取例句列表
async function listPhrases(vocId: string) {
  try {
    const phrases = await client.phrases.list(vocId);
    console.log('例句列表:', phrases);
    return phrases;
  } catch (error) {
    console.error('获取例句列表失败:', error);
    throw error;
  }
}

// 创建例句
async function createPhrase(vocId: string) {
  try {
    const createParams: CreatePhraseParams = {
      vocId,
      phrase: 'This is an apple.',
      interpretation: '这是一个苹果。',
      tags: ['四级', '短语'],
      origin: '自定义',
    };
    const newPhrase = await client.phrases.create(createParams);
    console.log('创建的例句:', newPhrase);
    return newPhrase;
  } catch (error) {
    console.error('创建例句失败:', error);
    throw error;
  }
}

// 更新例句
async function updatePhrase(phraseId: string) {
  try {
    const updateParams: UpdatePhraseParams = {
      phrase: 'This is my apple.',
      interpretation: '这是我的苹果。',
      tags: ['六级', '考研', '短语'],
      origin: '自定义-更新',
    };
    const updatedPhrase = await client.phrases.update(phraseId, updateParams);
    console.log('更新的例句:', updatedPhrase);
    return updatedPhrase;
  } catch (error) {
    console.error('更新例句失败:', error);
    throw error;
  }
}

// 删除例句
async function deletePhrase(phraseId: string) {
  try {
    const deletedResult = await client.phrases.delete(phraseId);
    console.log('删除结果:', deletedResult);
  } catch (error) {
    console.error('删除例句失败:', error);
    throw error;
  }
}

// 主函数
async function main() {
  try {
    console.log('开始查询单词...');
    // 确保查询一个存在的单词，以获得有效的 vocId
    const vocabulary = await queryVocabulary('apple');
    if (!vocabulary) {
      console.error('未能获取单词信息，示例无法继续。');
      return;
    }

    console.log('获取单词的例句列表...');
    await listPhrases(vocabulary.id);

    console.log('创建例句...');
    const newPhrase = await createPhrase(vocabulary.id);

    console.log('更新例句...');
    await updatePhrase(newPhrase.id);

    console.log('删除例句...');
    await deletePhrase(newPhrase.id);

    console.log('例句示例运行完成');
  } catch (error) {
    if (error instanceof AuthenticationError) {
      console.error('认证错误:', error.message);
    } else if (error instanceof APIError) {
      console.error(`API错误 (${error.status}):`, error.data);
    } else {
      console.error('示例运行失败:', error);
    }
  }
}

main();
