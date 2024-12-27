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

      imgDetail.Filename = "http://" + process.env.REACT_APP_URL + ':' + process.env.REACT_APP_PORT +"/"+ Img.Filename;
      console.log("Filename", imgDetail.Filename);
      imgDetail.Caption = Img.Caption;
      imgDetail.EventID = Img.EventID;
      imgDetail.Rows = 1;
      imgDetail.Cols = 1;
      return (
        <ImageListItem key={imgDetail.ImageID} cols={1} rows={1}>
          <img
            {...srcset(imgDetail.Filename, imgDetail.Width, imgDetail.Rows, imgDetail.Cols)}
            alt={imgDetail.ImageURL}
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
};

export function processClips(clips: Clip[]): JSX.Element[] {
    return clips.map(clip => (
      <ImageListItem key={clip.ClipID} cols={1} rows={1}>
        <YouTube videoId={clip.ClipURL} opts={opts} onReady={onPlayerReady} />
        <ImageListItemBar title={clip.Caption} />
      </ImageListItem>
    ));
}