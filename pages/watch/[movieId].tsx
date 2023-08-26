import React, { useEffect, useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import useMovie from '@/hooks/useMovie';
import { MovieDetailsInterface } from '@/types';
import yts from '@/libs/yts';

const Watch = () => {
  const [progress, setProgress] = useState("0%");
  const [downloadSpeed, setDownloadSpeed] = useState("0 KB/s");

  const router = useRouter();
  const { movieId } = router.query;

  const { data: movieDetails } = useMovie(movieId as unknown as number);
  const data = movieDetails as MovieDetailsInterface;

  useEffect(() => {
    console.log(downloadSpeed, progress);
  }, [downloadSpeed, progress])

  useEffect(() => {
    if (!data) return;

    const magnet = yts.magnet(data?.torrents[0], data?.title_english);
    const webtorrent = new window.WebTorrent();

    console.log(magnet);

    webtorrent.on('error', (err: any) => {
      console.log('Webtorrent error: ' + err.message);
    })

    webtorrent.add(magnet, (torrent) => {
      console.log('webtorrent.add was called');

      torrent.on('download', (bytes) => {
        console.log('torrent.on.download')

        var speedBytes = torrent.downloadSpeed;
        var downloadSpeed = (speedBytes > (1024 * 1024))
          ? (speedBytes / (1024 * 1024)).toFixed(1) + " MB/s"
          : (speedBytes / 1024).toFixed(1) + " KB/s";
        setProgress((torrent.progress * 100).toFixed(1) + "%");
        setDownloadSpeed(downloadSpeed);
      })

      torrent.on('done', () => {
        console.log('Torrent download finished');
        setDownloadSpeed("-");
      })

      const file = torrent.files.find((file) => {
        return file.name.endsWith('.mp4');
      })

      try {
        file?.renderTo('video#player', { autoplay: true, controls: true }, (err, elem) => {
          console.log(elem);
          if (err) console.error(err);
        })
      } catch (err) {
        console.error(err);
      }
    })
  }, [data]);

  return (
    <div className="h-screen w-screen bg-black">
      <nav className="fixed w-full p-4 z-10 flex flex-row items-center gap-8 bg-black bg-opacity-70">
        <ArrowLeftIcon onClick={() => router.push('/')} className="w-4 md:w-10 text-white cursor-pointer hover:opacity-80 transition" />
        <p className="text-white text-1xl md:text-3xl font-bold">
          <span className="font-light">Watching:</span> {data?.title}
        </p>
      </nav>
      <video id="player" className="h-full w-full" poster={data?.background_image_original}></video>
    </div>
  )
}

export default Watch;
