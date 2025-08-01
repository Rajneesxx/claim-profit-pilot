import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TooltipInfoProps {
  content: string;
  className?: string;
}

export const TooltipInfo = ({ content, className }: TooltipInfoProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className={`inline-flex items-center justify-center w-4 h-4 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors ${className}`}>
            <Info className="h-3 w-3 text-primary" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs bg-popover border shadow-lg">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};