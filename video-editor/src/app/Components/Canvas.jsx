'use client';

import { useRef, useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import './Canvas.css';

export default function Canvas({ tracks, dimensions, currentTime, isPlaying, onMediaResize }) {
  const videoRefs = useRef([]);
  const [sizes, setSizes] = useState({}); // Store sizes for each media item

  useEffect(() => {
    const initialSizes = {};
    tracks.forEach((track, trackIndex) => {
      track.forEach((item, itemIndex) => {
        initialSizes[`${trackIndex}-${itemIndex}`] = { width: item.width, height: item.height };
      });
    });
    setSizes(initialSizes);
  }, [tracks]);

  const activeMediaItems = tracks
    .map((track, trackIndex) =>
      track
        .map((item, itemIndex) => {
          const start = item.startTime;
          const end = item.startTime + item.duration;
          if (currentTime >= start && currentTime <= end) {
            return { ...item, trackIndex, itemIndex };
          }
          return null;
        })
        .filter(item => item !== null)
    )
    .flat();

  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        if (isPlaying) {
          video.play();
        } else {
          video.pause();
        }
      }
    });
  }, [isPlaying]);

  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        const mediaItem = activeMediaItems.find(
          item => item && `${item.trackIndex}-${item.itemIndex}` === video.dataset.key
        );
        if (mediaItem) {
          const localTime = currentTime - mediaItem.startTime;
          if (Math.abs(video.currentTime - localTime) > 0.2) {
            video.currentTime = localTime;
          }
        }
      }
    });
  }, [currentTime]);

  return (
    <div className="canvas" style={{ position: 'relative', width: '100%', height: dimensions.height }}>
      {activeMediaItems.map((media, index) => (
        <Rnd
          key={`${media.trackIndex}-${media.itemIndex}`}
          size={sizes[`${media.trackIndex}-${media.itemIndex}`] || { width: media.width, height: media.height }}
          default={{
            x: 0, // Lock to left edge
            y: media.y || 0,
          }}
          bounds="parent"
          enableResizing={{
            top: true,
            right: true,
            bottom: true,
            left: true,
          }}
          minWidth={50}
          minHeight={50}
          style={{
            border: '2px dashed #4CAF50',
            borderRadius: '8px',
            position: 'absolute',
            transition: 'border 0.2s ease',
          }}
          className="resizable-media"
          onResizeStop={(e, dir, ref, delta, position) => {
            e.stopPropagation();
            e.preventDefault();

            const newWidth = parseInt(ref.style.width, 10) || media.width;
            const newHeight = parseInt(ref.style.height, 10) || media.height;

            setSizes(prevSizes => ({
              ...prevSizes,
              [`${media.trackIndex}-${media.itemIndex}`]: { width: newWidth, height: newHeight },
            }));

            onMediaResize(media.trackIndex, media.itemIndex, {
              width: newWidth,
              height: newHeight,
              x: position.x,
              y: position.y,
            });
          }}
          onDragStop={(e, data) => {
            onMediaResize(media.trackIndex, media.itemIndex, {
              width: sizes[`${media.trackIndex}-${media.itemIndex}`]?.width || media.width,
              height: sizes[`${media.trackIndex}-${media.itemIndex}`]?.height || media.height,
              x: 0,
              y: data.y,
            });
          }}
        >
          {media.type === 'video' ? (
            <video
              ref={el => (videoRefs.current[index] = el)}
              data-key={`${media.trackIndex}-${media.itemIndex}`}
              src={media.url}
              className="media"
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
            />
          ) : (
            <img
              src={media.url}
              className="media"
              alt="Uploaded media"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
            />
          )}
        </Rnd>
      ))}
    </div>
  );
}
