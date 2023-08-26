import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/libs/prismadb';
import serverAuth from "@/libs/serverAuth";
import yts from "@/libs/yts";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).end();
    }

    await serverAuth(req, res);

    // const movies = await prismadb.movie.findMany();
    const movies = await yts.listMovies();
    if (movies?.status !== 'ok') {
      throw new Error('Error fetching movies');
    }

    return res.status(200).json(movies.data.movies);
  } catch (error) {
    console.log({ error })
    return res.status(500).end();
  }
}
