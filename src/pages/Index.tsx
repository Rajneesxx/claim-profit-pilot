import { ROICalculator } from "@/components/ROICalculator";
import { SpreadsheetTestButton } from "@/components/SpreadsheetTestButton";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  return (
    <>
      <ROICalculator />
      <SpreadsheetTestButton />
      <Toaster />
    </>
  );
};

export default Index;
