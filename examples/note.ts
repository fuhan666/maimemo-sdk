import { Maimemo, AuthenticationError, NotFoundError, APIError } from '../src';
import { CreateNoteParams, UpdateNoteParams } from '../src/types';

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

// 获取助记列表
async function listNotes(vocId: string) {
	try {
		const notes = await client.notes.list(vocId);
		console.log('助记列表:', notes);
		return notes;
	} catch (error) {
		console.error('获取助记列表失败:', error);
		throw error;
	}
}

// 创建助记
async function createNote(vocId: string) {
	try {
		const createParams: CreateNoteParams = {
			vocId,
			noteType: '联想',
			note: '这是一个通过API创建的助记。',
		};
		const newNote = await client.notes.create(createParams);
		console.log('创建的助记:', newNote);
		return newNote;
	} catch (error) {
		console.error('创建助记失败:', error);
		throw error;
	}
}

// 更新助记
async function updateNote(noteId: string) {
	try {
		const updateParams: UpdateNoteParams = {
			noteType: '词根词缀',
			note: '这是一个通过API更新的助记，关于词根词缀。',
		};
		const updatedNote = await client.notes.update(noteId, updateParams);
		console.log('更新的助记:', updatedNote);
		return updatedNote;
	} catch (error) {
		console.error('更新助记失败:', error);
		throw error;
	}
}

// 删除助记
async function deleteNote(noteId: string) {
	try {
		const deletedResult = await client.notes.delete(noteId);
		console.log('删除结果:', deletedResult);
	} catch (error) {
		console.error('删除助记失败:', error);
		throw error;
	}
}

// 主函数
async function main() {
	try {
		console.log('开始查询单词...');
		const vocabulary = await queryVocabulary('apple');
		if (!vocabulary) {
			console.error('未能获取单词信息，示例无法继续。');
			return;
		}

		console.log('获取单词的助记列表...');
		await listNotes(vocabulary.id);

		console.log('创建助记...');
		const newNote = await createNote(vocabulary.id);

		console.log('更新助记...');
		await updateNote(newNote.id);

		console.log('删除助记...');
		await deleteNote(newNote.id);

		console.log('助记示例运行完成');
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