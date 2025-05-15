import {
  Maimemo,
  AuthenticationError,
  NotFoundError,
  APIError,
  NotepadStatus,
  CreateNotepadParams,
  UpdateNotepadParams,
} from 'maimemo';

// 请替换为你的墨墨API令牌
const TOKEN = 'your-token';

// 初始化客户端
const client = new Maimemo(TOKEN);

// 查询云词本列表
async function listNotepads() {
  try {
    const notepads = await client.notepads.list(10, 0);
    console.log('云词本列表:', notepads);
    return notepads;
  } catch (error) {
    console.error('查询云词本列表失败:', error);
    throw error;
  }
}

// 创建云词本
async function createNotepad() {
  try {
    const createParams: CreateNotepadParams = {
      title: 'maimemo-sdk',
      content:
        '#自定义章节名1\nmother\nchina\ncarry with\n#自定义章节名2\nmother\nChina\nwatching TV',
      brief: '示例云词本',
      tags: ['四级', '词频'],
      status: NotepadStatus.UNPUBLISHED,
    };
    const newNotepad = await client.notepads.create(createParams);
    console.log('创建的云词本:', newNotepad);
    return newNotepad;
  } catch (error) {
    console.error('创建云词本失败:', error);
    throw error;
  }
}

// 获取云词本详情
async function getNotepad(notepadId: string) {
  try {
    const notepad = await client.notepads.get(notepadId);
    console.log('云词本详情:', notepad);
    return notepad;
  } catch (error) {
    if (error instanceof NotFoundError) {
      console.error('云词本未找到');
      throw error;
    }
    console.error('获取云词本详情失败:', error);
    throw error;
  }
}

// 更新云词本
async function updateNotepad(notepadId: string) {
  try {
    const updateParams: UpdateNotepadParams = {
      title: 'maimemo-sdk-updated',
      content:
        '#更新章节名1\nmother\nchina\ncarry with\n#更新章节名2\nmother\nChina\nwatching TV',
      brief: '更新后的示例云词本',
      tags: ['四级', '托福', '其他'],
      status: NotepadStatus.UNPUBLISHED,
    };
    const updatedNotepad = await client.notepads.update(
      notepadId,
      updateParams,
    );
    console.log('更新后的云词本:', updatedNotepad);
    return updatedNotepad;
  } catch (error) {
    console.error('更新云词本失败:', error);
    throw error;
  }
}

// 删除云词本
async function deleteNotepad(notepadId: string) {
  try {
    const deletedResult = await client.notepads.delete(notepadId);
    console.log('删除云词本结果:', deletedResult);
  } catch (error) {
    console.error('删除云词本失败:', error);
    throw error;
  }
}

// 主函数
async function main() {
  try {
    console.log('开始查询云词本列表...');
    await listNotepads();

    console.log('创建云词本...');
    const newNotepad = await createNotepad();

    console.log('获取云词本详情...');
    await getNotepad(newNotepad.id);

    console.log('更新云词本...');
    await updateNotepad(newNotepad.id);

    console.log('删除云词本...');
    await deleteNotepad(newNotepad.id);

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
