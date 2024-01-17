import { invoke } from '@tauri-apps/api';
import { open, save } from '@tauri-apps/api/dialog';
import { EditorMode, useAppStore } from '../hooks/useAppStore';
import { useContentStore } from '../hooks/useContentStore';
import { FILE_FORMATS } from '../utils/constants';

export const MenuBar = () => {
	const { editorMode, switchEditorMode, currentFile, setCurrentFile } =
		useAppStore((state) => state);
	const { content, setContent } = useContentStore((state) => state);

	const handleNew = () => {
		setContent('');
		setCurrentFile('');
	};

	const handleOpen = async () => {
		const selected = await open({
			multiple: false,
			filters: FILE_FORMATS,
		});
		const selectedFile = Array.isArray(selected) ? selected[0] : selected;
		setCurrentFile(selectedFile ?? '');
	};

	const handleSave = async () => {
		const selected = await save({
			defaultPath: currentFile,
			filters: FILE_FORMATS,
		});
		const selectedFile = Array.isArray(selected) ? selected[0] : selected;
		if (selectedFile === undefined) return;
		if (selectedFile.endsWith('.ybf')) {
			invoke('save_ybf', {
				filename: selectedFile,
				content,
				// TODO: ask for password
				password: '1234',
			}).then(() => {
				console.log('saved');
			});
		} else {
			invoke('save_md', { filename: selectedFile, content }).then(() => {
				console.log('saved');
			});
		}
	};

	return (
		<div className="flex justify-between py-2 px-4 mb-2 border-b border-black">
			<div className="flex gap-4">
				<MenuButton onClick={handleNew}>New</MenuButton>
				<MenuButton onClick={handleOpen}>Open</MenuButton>
				<MenuButton onClick={handleSave}>Save</MenuButton>
			</div>
			<MenuButton onClick={switchEditorMode}>
				{editorMode === EditorMode.Edit ? 'Preview' : 'Edit'}
			</MenuButton>
		</div>
	);
};

type Props = {
	children: JSX.Element | string;
	onClick: () => void;
};

const MenuButton = ({ children, onClick }: Props) => {
	return (
		<button className="border px-2 py-1 border-black " onClick={onClick}>
			{children}
		</button>
	);
};
