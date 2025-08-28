import { ROICalculator } from "@/components/ROICalculator";
import { SlackTestButton } from "@/components/SlackTestButton";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  return (
    <>
      <ROICalculator />
      <SlackTestButton />
      <Toaster />
    </>
  );
};

export default Index;
