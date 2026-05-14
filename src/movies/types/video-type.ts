type PaginatedResponse<T> = {
  results: T[];
};

type VideoItem = {
  id: number;
  key: string;
  name: string;
  site: string;
  type: 'Trailer' | 'Teaser' | 'Clip' | 'Featurette';
};

type VideoType = PaginatedResponse<VideoItem>;
export default VideoType;
