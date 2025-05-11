
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TimelineAdjustment } from '@/types';

interface TimelineSliderProps {
  baseWeeks: number;
  timeline: TimelineAdjustment;
  onChange: (timeline: TimelineAdjustment) => void;
}

const TimelineSlider: React.FC<TimelineSliderProps> = ({ baseWeeks, timeline, onChange }) => {
  const minWeeks = Math.max(Math.floor(baseWeeks * 0.5), 1);  // Min is 50% of base or 1 week
  const maxWeeks = Math.ceil(baseWeeks * 2);  // Max is 200% of base
  
  const handleSliderChange = (value: number[]) => {
    const adjustedWeeks = value[0];
    const multiplier = adjustedWeeks / baseWeeks;
    onChange({
      baseWeeks,
      adjustedWeeks,
      multiplier
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= minWeeks) {
      const adjustedWeeks = Math.min(value, maxWeeks);
      const multiplier = adjustedWeeks / baseWeeks;
      onChange({
        baseWeeks,
        adjustedWeeks,
        multiplier
      });
    }
  };

  // Format timeline for display
  const formatTimeline = (weeks: number) => {
    if (weeks >= 52) {
      const years = Math.floor(weeks / 52);
      const remainingWeeks = weeks % 52;
      return `${years} year${years > 1 ? 's' : ''}${remainingWeeks > 0 ? ` ${remainingWeeks} week${remainingWeeks > 1 ? 's' : ''}` : ''}`;
    } else if (weeks >= 8) {
      const months = Math.floor(weeks / 4.33);
      const remainingWeeks = Math.round(weeks % 4.33);
      return `${months} month${months > 1 ? 's' : ''}${remainingWeeks > 0 ? ` ${remainingWeeks} week${remainingWeeks > 1 ? 's' : ''}` : ''}`;
    } else {
      return `${weeks} week${weeks > 1 ? 's' : ''}`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="timeline-adjustment">Adjust Timeline</Label>
          <div className="w-24">
            <Input 
              id="timeline-input"
              type="number" 
              min={minWeeks}
              max={maxWeeks}
              value={timeline.adjustedWeeks} 
              onChange={handleInputChange}
              className="h-8"
            />
          </div>
        </div>
        <Slider
          id="timeline-adjustment"
          min={minWeeks}
          max={maxWeeks}
          step={1}
          value={[timeline.adjustedWeeks]}
          onValueChange={handleSliderChange}
        />
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Faster ({formatTimeline(minWeeks)})</span>
          <span className="font-medium">{formatTimeline(timeline.adjustedWeeks)}</span>
          <span className="text-muted-foreground">Slower ({formatTimeline(maxWeeks)})</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Base estimate: {formatTimeline(baseWeeks)} • Current: {timeline.multiplier.toFixed(2)}x
        </p>
      </div>
    </div>
  );
};

export default TimelineSlider;
