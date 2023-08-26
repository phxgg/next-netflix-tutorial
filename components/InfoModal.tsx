import React, { useCallback, useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

import PlayButton from '@/components/PlayButton';
import FavoriteButton from '@/components/FavoriteButton';
import useInfoModalStore from '@/hooks/useInfoModalStore';
import useMovie from '@/hooks/useMovie';
import { MovieDetailsInterface } from '@/types';
import { getColorFromRating, ytTrailerURL } from '@/libs/utils';

interface InfoModalProps {
  visible?: boolean;
  onClose: any;
}

const InfoModal: React.FC<InfoModalProps> = ({ visible, onClose }) => {
  const [isVisible, setIsVisible] = useState<boolean>(!!visible);

  const { movieId } = useInfoModalStore();
  const { data: movieDetails = {} } = useMovie(movieId);
  const data = movieDetails as MovieDetailsInterface;

  useEffect(() => {
    setIsVisible(!!visible);
  }, [visible]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  if (!visible) {
    return null;
  }

  return (
    <div className="z-50 transition duration-300 bg-black bg-opacity-80 flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0">
      <div className="relative w-auto mx-auto max-w-3xl rounded-md overflow-hidden">
        <div className={`${isVisible ? 'scale-100' : 'scale-0'} transform duration-300 relative flex-auto bg-zinc-900 drop-shadow-md`}>

          <div className="relative h-96 min-w-[700px]">
            {data?.yt_trailer_code
              ? <iframe
                className="w-full brightness-[60%] object-cover h-full"
                allow="autoplay"
                src={ytTrailerURL(data?.yt_trailer_code)}></iframe>
              : <video
                poster={data?.background_image_original}
                className="w-full brightness-[60%] object-cover h-full"
                autoPlay
                muted
                loop
                src={ytTrailerURL(data?.yt_trailer_code)}></video>
            }
            <div onClick={handleClose} className="cursor-pointer absolute top-3 right-3 h-10 w-10 rounded-full bg-black bg-opacity-70 flex items-center justify-center">
              <XMarkIcon className="text-white w-6" />
            </div>
            <div className="absolute bottom-[10%] left-10">
              <p className="text-white text-3xl md:text-4xl h-full lg:text-5xl font-bold mb-8">
                {data?.title}
              </p>
              <div className="flex flex-row gap-4 items-center">
                <PlayButton movieId={data?.id} />
                <FavoriteButton movieId={data?.id} />
              </div>
            </div>
          </div>

          <div className="px-12 py-8">
            <div className="flex flex-col justify-center gap-2 mb-8">
              <div className="text-white text-lg gap-2 flex flex-row">
                <span className={clsx(
                  getColorFromRating(data?.rating),
                  'px-2 py-1 rounded-md text-sm',
                )}>
                  {data?.rating}/10
                </span>
                <a href={`https://imdb.com/title/${data?.imdb_code}/`} target="_blank" rel="noreferrer" className="
                  bg-zinc-300
                  text-black
                  px-2
                  py-1
                  rounded-md
                  text-sm
                  hover:bg-zinc-600
                  hover:text-white
                  transition
                  duration-200
                  hover:shadow-md
                  flex
                  flex-row
                  items-center
                  gap-1
                  cursor-pointer
                ">
                  IMDB
                </a>
              </div>
              <div className="text-white text-lg flex flex-row gap-2 items-center">
                {data?.genres?.slice(0, 5).map((genre, idx) => (
                  <span key={idx} className="bg-zinc-800 px-2 py-1 rounded-md text-sm">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-white">
              {data?.description_intro}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default InfoModal;
