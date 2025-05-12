
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
    <div className="sticky top-0 z-10 bg-background py-2 border-b mb-4 sm:mb-6 md:mb-8">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={toggleResultsView}
            >
              {showOnlyResults ? (
                <>
                  <ToggleLeft size={16} />
                  <span>Show All Inputs</span>
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
              className="flex items-center gap-2"
              onClick={handleResetForm}
            >
              <RefreshCw size={16} />
              <span>Reset Form</span>
            </Button>
          </div>
          
          <Button onClick={handleDownloadReport} className="flex items-center gap-2">
            <Download size={16} />
            <span>Download CSV</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopControls;
