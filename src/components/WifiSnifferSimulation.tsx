import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Shield, AlertTriangle, Wifi, Smartphone, Laptop, Monitor } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface Packet {
  id: string;
  type: "http" | "https" | "email" | "social" | "banking";
  source: string;
  destination: string;
  content: string;
  isEncrypted: boolean;
  timestamp: number;
}

interface WifiSnifferSimulationProps {
  onComplete: () => void;
}

export const WifiSnifferSimulation = ({ onComplete }: WifiSnifferSimulationProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [capturedPackets, setCapturedPackets] = useState<Packet[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [simulationProgress, setSimulationProgress] = useState(0);

  const samplePackets: Omit<Packet, "id" | "timestamp">[] = [
    {
      type: "http",
      source: "User Device",
      destination: "news-site.com",
      content: "GET /login?username=john&password=secretpass123",
      isEncrypted: false
    },
    {
      type: "email",
      source: "User Device", 
      destination: "mail.provider.com",
      content: "Subject: Confidential Report - Company financials...",
      isEncrypted: false
    },
    {
      type: "social",
      source: "User Device",
      destination: "social-network.com", 
      content: "POST /message - Personal conversation with family",
      isEncrypted: false
    },
    {
      type: "banking",
      source: "User Device",
      destination: "secure-bank.com",
      content: "Account: ****1234, Balance: $5,432.10",
      isEncrypted: true
    },
    {
      type: "https",
      source: "User Device",
      destination: "shopping-site.com",
      content: "[ENCRYPTED] Credit card transaction data",
      isEncrypted: true
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && simulationProgress < 100) {
      interval = setInterval(() => {
        setSimulationProgress(prev => {
          const newProgress = prev + 2;
          if (newProgress >= 100) {
            setIsRunning(false);
            toast.success("Simulation complete! You've seen how data can be intercepted.");
            onComplete();
          }
          return Math.min(newProgress, 100);
        });

        // Add random packets
        if (Math.random() > 0.3) {
          const randomPacket = samplePackets[Math.floor(Math.random() * samplePackets.length)];
          const newPacket: Packet = {
            ...randomPacket,
            id: Date.now().toString(),
            timestamp: Date.now()
          };
          
          setCapturedPackets(prev => [newPacket, ...prev.slice(0, 9)]);
        }
      }, 800);
    }

    return () => clearInterval(interval);
  }, [isRunning, simulationProgress, onComplete]);

  const startSimulation = () => {
    setIsRunning(true);
    toast.info("Starting WiFi packet interception simulation...");
  };

  const pauseSimulation = () => {
    setIsRunning(false);
    toast.info("Simulation paused");
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setCapturedPackets([]);
    setSimulationProgress(0);
    setCurrentStep(1);
    toast.info("Simulation reset");
  };

  const getPacketIcon = (type: string) => {
    switch (type) {
      case "http": return <Monitor className="h-4 w-4" />;
      case "https": return <Shield className="h-4 w-4" />;
      case "email": return <Smartphone className="h-4 w-4" />;
      case "social": return <Laptop className="h-4 w-4" />;
      case "banking": return <Shield className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getPacketColor = (packet: Packet) => {
    if (packet.isEncrypted) return "text-success";
    return packet.type === "banking" ? "text-destructive" : "text-warning";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 bg-gradient-cyber bg-clip-text text-transparent">
          WiFi Sniffer Simulation
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Experience how attackers can intercept unencrypted data on public WiFi networks. 
          This simulation demonstrates real packet sniffing techniques in a safe environment.
        </p>
      </div>

      {/* Simulation Controls */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
              <Wifi className="h-6 w-6 text-destructive animate-cyber-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">Public WiFi Network</h3>
              <p className="text-muted-foreground">Monitoring traffic on "Free_Coffee_WiFi"</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {!isRunning ? (
              <Button onClick={startSimulation} className="bg-primary hover:bg-primary/90">
                <Play className="h-4 w-4 mr-2" />
                Start Sniffing
              </Button>
            ) : (
              <Button onClick={pauseSimulation} variant="secondary">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}
            <Button onClick={resetSimulation} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Simulation Progress</span>
            <span className="text-foreground font-medium">{simulationProgress}%</span>
          </div>
          <Progress value={simulationProgress} className="h-2" />
        </div>
      </Card>

      {/* Captured Packets */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-foreground">Intercepted Data Packets</h3>
          <Badge variant="secondary" className="bg-destructive/20 text-destructive border-destructive/30">
            {capturedPackets.length} packets captured
          </Badge>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {capturedPackets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Wifi className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No packets captured yet. Start the simulation to see intercepted data.</p>
            </div>
          ) : (
            capturedPackets.map((packet) => (
              <div
                key={packet.id}
                className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${
                  packet.isEncrypted 
                    ? "bg-success/5 border-success/20" 
                    : "bg-destructive/5 border-destructive/20"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${packet.isEncrypted ? "bg-success/10" : "bg-destructive/10"}`}>
                      {getPacketIcon(packet.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground">
                          {packet.source} → {packet.destination}
                        </span>
                        {packet.isEncrypted ? (
                          <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
                            <Shield className="h-3 w-3 mr-1" />
                            Encrypted
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-destructive/20 text-destructive border-destructive/30">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Vulnerable
                          </Badge>
                        )}
                      </div>
                      <p className={`text-sm font-mono ${getPacketColor(packet)}`}>
                        {packet.content}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(packet.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Learning Points */}
      <Card className="p-6 bg-gradient-glow border-primary/20">
        <h3 className="text-xl font-semibold text-foreground mb-4">🔒 Key Security Lessons</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-card rounded-lg border border-border">
            <h4 className="font-semibold text-destructive mb-2">⚠️ What You Saw</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Unencrypted passwords in plain text</li>
              <li>• Personal messages exposed</li>
              <li>• Login credentials intercepted</li>
              <li>• Email content readable</li>
            </ul>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border">
            <h4 className="font-semibold text-success mb-2">✅ How to Protect Yourself</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use VPN on public WiFi</li>
              <li>• Look for HTTPS websites only</li>
              <li>• Avoid sensitive activities</li>
              <li>• Use mobile data when possible</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};