import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface MetricField {
  id: string;
  label: string;
  type: 'number' | 'percentage';
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
}

interface MetricCardProps {
  title: string;
  icon: React.ReactNode;
  fields: MetricField[];
  className?: string;
}

export const MetricCard = ({ title, icon, fields, className = "" }: MetricCardProps) => {
  const formatValue = (value: number, type: string) => {
    if (isNaN(value)) return '0';
    if (type === 'percentage') return value.toString();
    return value.toString();
  };

  const handleInputChange = (field: MetricField, inputValue: string) => {
    const numericValue = parseFloat(inputValue);
    if (isNaN(numericValue)) {
      field.onChange(0);
      return;
    }
    
    // Add reasonable bounds checking
    if (field.type === 'percentage' && numericValue > 100) {
      field.onChange(100);
      return;
    }
    
    if (numericValue < 0) {
      field.onChange(0);
      return;
    }
    
    field.onChange(numericValue);
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <span className="text-primary">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium text-muted-foreground">
              {field.label}
            </Label>
            <div className="relative">
              {field.prefix && (
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  {field.prefix}
                </span>
              )}
              <Input
                id={field.id}
                type="number"
                value={formatValue(field.value, field.type)}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className={`${field.prefix ? 'pl-8' : ''} ${field.suffix ? 'pr-8' : ''}`}
                min="0"
                max={field.type === 'percentage' ? '100' : undefined}
                step={field.type === 'percentage' ? '0.1' : '1'}
              />
              {field.suffix && (
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  {field.suffix}
                </span>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};