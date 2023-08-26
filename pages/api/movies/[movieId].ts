import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "@/libs/serverAuth";
import yts from "@/libs/yts";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).end();
    }

    await serverAuth(req, res);

    const { movieId } = req.query;

    if (typeof movieId !== 'string') {
      throw new Error('Invalid Id');
    }

    if (!movieId) {
      throw new Error('Missing Id');
    }

    const movie = await yts.movieDetails(movieId);
    if (movie?.status !== 'ok') {
      throw new Error('Error fetching movie');
    }

    return res.status(200).json(movie.data.movie);
  } catch (error) {
    console.log(error);
    return res.status(500).end();
  }
}
