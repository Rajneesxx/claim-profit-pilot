import { ROICalculator } from "@/components/ROICalculator";
import { AdminPanel } from "@/components/AdminPanel";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  return (
    <>
      <ROICalculator />
      <AdminPanel />
      <Toaster />
    </>
  );
};

export default Index;
