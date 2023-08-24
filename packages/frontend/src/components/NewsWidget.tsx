import React, { useState } from 'react';
import News from './News';

interface Article {
	title: string;
}
function NewsWidget({ newsResults }: any) {
	const [articleCount, setArticleCount] = useState(6);

	return (
		<div className="text-gray-700 space-y-3 bg-gray-100 rounded-xl pt-2 w-[95%] xl:w-[95%]">
			{newsResults.slice(0, articleCount).map((article: Article) => (
				<News key={article.title} article={article} />
			))}
			{articleCount < newsResults.length && (
				<button onClick={() => setArticleCount(articleCount + 3)} className="pb-3 pl-4 text-blue-300 hover:text-blue-400">
					Mostrar más
				</button>
			)}
		</div>
	);
}

export default NewsWidget;
