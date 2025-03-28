import { Stack, Select, Input, Group, Text, Button } from '@mantine/core';
import './Sidebar.css';

export default function Sidebar({
  onFileUpload,
  dimensions,
  onDimensionChange,
  timeSettings,
  onTimeChange,
  media,
}) {
  return (
    <div className="sidebar-container">
      {/* Right Settings Panel */}
      <div className="sidebar-settings">
        <Stack spacing="md">
          <Text size="md" weight={700}>Project Settings</Text>

          {/* Duration Section */}
          <div className="sidebar-section">
            <Text size="sm" weight={500}>Duration</Text>
            <Button
              variant="outline"
              color="blue"
              styles={{
                root: {
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  padding: '8px',
                  fontSize: '14px',
                },
              }}
            >
              Automatic
            </Button>
          </div>

          {/* Media Upload Section */}
          <div className="sidebar-section">
            <Text size="sm" weight={500}>Media</Text>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={onFileUpload}
              className="upload-input"
            />
          </div>

          {/* Dimensions and Timeline Sections */}
          {media && (
            <>
              <div className="sidebar-section">
                <Text size="sm" weight={500}>Dimensions</Text>
                <Group spacing="xs">
                  <Input
                    type="number"
                    value={dimensions.width}
                    onChange={(e) => onDimensionChange('width', e.target.value)}
                    placeholder="Width"
                    styles={{
                      input: {
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        padding: '8px',
                        fontSize: '14px',
                      },
                    }}
                  />
                  <Input
                    type="number"
                    value={dimensions.height}
                    onChange={(e) => onDimensionChange('height', e.target.value)}
                    placeholder="Height"
                    styles={{
                      input: {
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        padding: '8px',
                        fontSize: '14px',
                      },
                    }}
                  />
                </Group>
              </div>

              <div className="sidebar-section">
                <Text size="sm" weight={500}>Timeline</Text>
                <Group spacing="xs">
                  <Input
                    type="number"
                    value={timeSettings.start}
                    onChange={(e) => onTimeChange('start', e.target.value)}
                    placeholder="Start (s)"
                    styles={{
                      input: {
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        padding: '8px',
                        fontSize: '14px',
                      },
                    }}
                  />
                  <Input
                    type="number"
                    value={timeSettings.end}
                    onChange={(e) => onTimeChange('end', e.target.value)}
                    placeholder="End (s)"
                    styles={{
                      input: {
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        padding: '8px',
                        fontSize: '14px',
                      },
                    }}
                  />
                </Group>
              </div>
            </>
          )}
        </Stack>
      </div>
    </div>
  );
}