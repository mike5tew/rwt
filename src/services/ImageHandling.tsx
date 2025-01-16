import { ImageListItem, ImageListItemBar } from '@mui/material';
import { ImageDetail, EmptyImageDetail, Clip } from '../types/types.d';
import YouTube, { YouTubeProps } from 'react-youtube';

function srcset(image: string, width: number, rows: number, cols: number) {
    return {
      src: `${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format`,
      srcSet: `${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format&dpr=1 1x, ${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format&dpr=2 2x, ${image}?w=${width * cols}&h=${width * rows}&fit=crop&auto=format&dpr=3 3x`,
    };
}

export function processImages(Imgs: ImageDetail[]): JSX.Element[] {
    return Imgs.map(Img => {
      const imgDetail = EmptyImageDetail();
      imgDetail.ImageID = Img.ImageID;
      
      // Use the full Filename path directly without /api prefix
      imgDetail.Filename = Img.Filename;  // Remove the /api prefix
      console.log("Filename", imgDetail.Filename);
      imgDetail.Caption = Img.Caption;
      imgDetail.EventID = Img.EventID;
      imgDetail.Width = Img.Width || 450;  // Add default width if not provided
      imgDetail.Height = Img.Height || 450;  // Add default height if not provided
      imgDetail.Rows = 1;
      imgDetail.Cols = 1;

      return (
        <ImageListItem key={imgDetail.ImageID} cols={1} rows={1}>
          <img
            {...srcset(imgDetail.Filename, imgDetail.Width, imgDetail.Rows, imgDetail.Cols)}
            alt={imgDetail.Caption || 'Archive image'}
            loading="lazy"
          />
          <ImageListItemBar title={imgDetail.Caption} />
        </ImageListItem>
      );
    });
}

const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    event.target.pauseVideo();
}

const opts: YouTubeProps['opts'] = {
    width: '100%',
    playerVars: {
      autoplay: 1,
    },
    host: 'http://www.youtube.com' // Add this line to force HTTP
};

export function processClips(clips: Clip[]): JSX.Element[] {
    return clips.map(clip => (
      <ImageListItem key={clip.ClipID} cols={1} rows={1}>
        <YouTube videoId={clip.ClipURL} opts={opts} onReady={onPlayerReady} />
        <ImageListItemBar title={clip.Caption} />
      </ImageListItem>
    ));
}