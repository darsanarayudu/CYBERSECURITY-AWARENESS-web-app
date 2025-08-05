import { useState } from "react";
import { Eye, Mail, ExternalLink, Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface PhishingModuleProps {
  onComplete: () => void;
}

interface Email {
  id: string;
  sender: string;
  subject: string;
  content: string;
  isPhishing: boolean;
  redFlags: string[];
  legitimateFeatures: string[];
}

export const PhishingModule = ({ onComplete }: PhishingModuleProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedEmails, setSelectedEmails] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const emails: Email[] = [
    {
      id: "1",
      sender: "security@paypaI.com",
      subject: "URGENT: Your account will be suspended!",
      content: "Dear valued customer, we noticed suspicious activity. Click here immediately to verify your account or it will be suspended within 24 hours!",
      isPhishing: true,
      redFlags: ["Suspicious domain (paypaI with uppercase i)", "Urgent language", "Threatens account suspension", "Generic greeting"],
      legitimateFeatures: []
    },
    {
      id: "2", 
      sender: "notifications@github.com",
      subject: "Security alert: New sign-in to your account",
      content: "Hi John, we noticed a new sign-in to your GitHub account from a new device. If this was you, you can disregard this message. If not, please secure your account.",
      isPhishing: false,
      redFlags: [],
      legitimateFeatures: ["Legitimate domain", "Personal greeting", "Informational tone", "No urgent action required"]
    },
    {
      id: "3",
      sender: "winner@lottery-international.biz",
      subject: "CONGRATULATIONS! You've won $500,000!",
      content: "You have been selected as a winner in our international lottery! To claim your prize, please provide your banking details and pay a small processing fee of $200.",
      isPhishing: true,
      redFlags: ["Too good to be true", "Requests banking details", "Asks for upfront payment", "Suspicious domain"],
      legitimateFeatures: []
    },
    {
      id: "4",
      sender: "support@yourbank.com",
      subject: "Monthly statement is ready",
      content: "Your monthly statement for account ending in 1234 is now available in your online banking portal. Please log in through our official website to view.",
      isPhishing: false,
      redFlags: [],
      legitimateFeatures: ["Official domain", "No urgent action", "Refers to official portal", "Account-specific info"]
    }
  ];

  const handleEmailSelection = (emailId: string, isPhishing: boolean) => {
    setSelectedEmails(prev => ({
      ...prev,
      [emailId]: isPhishing
    }));
  };

  const checkAnswers = () => {
    let correctAnswers = 0;
    emails.forEach(email => {
      if (selectedEmails[email.id] === email.isPhishing) {
        correctAnswers++;
      }
    });
    setScore((correctAnswers / emails.length) * 100);
    setShowResults(true);
    
    if (correctAnswers === emails.length) {
      toast.success("Perfect! You've mastered phishing detection!");
      onComplete();
    } else {
      toast.warning(`You got ${correctAnswers}/${emails.length} correct. Review the explanations below.`);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 text-foreground">What is Phishing?</h2>
              <p className="text-muted-foreground">Learn to identify fraudulent attempts to steal your information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-warning" />
                  <h3 className="text-lg font-semibold text-foreground">Common Red Flags</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Urgent or threatening language</li>
                  <li>• Suspicious sender addresses</li>
                  <li>• Generic greetings ("Dear Customer")</li>
                  <li>• Requests for sensitive information</li>
                  <li>• Poor grammar and spelling</li>
                  <li>• Too-good-to-be-true offers</li>
                </ul>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-success" />
                  <h3 className="text-lg font-semibold text-foreground">Legitimate Signs</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Official domain names</li>
                  <li>• Personal greetings with your name</li>
                  <li>• Professional formatting</li>
                  <li>• No urgent action required</li>
                  <li>• Account-specific information</li>
                  <li>• Contact information provided</li>
                </ul>
              </Card>
            </div>

            <Button onClick={() => setCurrentStep(2)} className="w-full">
              Practice with Real Examples
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Phishing Detection Challenge</h2>
              <p className="text-muted-foreground">Analyze these emails and identify which ones are phishing attempts</p>
            </div>

            <div className="space-y-4">
              {emails.map((email) => (
                <Card key={email.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="h-4 w-4 text-primary" />
                        <span className="font-medium text-foreground">From: {email.sender}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{email.subject}</h3>
                      <p className="text-muted-foreground leading-relaxed">{email.content}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant={selectedEmails[email.id] === false ? "default" : "outline"}
                      onClick={() => handleEmailSelection(email.id, false)}
                      className="flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Legitimate
                    </Button>
                    <Button
                      variant={selectedEmails[email.id] === true ? "destructive" : "outline"}
                      onClick={() => handleEmailSelection(email.id, true)}
                      className="flex-1"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Phishing
                    </Button>
                  </div>

                  {showResults && (
                    <div className="mt-4 p-4 rounded-lg border-l-4 border-l-primary bg-primary/5">
                      <div className="flex items-center gap-2 mb-2">
                        {selectedEmails[email.id] === email.isPhishing ? (
                          <CheckCircle className="h-5 w-5 text-success" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive" />
                        )}
                        <span className="font-semibold">
                          {email.isPhishing ? "This is PHISHING" : "This is LEGITIMATE"}
                        </span>
                      </div>
                      {email.isPhishing && email.redFlags.length > 0 && (
                        <div className="mb-2">
                          <h4 className="font-medium text-destructive mb-1">Red Flags:</h4>
                          <ul className="text-sm text-muted-foreground">
                            {email.redFlags.map((flag, index) => (
                              <li key={index}>• {flag}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {!email.isPhishing && email.legitimateFeatures.length > 0 && (
                        <div>
                          <h4 className="font-medium text-success mb-1">Legitimate Features:</h4>
                          <ul className="text-sm text-muted-foreground">
                            {email.legitimateFeatures.map((feature, index) => (
                              <li key={index}>• {feature}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
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
                  disabled={Object.keys(selectedEmails).length !== emails.length}
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
                    {score === 100 ? "Perfect! You're a phishing detection expert!" :
                     score >= 75 ? "Great job! You have good phishing detection skills." :
                     "Keep practicing to improve your phishing detection abilities."}
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
        <div className="p-3 rounded-xl bg-warning/10 border border-warning/20">
          <Eye className="h-8 w-8 text-warning" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Phishing Detection Module</h1>
          <p className="text-muted-foreground">Learn to spot and avoid malicious emails and websites</p>
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