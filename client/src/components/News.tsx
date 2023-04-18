
function News({ article }: any) {
    return (
        <a href={article.url} target="_blank">
            <div className="flex items-center justify-between px-4 py-2 space-x-1 transition duration-200 hover:bg-gray-200">
                <div className="space-y-0.5">
                    <h6 className="text-sm font-bold">{article.title}</h6>
                    <p className="text-xs font-medium text-gray-500">
                        {article.source.name} - {article.publishedAt}
                    </p>
                    <p className="text-xs text-black">
                        {article.description}
                    </p>
                </div>
                <img className='w-1/2 rounded-xl'
                    alt='article'
                    src={article.urlToImage}
                />
            </div>
        </a>
    );
}
0.30000000000000004
export default News;
