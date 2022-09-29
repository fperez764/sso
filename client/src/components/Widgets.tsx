import Image from 'next/image';
import { useState } from 'react';
import News from './News';
import SearchBar from './SearchBar';

interface Article {
    title: string;
}

function Widgets({ newsResults, randomPeople }: any) {
    const [articleCount, setArticleCount] = useState(3);
    const [peopleCount, setPeopleCount] = useState(3);

    return (
        <div className="xl:w-[600px] hidden lg:inline ml-8 space-y-5">
            <SearchBar />
            <div className="text-gray-700 space-y-3 bg-gray-100 rounded-xl pt-2 w-[90%] xl:w-[75%]">
                <h4 className="font-bold text-xl px-4">Noticias</h4>
                {newsResults.slice(0, articleCount).map((article: Article) => (
                    <News key={article.title} article={article} />
                ))}
                <button
                    onClick={() => setArticleCount(articleCount + 3)}
                    className="text-abe pl-4 pb-3 hover:text-blue-400"
                >
                    Mostrar más
                </button>
            </div>
            <div className="sticky top-16 text-gray-700 space-y-3 bg-gray-100 pt-2 rounded-xl w-[90%] xl:w-[75%]">
                <h4 className="font-bold text-xl px-4">A quien seguir</h4>
                {randomPeople.slice(0, peopleCount).map((randomUser: any) => (
                    <div
                        className="flex items-center px-4 py -2 cursor-pointer hover:underline text-[14px] truncate"
                        key={randomUser.login.username}
                    >
                        <img
                            className="rounded-full"
                            width="40"
                            height="40"
                            src={randomUser.picture.thumbnail}
                            alt=""
                        />
                        <div className="truncate ml-4 leading-5">
                            <h4 className="font-bold hover:bg-gray-200">
                                {randomUser.login.username}
                            </h4>
                            <h5 className="text-[13px] text-gray-500 truncate">
                                {randomUser.name.first +
                                    ' ' +
                                    randomUser.name.last}
                            </h5>
                        </div>
                        <button className="ml-auto bg-sky-500 text-white rounded-full text-sm px-3.5 py-1.5 font-bold">
                            Seguir
                        </button>
                    </div>
                ))}
                <button
                    onClick={() => setPeopleCount(peopleCount + 3)}
                    className="text-blue-300 pl-4 pb-3 hover:text-blue-400"
                >
                    Mostrar más
                </button>
            </div>
        </div>
    );
}

export default Widgets;
