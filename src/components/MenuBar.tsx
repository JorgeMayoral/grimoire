import { invoke } from '@tauri-apps/api';
import { open, save } from '@tauri-apps/api/dialog';
import { EditorMode, useAppStore } from '../hooks/useAppStore';
import { useContentStore } from '../hooks/useContentStore';
import { FILE_FORMATS } from '../utils/constants';
import { FileIcon } from './icons/File';
import { FolderOpenIcon } from './icons/FolderOpen';
import { FloppyIcon } from './icons/Floppy';
import { EyeIcon } from './icons/Eye';
import { EditIcon } from './icons/Edit';

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
		<div className="flex justify-between py-2 px-4 mb-2 border-b border-black bg-white sticky top-0">
			<div className="flex gap-4">
				<MenuButton onClick={handleNew}>
					<div className="flex gap-2 items-center">
						<FileIcon size={16} />
						<span>New</span>
					</div>
				</MenuButton>
				<MenuButton onClick={handleOpen}>
					<div className="flex gap-2 items-center">
						<FolderOpenIcon size={16} />
						<span>Open</span>
					</div>
				</MenuButton>
				<MenuButton onClick={handleSave}>
					<div className="flex gap-2 items-center">
						<FloppyIcon size={16} />
						<span>Save</span>
					</div>
				</MenuButton>
			</div>
			<MenuButton onClick={switchEditorMode} className="min-w-[104px]">
				{editorMode === EditorMode.Edit ? (
					<div className="flex gap-2 items-center">
						<EyeIcon size={16} />
						<span>Preview</span>
					</div>
				) : (
					<div className="flex justify-between items-center">
						<EditIcon size={16} />
						<span>Edit</span>
					</div>
				)}
			</MenuButton>
		</div>
	);
};

type Props = {
	className?: string;
	children: JSX.Element | string;
	onClick: () => void;
};

const MenuButton = ({ className, children, onClick }: Props) => {
	const classes = `border px-2 py-1 border-black ${className}`;
	return (
		<button className={classes} onClick={onClick}>
			{children}
		</button>
	);
};
