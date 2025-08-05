import { LucideIcon, CheckCircle, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Module {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  estimatedTime: string;
  isSpecial?: boolean;
}

interface ModuleCardProps {
  module: Module;
  isCompleted: boolean;
  onClick: () => void;
}

export const ModuleCard = ({ module, isCompleted, onClick }: ModuleCardProps) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "cyber-green":
        return "text-success border-success/20 bg-success/5";
      case "cyber-orange":
        return "text-warning border-warning/20 bg-warning/5";
      case "cyber-purple":
        return "text-accent border-accent/20 bg-accent/5";
      case "cyber-blue":
        return "text-primary border-primary/20 bg-primary/5";
      case "cyber-red":
        return "text-destructive border-destructive/20 bg-destructive/5";
      default:
        return "text-primary border-primary/20 bg-primary/5";
    }
  };

  const Icon = module.icon;
  const colorClasses = getColorClasses(module.color);

  return (
    <Card className={`relative p-6 hover:shadow-glow transition-all duration-300 group cursor-pointer border-border hover:border-primary/30 ${
      module.isSpecial ? "bg-gradient-glow border-primary/20" : "bg-card"
    }`} onClick={onClick}>
      {module.isSpecial && (
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
            Featured
          </Badge>
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClasses} transition-transform group-hover:scale-110`}>
          <Icon className="h-6 w-6" />
        </div>
        {isCompleted && (
          <CheckCircle className="h-6 w-6 text-success" />
        )}
      </div>

      <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
        {module.title}
      </h3>
      
      <p className="text-muted-foreground mb-4 leading-relaxed">
        {module.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          {module.estimatedTime}
        </div>
        
        <Button 
          variant={isCompleted ? "secondary" : "default"}
          size="sm"
          className="group-hover:shadow-md transition-shadow"
        >
          {isCompleted ? "Review" : "Start"}
        </Button>
      </div>
    </Card>
  );
};