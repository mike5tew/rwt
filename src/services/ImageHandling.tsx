import { ImageListItem, ImageListItemBar } from '@mui/material';
import { ImageDetail, EmptyImageDetail, Clip } from '../types/types.d';
import YouTube, { YouTubeProps } from 'react-youtube';
import Box from '@mui/material/Box';

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

export const processClips = (clips: any[]): JSX.Element[] => {
  if (!Array.isArray(clips)) {
    console.error('Invalid clips data:', clips);
    return [];
  }

  return clips.map((clip, index) => {
    // Check for ClipURL instead of ClipReference
    if (!clip || !clip.ClipURL) {
      console.error('Invalid clip data:', clip);
      return null;
    }

    // Clean and validate video ID - ClipURL should already be the video ID
    const cleanVideoId = clip.ClipURL.trim();

    if (!cleanVideoId) {
      console.error('Empty video ID:', clip);
      return null;
    }

    return (
      <Box 
        key={index}
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: '56.25%',
          overflow: 'hidden',
          bgcolor: 'black',
          '& iframe': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 0
          }
        }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${cleanVideoId}?rel=0&modestbranding=1`}
          title={clip.Caption || `YouTube video ${index}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onError={(e) => {
            console.error('Video loading error:', e);
            const target = e.target as HTMLIFrameElement;
            if (target.parentElement) {
              target.parentElement.innerHTML = `
                <div style="position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#000;color:#fff;">
                  Video unavailable
                </div>
              `;
            }
          }}
          loading="lazy"
        />
      </Box>
    );
  }).filter((element): element is JSX.Element => element !== null);
};