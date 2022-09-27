// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
    name: string;
    text: string;
    username: string;
    profileImg: string;
    image: string;
};

type Res = {
    message: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Res>
) {
    const data: Data = JSON.parse(req.body)
    const mutations = {
        mutations:[{
            create: {
                _type: 'tweet',
                text: data.text,
                username: data.username,
                blockTweet: false,
                profileImg: data.profileImg,
                image: data.image,
            }
        }]
    }

    const apiEndPoint = 'https://${process.env.NEXT_PUBLIC_API?}.api.backend?/SS';
    const result = await fetch(apiEndPoint, {
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${process.env.BACKEND_TOKEN}`,
        },
        body: JSON.stringify(mutations),
        method: 'POST'
    })
    const json = await result.json();
    res.status(200).json({ message: 'Added!' });
}
