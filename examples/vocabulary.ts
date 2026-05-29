import { Maimemo, AuthenticationError, NotFoundError, APIError } from 'maimemo';

// 请替换为你的墨墨API令牌
const TOKEN = 'your-token';

// 初始化客户端
const client = new Maimemo(TOKEN);

// 推荐入口：根据拼写获取单个单词
async function getVocabulary() {
  try {
    const vocabulary = await client.vocabulary.get('apple');
    console.log('单词信息:', vocabulary);
    return vocabulary;
  } catch (error) {
    if (error instanceof NotFoundError) {
      console.error('单词未找到');
      throw error;
    }
    console.error('获取单词失败:', error);
    throw error;
  }
}

// 兼容旧版本：query(spelling) 会继续保留，但新代码建议使用 get(spelling)
async function queryVocabularyForCompatibility() {
  const vocabulary = await client.vocabulary.query('apple');
  console.log('兼容旧 API 查询结果:', vocabulary);
  return vocabulary;
}

// 按拼写批量查询单词
async function listVocabularyBySpellings() {
  const vocabularies = await client.vocabulary.list({
    spellings: ['apple', 'banana'],
  });
  console.log('按拼写批量查询结果:', vocabularies);
  return vocabularies;
}

// 按单词 ID 批量查询单词
async function listVocabularyByIds(vocId: string) {
  const vocabularies = await client.vocabulary.list({ ids: [vocId] });
  console.log('按 ID 批量查询结果:', vocabularies);
  return vocabularies;
}

// 主函数
async function main() {
  try {
    console.log('开始获取单词...');
    const vocabulary = await getVocabulary();

    console.log('演示旧 API 兼容入口...');
    await queryVocabularyForCompatibility();

    console.log('按拼写批量查询单词...');
    await listVocabularyBySpellings();

    console.log('按 ID 批量查询单词...');
    await listVocabularyByIds(vocabulary.id);

    console.log('单词示例运行完成');
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
