import { Torrent } from "@/types"

const trackers: string[] = [
  'udp://glotorrents.pw:6969/announce',
  'udp://tracker.opentrackr.org:1337/announce',
  'udp://torrent.gresille.org:80/announce',
  'udp://tracker.openbittorrent.com:80',
  'udp://tracker.coppersurfer.tk:6969',
  'udp://tracker.leechers-paradise.org:6969',
  'udp://p4p.arenabg.ch:1337',
  'udp://tracker.internetwarriors.net:1337'
]

const api = {
  baseUrl: process.env.YTS_API_BASE_URL,
  req: async (endpoint: string, method: string, params?: string[]) => {
    if (params && params.length > 0) {
      endpoint += `?${params.join('&')}`
    }

    return await fetch(`${api.baseUrl}/${endpoint}`, {
      method: method,
    })
  }
}

const yts = {
  magnet(torrent: Torrent, movieTitle: string): string {
    // url encode each tracker and join them with &tr=
    const trackersJoin = trackers.map(tracker => encodeURIComponent(tracker)).join('&tr=')
    return `magnet:?xt=urn:btih:${torrent.hash}&dn=${encodeURIComponent(movieTitle)}&tr=${trackersJoin}`
  },

  listMovies: async () => {
    const res = await api.req('list_movies.json', 'GET')
    const data = await res.json()
    return data
  },

  movieDetails: async (movieId: string) => {
    const res = await api.req('movie_details.json', 'GET', [`movie_id=${movieId}`])
    const data = await res.json()
    return data
  },

  movieSuggestions: async (movieId: string) => {
    const res = await api.req('movie_suggestions.json', 'GET', [`movie_id=${movieId}`])
    const data = await res.json()
    return data
  },

  search: async (query: string) => {
    const res = await api.req('list_movies.json', 'GET', [`query_term=${query}`])
    const data = await res.json()
    return data
  },
}

export default yts
