import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useContentStore } from '../hooks/useContentStore';

export const Preview = () => {
	const { content } = useContentStore((state) => state);

	return (
		<div className="p-4">
			<Markdown className="prose" remarkPlugins={[remarkGfm]}>
				{content}
			</Markdown>
		</div>
	);
};
