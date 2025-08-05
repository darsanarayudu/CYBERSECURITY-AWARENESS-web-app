import { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle, XCircle, Shield, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface PasswordModuleProps {
  onComplete: () => void;
}

export const PasswordModule = ({ onComplete }: PasswordModuleProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [score, setScore] = useState(0);

  const analyzePassword = (password: string) => {
    let strength = 0;
    const checks = {
      length: password.length >= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      noCommon: !["password", "123456", "qwerty"].some(common => 
        password.toLowerCase().includes(common)
      )
    };

    strength = Object.values(checks).filter(Boolean).length;
    return { strength, checks };
  };

  const { strength, checks } = analyzePassword(currentPassword);

  const getStrengthLabel = (score: number) => {
    if (score <= 2) return { label: "Weak", color: "text-destructive" };
    if (score <= 4) return { label: "Fair", color: "text-warning" };
    if (score <= 5) return { label: "Good", color: "text-primary" };
    return { label: "Strong", color: "text-success" };
  };

  const strengthInfo = getStrengthLabel(strength);

  const handleComplete = () => {
    if (strength >= 5) {
      toast.success("Excellent! You've mastered password security!");
      onComplete();
    } else {
      toast.error("Create a stronger password to complete this module");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Password Security Fundamentals</h2>
              <p className="text-muted-foreground">Learn why strong passwords are your first line of defense</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-destructive/5 border-destructive/20">
                <div className="flex items-center gap-3 mb-4">
                  <XCircle className="h-6 w-6 text-destructive" />
                  <h3 className="text-lg font-semibold text-destructive">Weak Passwords</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• "password123" - Too common</li>
                  <li>• "johnsmith" - Personal info</li>
                  <li>• "12345678" - Sequential numbers</li>
                  <li>• "qwerty" - Keyboard patterns</li>
                </ul>
              </Card>

              <Card className="p-6 bg-success/5 border-success/20">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-success" />
                  <h3 className="text-lg font-semibold text-success">Strong Passwords</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• "Tr@il$unset42@Beach!" - Mixed characters</li>
                  <li>• "Coffee&Morning#2024" - Memorable phrase</li>
                  <li>• "9Purple*Elephants!" - Creative combination</li>
                  <li>• "My$Dog&3Cats=Love" - Personal but secure</li>
                </ul>
              </Card>
            </div>

            <Button onClick={() => setCurrentStep(2)} className="w-full">
              Continue to Password Creator
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Interactive Password Creator</h2>
              <p className="text-muted-foreground">Create a strong password and see real-time analysis</p>
            </div>

            <Card className="p-6">
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password here..."
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Password Strength</span>
                  <Badge variant="secondary" className={strengthInfo.color}>
                    {strengthInfo.label}
                  </Badge>
                </div>
                <Progress value={(strength / 6) * 100} className="h-2" />

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: "length", label: "12+ characters", icon: checks.length },
                    { key: "uppercase", label: "Uppercase (A-Z)", icon: checks.uppercase },
                    { key: "lowercase", label: "Lowercase (a-z)", icon: checks.lowercase },
                    { key: "numbers", label: "Numbers (0-9)", icon: checks.numbers },
                    { key: "symbols", label: "Symbols (!@#$)", icon: checks.symbols },
                    { key: "noCommon", label: "Not common word", icon: checks.noCommon },
                  ].map((check) => (
                    <div key={check.key} className="flex items-center gap-2">
                      {check.icon ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className={`text-sm ${check.icon ? "text-success" : "text-muted-foreground"}`}>
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              <Button onClick={handleComplete} disabled={strength < 5} className="flex-1">
                Complete Module
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-xl bg-success/10 border border-success/20">
          <Lock className="h-8 w-8 text-success" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Password Safety Module</h1>m  
          <p className="text-muted-foreground">Master the art of creating unbreakable passwords</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 bg-muted rounded-full h-2">
          <div 
            className="h-2 bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 2) * 100}%` }}
          />
        </div>
        <span className="text-sm text-muted-foreground">Step {currentStep} of 2</span>
      </div>

      {renderStep()}
    </div>
  );
};