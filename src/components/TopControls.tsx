
import React from 'react';
import { Button } from "@/components/ui/button";
import { ToggleLeft, ToggleRight, Download, RefreshCw } from "lucide-react";

interface TopControlsProps {
  showOnlyResults: boolean;
  toggleResultsView: () => void;
  handleResetForm: () => void;
  handleDownloadReport: () => void;
}

const TopControls: React.FC<TopControlsProps> = ({
  showOnlyResults,
  toggleResultsView,
  handleResetForm,
  handleDownloadReport
}) => {
  return (
    <div className="sticky top-0 z-50 bg-background py-2 border-b mb-4 sm:mb-6 md:mb-8 shadow-sm">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
            <Button
              variant="outline"
              className="flex items-center gap-2 whitespace-nowrap"
              onClick={toggleResultsView}
              size="sm"
            >
              {showOnlyResults ? (
                <>
                  <ToggleLeft size={16} />
                  <span>Show Inputs</span>
                </>
              ) : (
                <>
                  <ToggleRight size={16} />
                  <span>Show Results Only</span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 whitespace-nowrap"
              onClick={handleResetForm}
              size="sm"
            >
              <RefreshCw size={16} />
              <span>Reset</span>
            </Button>
          </div>

          <Button 
              onClick={handleDownloadReport} 
              className="flex items-center gap-2 whitespace-nowrap"
              size="sm"
            >
              <Download size={16} />
              <span>CSV</span>
            </Button>
        </div>
      </div>
    </div>
  );
};

export default TopControls;
