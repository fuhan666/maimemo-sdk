import { Maimemo, AuthenticationError, NotFoundError, APIError } from '../src';

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

// 创建释义示例
async function createInterpretation(vocId: string) {
  try {
    const interpretation = await client.interpretations.create({
      vocId,
      interpretation: 'n. 苹果',
      tags: ['简明'],
    });
    console.log('创建的释义:', interpretation);
    return interpretation;
  } catch (error) {
    console.error('创建释义失败:', error);
    throw error;
  }
}

// 更新释义示例
async function updateInterpretation(vocId: string, interpretationId: string) {
  try {
    const updatedInterpretation = await client.interpretations.update(
      interpretationId,
      {
        interpretation: 'n. 苹果; 苹果公司',
        tags: ['简明'],
      },
    );
    console.log('更新的释义:', updatedInterpretation);
    return updatedInterpretation;
  } catch (error) {
    console.error('更新释义失败:', error);
    throw error;
  }
}

// 获取单词释义示例
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

// 删除释义示例
async function deleteInterpretation(interpretationId: string) {
  try {
    await client.interpretations.delete(interpretationId);
    console.log('释义删除成功');
    return true;
  } catch (error) {
    console.error('删除释义失败:', error);
    throw error;
  }
}

// 验证认证状态
async function checkAuthentication() {
  try {
    const isAuthenticated = await client.checkAuth();
    if (isAuthenticated) {
      console.log('认证有效');
      return true;
    } else {
      console.log('认证无效');
      return false;
    }
  } catch (error) {
    console.error('检查认证状态失败:', error);
    return false;
  }
}

// 主函数
async function main() {
  try {
    console.log('验证认证状态...');
    const isAuthenticated = await checkAuthentication();
    if (!isAuthenticated) {
      console.error('认证失败，请检查token');
      return;
    }

    console.log('开始查询单词...');
    const vocabulary = await queryVocabulary();

    console.log('创建单词释义...');
    const newInterpretation = await createInterpretation(vocabulary.id);

    console.log('更新单词释义...');
    await updateInterpretation(vocabulary.id, newInterpretation.id);

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
