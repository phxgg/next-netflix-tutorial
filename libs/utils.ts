export const ytTrailerURL = (yt_trailer_code: string) => {
  if (!yt_trailer_code) {
    return '';
  }

  return `https://www.youtube.com/embed/${yt_trailer_code}?html5=1&autoplay=1&mute=1`;
}

export const getColorFromRating = (rating: number) => {
  if (rating >= 7) {
    return 'bg-green-500';
  }

  if (rating >= 5) {
    return 'bg-yellow-600';
  }

  return 'bg-red-500';
}
