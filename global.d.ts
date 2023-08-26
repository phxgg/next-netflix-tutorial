import type { PrismaClient } from '@prisma/client';
import type { MongoClient } from 'mongodb';
import WebTorrent from 'webtorrent';

declare global {
  namespace globalThis {
    var prismadb: PrismaClient
    var WebTorrent: WebTorrent.WebTorrent
  }
}
