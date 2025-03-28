'use client';

import { useState, useRef, useEffect } from 'react';

import './page.css';
import TopBar from './Components/Topbar';
import Sidebar from './Components/Sidebar';
import Canvas from './Components/Canvas';
import Timeline from './Components/Timeline';

export default function Home() {
  const [tracks, setTracks] = useState([[]]); // Array of tracks, each track is an array of media items
  const [dimensions, setDimensions] = useState({ width: "90%", height: "auto" });
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef(null);

  // Calculate total duration based on all tracks
  const calculateTotalDuration = () => {
    if (tracks.every(track => track.length === 0)) return 60; // Default duration if no media
    let totalDuration = 0;
    tracks.forEach(track => {
      track.forEach(item => {
        const endTime = item.startTime + item.duration;
        if (endTime > totalDuration) totalDuration = endTime;
      });
    });
    return totalDuration;
  };

  const totalDuration = calculateTotalDuration();
  const timeSettings = { start: 0, end: totalDuration };

  // Handle file upload
  const handleFileUpload = (e, trackIndex = null) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith('video') ? 'video' : 'image';

      // Default duration: 5 seconds for images, actual duration for videos
      const duration = type === 'image' ? 5 : null;

      const newMediaItem = {
        url,
        type,
        duration,
        startTime: 0, // Default start time
        width: dimensions.width, // Initial width
        height: dimensions.height, // Initial height
      };

      // For videos, get the actual duration
      if (type === 'video') {
        const video = document.createElement('video');
        video.src = url;
        video.onloadedmetadata = () => {
          newMediaItem.duration = video.duration;
          setTracks(prev => {
            const newTracks = [...prev];
            if (trackIndex === null) {
              // Auto-create a new track
              newTracks.push([newMediaItem]);
            } else {
              newTracks[trackIndex] = [...newTracks[trackIndex], {
                ...newMediaItem,
                startTime: newTracks[trackIndex].length > 0
                  ? newTracks[trackIndex][newTracks[trackIndex].length - 1].startTime + newTracks[trackIndex][newTracks[trackIndex].length - 1].duration
                  : 0,
              }];
            }
            return newTracks;
          });
        };
      } else {
        setTracks(prev => {
          const newTracks = [...prev];
          if (trackIndex === null) {
            // Auto-create a new track
            newTracks.push([newMediaItem]);
          } else {
            newTracks[trackIndex] = [...newTracks[trackIndex], {
              ...newMediaItem,
              startTime: newTracks[trackIndex].length > 0
                ? newTracks[trackIndex][newTracks[trackIndex].length - 1].startTime + newTracks[trackIndex][newTracks[trackIndex].length - 1].duration
                : 0,
            }];
          }
          return newTracks;
        });
      }
    }
  };

  // Handle dimension changes
  // Handle dimension changes
  const handleDimensionChange = (name, value) => {
    setDimensions((prev) => ({ ...prev, [name]: Number(value) }));
  };

  // Update media dimensions when dimensions change
  useEffect(() => {
    setTracks(prevTracks => {
      const newTracks = prevTracks.map(track =>
        track.map(item => ({
          ...item,
          width: dimensions.width,
          height: dimensions.height,
        }))
      );
      return newTracks;
    });
  }, [dimensions]);

  // Handle time settings (for manual adjustments)
  const handleTimeChange = (name, value) => {
    console.log(`Time change: ${name} = ${value}`);
  };

  // Play functionality
  const handlePlay = () => {
    if (isPlaying) {
      clearInterval(timerRef.current);
      setIsPlaying(false);
      setCurrentTime(0);
      return;
    }

    setIsPlaying(true);
    setCurrentTime(timeSettings.start);
    timerRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= timeSettings.end) {
          clearInterval(timerRef.current);
          setIsPlaying(false);
          return 0;
        }
        return prev + 0.1; // Increment by 0.1 seconds for smoother display
      });
    }, 100);
  };

  // Update currentTime when playhead is dragged
  const handlePlayheadDrag = (positionPercentage) => {
    const newTime = (positionPercentage / 100) * timeSettings.end;
    setCurrentTime(newTime);
  };

  // Update media item position when dragged
  const handleMediaDrag = (trackIndex, mediaIndex, newPositionPercentage) => {
    const newStartTime = (newPositionPercentage / 100) * timeSettings.end;
    setTracks(prev => {
      const newTracks = [...prev];
      newTracks[trackIndex][mediaIndex] = {
        ...newTracks[trackIndex][mediaIndex],
        startTime: newStartTime,
      };
      return newTracks;
    });
  };

  // Handle media resize
  const handleMediaResize = (trackIndex, mediaIndex, newDimensions) => {
    setTracks(prev => {
      const newTracks = [...prev];
      newTracks[trackIndex][mediaIndex] = {
        ...newTracks[trackIndex][mediaIndex],
        width: newDimensions.width,
        height: newDimensions.height,
      };
      return newTracks;
    });
  };

  // Add a new track
  const addNewTrack = () => {
    setTracks(prev => [...prev, []]);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div className="container">
      <TopBar />
      <div className="main-content">
        <Sidebar
          onFileUpload={handleFileUpload}
          dimensions={dimensions}
          onDimensionChange={handleDimensionChange}
          timeSettings={timeSettings}
          onTimeChange={handleTimeChange}
          media={tracks.some(track => track.length > 0)}
        />
        <div className="canvas-and-timeline">
         
          <Canvas
            tracks={tracks}
            dimensions={dimensions}
            currentTime={currentTime}
            isPlaying={isPlaying}
            onMediaResize={handleMediaResize}
          />
        
          <Timeline
            currentTime={currentTime}
            timeSettings={timeSettings}
            isPlaying={isPlaying}
            onPlay={handlePlay}
            onFileUpload={handleFileUpload}
            tracks={tracks}
            onPlayheadDrag={handlePlayheadDrag}
            onMediaDrag={handleMediaDrag}
            addNewTrack={addNewTrack}
          />
        </div>
      </div>
    </div>
  );
}