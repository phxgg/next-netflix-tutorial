import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "@/libs/serverAuth";
import yts from "@/libs/yts";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).end();
    }

    const { currentUser } = await serverAuth(req, res);

    const favoriteMovies = [];
    for (const id of currentUser.favoriteIds) {
      const movie = await yts.movieDetails(id.toString());
      if (movie?.status !== 'ok') {
        // delete from favorites
        try {
          await prismadb.user.update({
            where: {
              id: currentUser.id,
            },
            data: {
              favoriteIds: {
                set: currentUser.favoriteIds.filter(favId => favId !== id)
              }
            }
          });
        } catch (err) {
          console.log(err);
        }
        return;
      }
      favoriteMovies.push(movie.data.movie);
    }

    return res.status(200).json(favoriteMovies);
  } catch (error) {
    console.log(error);
    return res.status(500).end();
  }
}
