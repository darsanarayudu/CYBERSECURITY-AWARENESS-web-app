import { useState } from "react";
import { Globe, Shield, Eye, Lock, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface SecureBrowsingModuleProps {
  onComplete: () => void;
}

interface URLCheck {
  url: string;
  isSafe: boolean;
  reasons: string[];
}

export const SecureBrowsingModule = ({ onComplete }: SecureBrowsingModuleProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [checkedURLs, setCheckedURLs] = useState<Record<string, boolean>>({});
  const [customURL, setCustomURL] = useState("");
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const urlTests: URLCheck[] = [
    {
      url: "https://www.paypaI.com/login",
      isSafe: false,
      reasons: ["Suspicious domain (paypaI with uppercase I instead of l)", "Potential phishing site"]
    },
    {
      url: "http://freemusic-downloads.net/get-songs-now",
      isSafe: false,
      reasons: ["No HTTPS encryption", "Suspicious file download site", "Potential malware"]
    },
    {
      url: "https://github.com/microsoft/vscode",
      isSafe: true,
      reasons: ["Official GitHub domain", "HTTPS encryption", "Legitimate Microsoft repository"]
    },
    {
      url: "https://accounts.google.com/signin",
      isSafe: true,
      reasons: ["Official Google domain", "HTTPS encryption", "Legitimate login page"]
    },
    {
      url: "http://winner-prize-2024.click/claim-now",
      isSafe: false,
      reasons: ["No HTTPS", "Suspicious domain extension", "Likely scam/phishing"]
    }
  ];

  const analyzeURL = (url: string) => {
    const analysis = {
      hasHTTPS: url.startsWith("https://"),
      domain: "",
      suspiciousElements: [] as string[],
      safetyScore: 0
    };

    try {
      const urlObj = new URL(url);
      analysis.domain = urlObj.hostname;

      // Check for suspicious elements
      if (!analysis.hasHTTPS) {
        analysis.suspiciousElements.push("No HTTPS encryption");
      }
      
      if (urlObj.hostname.includes("free") && urlObj.pathname.includes("download")) {
        analysis.suspiciousElements.push("Free download site - potential malware");
      }
      
      if (urlObj.hostname.includes("click") || urlObj.hostname.includes("win")) {
        analysis.suspiciousElements.push("Suspicious domain name");
      }
      
      if (urlObj.hostname.match(/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/)) {
        analysis.suspiciousElements.push("IP address instead of domain name");
      }

      // Calculate safety score
      analysis.safetyScore = analysis.hasHTTPS ? 50 : 0;
      if (analysis.suspiciousElements.length === 0) analysis.safetyScore += 50;
      
    } catch {
      analysis.suspiciousElements.push("Invalid URL format");
    }

    return analysis;
  };

  const handleURLCheck = (url: string, userSaysIsSafe: boolean) => {
    setCheckedURLs(prev => ({
      ...prev,
      [url]: userSaysIsSafe
    }));
  };

  const checkAnswers = () => {
    let correctAnswers = 0;
    urlTests.forEach(test => {
      if (checkedURLs[test.url] === test.isSafe) {
        correctAnswers++;
      }
    });
    setScore((correctAnswers / urlTests.length) * 100);
    setShowResults(true);
    
    if (correctAnswers === urlTests.length) {
      toast.success("Perfect! You're a secure browsing expert!");
      onComplete();
    } else {
      toast.warning(`You got ${correctAnswers}/${urlTests.length} correct. Review the explanations below.`);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Secure Browsing Fundamentals</h2>
              <p className="text-muted-foreground">Learn to navigate the web safely and protect your privacy</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-success" />
                  <h3 className="text-lg font-semibold text-foreground">Safe Browsing Practices</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Always look for HTTPS (lock icon)</li>
                  <li>• Verify domain names carefully</li>
                  <li>• Keep browsers updated</li>
                  <li>• Use reputable antivirus software</li>
                  <li>• Be cautious with downloads</li>
                  <li>• Use private browsing when needed</li>
                </ul>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-warning" />
                  <h3 className="text-lg font-semibold text-foreground">Warning Signs</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Missing HTTPS on sensitive sites</li>
                  <li>• Suspicious domain names</li>
                  <li>• Excessive pop-ups</li>
                  <li>• Urgent download prompts</li>
                  <li>• Requests for personal info</li>
                  <li>• Too-good-to-be-true offers</li>
                </ul>
              </Card>
            </div>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">HTTPS vs HTTP</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                  <h4 className="font-semibold text-success mb-2">✅ HTTPS (Secure)</h4>
                  <p className="text-sm text-muted-foreground">
                    Encrypts data between your browser and the website. Look for the lock icon in the address bar.
                  </p>
                </div>
                <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                  <h4 className="font-semibold text-destructive mb-2">❌ HTTP (Insecure)</h4>
                  <p className="text-sm text-muted-foreground">
                    Data is sent in plain text and can be intercepted. Avoid entering sensitive information.
                  </p>
                </div>
              </div>
            </Card>

            <Button onClick={() => setCurrentStep(2)} className="w-full">
              Practice URL Analysis
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 text-foreground">URL Safety Assessment</h2>
              <p className="text-muted-foreground">Analyze these URLs and determine which ones are safe to visit</p>
            </div>

            <div className="space-y-4">
              {urlTests.map((test) => (
                <Card key={test.url} className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <ExternalLink className="h-5 w-5 text-primary" />
                    <code className="bg-muted px-2 py-1 rounded text-sm flex-1">
                      {test.url}
                    </code>
                  </div>
                  
                  <div className="flex gap-2 mb-4">
                    <Button
                      variant={checkedURLs[test.url] === true ? "default" : "outline"}
                      onClick={() => handleURLCheck(test.url, true)}
                      className="flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Safe to Visit
                    </Button>
                    <Button
                      variant={checkedURLs[test.url] === false ? "destructive" : "outline"}
                      onClick={() => handleURLCheck(test.url, false)}
                      className="flex-1"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Potentially Dangerous
                    </Button>
                  </div>

                  {showResults && (
                    <div className={`p-4 rounded-lg border-l-4 ${
                      checkedURLs[test.url] === test.isSafe 
                        ? "border-l-success bg-success/5" 
                        : "border-l-destructive bg-destructive/5"
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {checkedURLs[test.url] === test.isSafe ? (
                          <CheckCircle className="h-5 w-5 text-success" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                        )}
                        <span className="font-semibold">
                          This URL is {test.isSafe ? "SAFE" : "DANGEROUS"}
                        </span>
                      </div>
                      <ul className="text-sm text-muted-foreground">
                        {test.reasons.map((reason, index) => (
                          <li key={index}>• {reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            <Card className="p-6 bg-gradient-glow border-primary/20">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Try Your Own URL</h3>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Enter a URL to analyze..."
                  value={customURL}
                  onChange={(e) => setCustomURL(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={() => {
                    if (customURL) {
                      const analysis = analyzeURL(customURL);
                      toast.info(`Safety Score: ${analysis.safetyScore}% - ${analysis.suspiciousElements.length > 0 ? analysis.suspiciousElements.join(", ") : "No obvious issues detected"}`);
                    }
                  }}
                  disabled={!customURL}
                >
                  Analyze
                </Button>
              </div>
            </Card>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              {!showResults ? (
                <Button 
                  onClick={checkAnswers} 
                  disabled={Object.keys(checkedURLs).length !== urlTests.length}
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
                    {score === 100 ? "Excellent! You're a secure browsing expert!" :
                     score >= 80 ? "Great job! You have strong URL analysis skills." :
                     "Keep practicing to improve your ability to identify dangerous websites."}
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
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
          <Globe className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Secure Browsing Module</h1>
          <p className="text-muted-foreground">Learn to navigate the web safely and protect your privacy</p>
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