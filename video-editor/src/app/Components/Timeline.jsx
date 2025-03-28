import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Group, Button, ActionIcon, Text, Slider } from '@mantine/core';
import { 
  IconPlayerPlay, 
  IconPlayerPause, 
  IconRewindBackward10, 
  IconRewindForward10, 
  IconZoomIn, 
  IconZoomOut, 
  IconAspectRatio 
} from '@tabler/icons-react';
import './Timeline.css';

export default function Timeline({
  currentTime,
  timeSettings,
  isPlaying,
  onPlay,
  onFileUpload,
  tracks,
  onPlayheadDrag,
  onMediaDrag,
  addNewTrack,
}) {
  const fileInputRef = useRef(null);
  const [localCurrentTime, setLocalCurrentTime] = useState(currentTime);
  const [playing, setPlaying] = useState(isPlaying);

  // Sync localCurrentTime with prop only when currentTime changes, not when playing changes
  useEffect(() => {
    setLocalCurrentTime(currentTime);
  }, [currentTime]);

  // Handle playback
 
  useEffect(() => {
    setPlaying(isPlaying);
    let interval;
    if (playing) {
      interval = setInterval(() => {
        setLocalCurrentTime((prevTime) => {
          const newTime = prevTime + 0.1; // Increment by 0.1 seconds
          if (newTime >= timeSettings.end) {
            setPlaying(false); // Stop at the end
            onPlay(false); // Notify parent to stop
            return timeSettings.end;
          }
          onPlayheadDrag((newTime / timeSettings.end) * 100); // Update playhead position
          
          return newTime;
        });
      }, 100); // Update every 100ms
    }
    return () => clearInterval(interval);
  }, [playing, isPlaying, timeSettings.end, onPlayheadDrag, onPlay]);

  // Calculate the percentage of the current time relative to the end time for the playhead
  const playheadPosition = (localCurrentTime / timeSettings.end) * 100;

  // Format time as MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Generate dynamic time markers based on timeSettings.end
  const generateTimeMarkers = () => {
    const markers = [];
    const interval = Math.ceil(timeSettings.end / 10); // Divide timeline into ~10 segments
    const step = timeSettings.end / interval; // Calculate step size

    for (let i = 0; i <= interval; i++) {
      const time = i * step;
      if (time >= 60) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        markers.push(`${minutes}m${seconds > 0 ? `${seconds}s` : ''}`);
      } else {
        markers.push(`${Math.floor(time)}s`);
      }
    }
    return markers;
  };

  // Handle play/pause toggle
  const handlePlayPause = () => {
    const newPlayingState = !playing;
    setPlaying(newPlayingState);
    onPlay(newPlayingState);
  };

  // Handle rewind (backward 10 seconds)
  const handleRewind = () => {
    const newTime = Math.max(0, localCurrentTime - 10);
    setLocalCurrentTime(newTime);
    onPlayheadDrag((newTime / timeSettings.end) * 100);
  };

  // Handle fast forward (forward 10 seconds)
  const handleFastForward = () => {
    const newTime = Math.min(timeSettings.end, localCurrentTime + 10);
    setLocalCurrentTime(newTime);
    onPlayheadDrag((newTime / timeSettings.end) * 100);
  };

  // Handle click on "+ Add media to this project"
  const handleAddMediaClick = (trackIndex) => {
    fileInputRef.current.dataset.trackIndex = trackIndex;
    fileInputRef.current.click();
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const trackIndex = parseInt(e.target.dataset.trackIndex, 10);
    const file = e.target.files[0];
    if (file) {
      onFileUpload(e, trackIndex);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e, trackIndex) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e, trackIndex) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) {
      const fakeEvent = { target: { files: [file], dataset: { trackIndex } } };
      onFileUpload(fakeEvent, trackIndex);
    }
  };

  // Handle playhead drag
  const handlePlayheadDragEnd = (e, info) => {
    const trackWidth = e.target.parentElement.offsetWidth || 1;
    const newPosition = Math.max(0, e.target.offsetLeft + info.offset.x);
    const newPositionPercentage = Math.min(100, Math.max(0, (newPosition / trackWidth) * 100));
    onPlayheadDrag(newPositionPercentage);
    setLocalCurrentTime((newPositionPercentage / 100) * timeSettings.end);
  };

  // Handle media block drag
  const handleMediaDragEnd = (e, info, trackIndex, mediaIndex) => {
    const trackWidth = e.target.parentElement.offsetWidth;
    const newPosition = e.target.offsetLeft + info.offset.x;
    const newPositionPercentage = (newPosition / trackWidth) * 100;
    onMediaDrag(trackIndex, mediaIndex, newPositionPercentage);
  };

  return (
    <div className="timeline-container">
      {/* Control Bar */}
      <Group spacing="xs" className="timeline-controls">
        <ActionIcon variant="subtle" color="gray" onClick={handleRewind}>
          <IconRewindBackward10 size={20} />
        </ActionIcon>
        <Button
          onClick={handlePlayPause}
          color="dark"
          leftSection={playing ? <IconPlayerPause size={20} /> : <IconPlayerPlay size={20} />}
          styles={{
            root: {
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
          }}
        />
        <ActionIcon variant="subtle" color="gray" onClick={handleFastForward}>
          <IconRewindForward10 size={20} />
        </ActionIcon>
        <Text className="time-display">
          {formatTime(localCurrentTime)} / {formatTime(timeSettings.end)}
        </Text>
        <Group spacing="xs" style={{ marginLeft: 'auto' }}>
          <ActionIcon variant="subtle" color="gray">
            <IconZoomOut size={20} />
          </ActionIcon>
          <Slider
            defaultValue={50}
            min={0}
            max={100}
            style={{ width: '100px' }}
            styles={{
              track: { backgroundColor: '#e0e0e0' },
              bar: { backgroundColor: '#007bff' },
              thumb: { borderColor: '#007bff', width: '12px', height: '12px' },
            }}
          />
          <ActionIcon variant="subtle" color="gray">
            <IconZoomIn size={20} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="gray">
            <IconAspectRatio size={20} />
          </ActionIcon>
        </Group>
      </Group>

      {/* Timeline Bar */}
      <div className="timeline-bar">
        {/* Time Markers */}
        <div className="time-markers">
          {generateTimeMarkers().map((marker, index) => (
            <div key={index} className="time-marker">
              <Text size="xs">{marker}</Text>
            </div>
          ))}
        </div>

        {/* Tracks */}
        {tracks.map((track, trackIndex) => (
          <div
            key={trackIndex}
            className="timeline-track"
            onDragOver={(e) => handleDragOver(e, trackIndex)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, trackIndex)}
          >
            <motion.div
              className="playhead"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0}
              dragMomentum={false}
              onDragEnd={handlePlayheadDragEnd}
              style={{
                left: `${playheadPosition}%`,
              }}
            >
              <div className="playhead-circle" />
            </motion.div>
            {track.length === 0 ? (
              <div className="timeline-placeholder" onClick={() => handleAddMediaClick(trackIndex)}>
                <Text size="sm" color="dimmed">
                  + Add media to this track
                </Text>
              </div>
            ) : (
              track.map((item, mediaIndex) => {
                const width = (item.duration / timeSettings.end) * 100;
                const left = (item.startTime / timeSettings.end) * 100;
                return (
                  <motion.div
                    key={mediaIndex}
                    className="media-block"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0}
                    dragMomentum={false}
                    onDragEnd={(e, info) => handleMediaDragEnd(e, info, trackIndex, mediaIndex)}
                    style={{
                      width: `${width}%`,
                      left: `${left}%`,
                      backgroundColor: item.type === 'video' ? '#a3bffa' : '#f9a8d4',
                    }}
                  >
                    <Text size="xs" color="white" style={{ padding: '2px 5px' }}>
                      {item.type === 'video' ? 'Video' : 'Image'} - {formatTime(item.duration)}
                    </Text>
                  </motion.div>
                );
              })
            )}
          </div>
        ))}

        {/* Add New Track Button */}
        <Button
          variant="outline"
          color="gray"
          size="xs"
          onClick={addNewTrack}
          style={{ marginTop: '10px' }}
        >
          + Add New Track
        </Button>

        <input
          type="file"
          accept="image/*,video/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}