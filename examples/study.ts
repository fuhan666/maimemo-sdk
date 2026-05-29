import { Maimemo, AuthenticationError, APIError } from 'maimemo';

// 请替换为你的墨墨API令牌
const TOKEN = 'your-token';

// 初始化客户端
const client = new Maimemo(TOKEN);

// 学习数据接口处于官方公测阶段，使用前请确认账号已在 App 中开启自动同步。

// 获取今日学习进度
async function getStudyProgress() {
  const progress = await client.study.getStudyProgress();
  console.log('今日学习进度:', progress);
  return progress;
}

// 获取今日未完成学习单词
async function getUnfinishedTodayItems() {
  const todayItems = await client.study.getTodayItems({
    is_finished: false,
    limit: 20,
  });
  console.log('今日未完成学习单词:', todayItems);
  return todayItems;
}

// 查询指定单词的学习记录
async function queryStudyRecords() {
  const result = await client.study.queryStudyRecords({
    spellings: ['apple', 'banana'],
    limit: 20,
  });
  console.log('学习记录:', result.records);
  console.log('学习记录数量:', result.count);
  return result;
}

// 添加单词到学习计划
async function addWordsToStudyPlan(vocId: string) {
  const addedCount = await client.study.addWords({
    words: [{ id: vocId }],
    advance: false,
  });
  console.log('成功添加数量:', addedCount);
  return addedCount;
}

// 提前复习单词
async function advanceStudy(vocId: string) {
  const advancedCount = await client.study.advanceStudy({
    voc_ids: [vocId],
  });
  console.log('成功提前复习数量:', advancedCount);
  return advancedCount;
}

// 主函数
async function main() {
  try {
    console.log('获取今日学习进度...');
    await getStudyProgress();

    console.log('获取今日未完成学习单词...');
    const todayItems = await getUnfinishedTodayItems();

    console.log('查询学习记录...');
    await queryStudyRecords();

    const firstVocId = todayItems[0]?.voc_id;
    if (!firstVocId) {
      console.log('今日学习单词为空，跳过添加和提前复习示例。');
      return;
    }

    console.log('添加单词到学习计划...');
    await addWordsToStudyPlan(firstVocId);

    console.log('提前复习单词...');
    await advanceStudy(firstVocId);

    console.log('学习数据示例运行完成');
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
