import {
  Maimemo,
  AuthenticationError,
  NotFoundError,
  APIError,
  InterpretationStatus,
} from 'maimemo';

// 请替换为你的墨墨API令牌
const TOKEN = 'your-token';

// 初始化客户端
const client = new Maimemo(TOKEN);

// 查询单词示例
async function queryVocabulary() {
  try {
    const vocabulary = await client.vocabulary.query('apple');
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

// 创建释义
async function createInterpretation(vocId: string) {
  try {
    const interpretation = await client.interpretations.create({
      vocId,
      interpretation: 'n. 苹果',
      tags: ['简明'],
      status: InterpretationStatus.UNPUBLISHED,
    });
    console.log('创建的释义:', interpretation);
    return interpretation;
  } catch (error) {
    console.error('创建释义失败:', error);
    throw error;
  }
}

// 更新释义
async function updateInterpretation(interpretationId: string) {
  try {
    const updatedInterpretation = await client.interpretations.update(
      interpretationId,
      {
        interpretation: 'n. 苹果; 苹果公司',
        tags: ['简明'],
        status: InterpretationStatus.PUBLISHED,
      },
    );
    console.log('更新的释义:', updatedInterpretation);
    return updatedInterpretation;
  } catch (error) {
    console.error('更新释义失败:', error);
    throw error;
  }
}

// 获取单词释义
async function getInterpretations(vocId: string) {
  try {
    const interpretations = await client.interpretations.list(vocId);
    console.log('释义列表:', interpretations);
    return interpretations;
  } catch (error) {
    console.error('获取释义失败:', error);
    throw error;
  }
}

// 删除释义
async function deleteInterpretation(interpretationId: string) {
  try {
    const deletedResult = await client.interpretations.delete(interpretationId);
    console.log('释义删除结果:', deletedResult);
  } catch (error) {
    console.error('删除释义失败:', error);
    throw error;
  }
}

// 主函数
async function main() {
  try {
    console.log('开始查询单词...');
    const vocabulary = await queryVocabulary();

    console.log('创建单词释义...');
    const newInterpretation = await createInterpretation(vocabulary.id);

    console.log('更新单词释义...');
    await updateInterpretation(newInterpretation.id);

    console.log('获取单词释义...');
    const interpretations = await getInterpretations(vocabulary.id);

    console.log('删除单词释义...');
    if (interpretations.length > 0) {
      await deleteInterpretation(newInterpretation.id);
    }

    console.log('示例运行完成');
  } catch (error) {
    if (error instanceof AuthenticationError) {
      console.error('认证错误:', error.message);
    } else if (error instanceof APIError) {
      console.error(`API错误 (${error.status}):`, error.message);
    } else {
      console.error('示例运行失败:', error);
    }
  }
}

main();
