import { useState } from "react";
import { Users, Phone, MessageCircle, Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface SocialEngineeringModuleProps {
  onComplete: () => void;
}

interface Scenario {
  id: string;
  type: "phone" | "email" | "in-person" | "social-media";
  title: string;
  description: string;
  responses: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export const SocialEngineeringModule = ({ onComplete }: SocialEngineeringModuleProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedResponses, setSelectedResponses] = useState<Record<number, number>>({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const scenarios: Scenario[] = [
    {
      id: "1",
      type: "phone",
      title: "The Urgent IT Call",
      description: "You receive a call: 'Hello, this is Mike from IT support. We've detected a security breach on your computer. I need your login credentials immediately to fix this issue before your data is compromised.'",
      responses: [
        {
          text: "Give them my username and password to fix the issue quickly",
          isCorrect: false,
          explanation: "Never give credentials over the phone. Legitimate IT never asks for passwords."
        },
        {
          text: "Ask for their employee ID and call back through official IT number",
          isCorrect: true,
          explanation: "Correct! Always verify the caller's identity through official channels."
        },
        {
          text: "Hang up immediately without saying anything",
          isCorrect: false,
          explanation: "While cautious, it's better to verify rather than just hang up."
        }
      ]
    },
    {
      id: "2",
      type: "email",
      title: "The Helpful Colleague",
      description: "You get an email from someone claiming to be a new employee: 'Hi! I'm Sarah, the new marketing coordinator. Could you send me the client database so I can start working on the upcoming campaign? My boss said you'd help me out.'",
      responses: [
        {
          text: "Send the database since they mentioned their boss approved it",
          isCorrect: false,
          explanation: "Never share sensitive data without proper verification and authorization."
        },
        {
          text: "Forward the request to your manager for verification",
          isCorrect: true,
          explanation: "Perfect! Always verify new employee requests through proper channels."
        },
        {
          text: "Ask for Sarah's employee ID and department details first",
          isCorrect: false,
          explanation: "Good thinking, but this information can be easily fabricated."
        }
      ]
    },
    {
      id: "3",
      type: "in-person",
      title: "The Tailgating Attempt",
      description: "As you're entering your office building with your key card, someone behind you carrying a large box says: 'Hey, could you hold the door? My hands are full and I forgot my badge in my car. I work on the 5th floor.'",
      responses: [
        {
          text: "Hold the door open to help them since they seem to work here",
          isCorrect: false,
          explanation: "This is tailgating - a common physical security breach technique."
        },
        {
          text: "Politely explain they need to use their own badge and direct them to security",
          isCorrect: true,
          explanation: "Correct! Security policies exist for everyone's protection."
        },
        {
          text: "Ask them which company they work for first",
          isCorrect: false,
          explanation: "Attackers can easily research company information to appear legitimate."
        }
      ]
    }
  ];

  const handleResponseSelection = (scenarioIndex: number, responseIndex: number) => {
    setSelectedResponses(prev => ({
      ...prev,
      [scenarioIndex]: responseIndex
    }));
  };

  const checkAnswers = () => {
    let correctAnswers = 0;
    scenarios.forEach((scenario, index) => {
      const selectedResponse = selectedResponses[index];
      if (selectedResponse !== undefined && scenario.responses[selectedResponse].isCorrect) {
        correctAnswers++;
      }
    });
    setScore((correctAnswers / scenarios.length) * 100);
    setShowResults(true);
    
    if (correctAnswers === scenarios.length) {
      toast.success("Excellent! You've mastered social engineering defense!");
      onComplete();
    } else {
      toast.warning(`You got ${correctAnswers}/${scenarios.length} correct. Review the explanations below.`);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "phone": return <Phone className="h-5 w-5" />;
      case "email": return <MessageCircle className="h-5 w-5" />;
      case "in-person": return <Users className="h-5 w-5" />;
      default: return <Users className="h-5 w-5" />;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Understanding Social Engineering</h2>
              <p className="text-muted-foreground">Learn how attackers manipulate human psychology to bypass security</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-warning" />
                  <h3 className="text-lg font-semibold text-foreground">Common Techniques</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>Authority:</strong> Impersonating bosses or IT staff</li>
                  <li>• <strong>Urgency:</strong> Creating false time pressure</li>
                  <li>• <strong>Trust:</strong> Building rapport before asking</li>
                  <li>• <strong>Fear:</strong> Threatening consequences</li>
                  <li>• <strong>Helpfulness:</strong> Exploiting desire to help</li>
                  <li>• <strong>Curiosity:</strong> Offering enticing information</li>
                </ul>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-success" />
                  <h3 className="text-lg font-semibold text-foreground">Defense Strategies</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>Verify:</strong> Always confirm identity through official channels</li>
                  <li>• <strong>Pause:</strong> Take time to think before acting</li>
                  <li>• <strong>Question:</strong> Ask for specifics and documentation</li>
                  <li>• <strong>Escalate:</strong> Involve supervisors for unusual requests</li>
                  <li>• <strong>Policy:</strong> Follow security procedures strictly</li>
                  <li>• <strong>Report:</strong> Alert security about suspicious contacts</li>
                </ul>
              </Card>
            </div>

            <Button onClick={() => setCurrentStep(2)} className="w-full">
              Practice with Real Scenarios
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Social Engineering Scenarios</h2>
              <p className="text-muted-foreground">How would you respond to these real-world social engineering attempts?</p>
            </div>

            <div className="space-y-6">
              {scenarios.map((scenario, scenarioIndex) => (
                <Card key={scenario.id} className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      {getTypeIcon(scenario.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{scenario.title}</h3>
                        <Badge variant="secondary" className="capitalize">
                          {scenario.type.replace("-", " ")}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {scenario.description}
                      </p>

                      <div className="space-y-3">
                        <h4 className="font-medium text-foreground">How would you respond?</h4>
                        {scenario.responses.map((response, responseIndex) => (
                          <div key={responseIndex}>
                            <Button
                              variant={selectedResponses[scenarioIndex] === responseIndex ? "default" : "outline"}
                              className="w-full justify-start text-left h-auto p-4"
                              onClick={() => handleResponseSelection(scenarioIndex, responseIndex)}
                            >
                              {response.text}
                            </Button>
                            
                            {showResults && selectedResponses[scenarioIndex] === responseIndex && (
                              <div className={`mt-2 p-3 rounded-lg border-l-4 ${
                                response.isCorrect 
                                  ? "border-l-success bg-success/5" 
                                  : "border-l-destructive bg-destructive/5"
                              }`}>
                                <div className="flex items-center gap-2 mb-1">
                                  {response.isCorrect ? (
                                    <CheckCircle className="h-4 w-4 text-success" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-destructive" />
                                  )}
                                  <span className="font-medium">
                                    {response.isCorrect ? "Correct!" : "Incorrect"}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {response.explanation}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              {!showResults ? (
                <Button 
                  onClick={checkAnswers} 
                  disabled={Object.keys(selectedResponses).length !== scenarios.length}
                  className="flex-1"
                >
                  Check My Answers
                </Button>
              ) : (
                <Button onClick={onComplete} className="flex-1">
                  Complete Module
                </Button>
              )}
            </div>

            {showResults && (
              <Card className="p-6 bg-primary/5 border-primary/20">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Your Score: {score}%</h3>
                  <p className="text-muted-foreground">
                    {score === 100 ? "Perfect! You're immune to social engineering attacks!" :
                     score >= 67 ? "Good job! You have solid social engineering defense skills." :
                     "Keep practicing to improve your ability to spot manipulation attempts."}
                  </p>
                </div>
              </Card>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
          <Users className="h-8 w-8 text-accent" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Social Engineering Module</h1>
          <p className="text-muted-foreground">Recognize and defend against manipulation tactics</p>
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