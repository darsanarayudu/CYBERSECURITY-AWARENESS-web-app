import { useState } from "react";
import { Shield, Wifi, Eye, Lock, Globe, Users, ChevronRight, Play, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModuleCard } from "@/components/ModuleCard";
import { WifiSnifferSimulation } from "@/components/WifiSnifferSimulation";
import { PasswordModule } from "@/components/modules/PasswordModule";
import { PhishingModule } from "@/components/modules/PhishingModule";
import { SocialEngineeringModule } from "@/components/modules/SocialEngineeringModule";
import { SecureBrowsingModule } from "@/components/modules/SecureBrowsingModule";
import { useEffect } from "react";
import axios from "axios";
type Module = "overview" | "password" | "phishing" | "social" | "browsing" | "wifi-sniffer";
const Index = () => {
  const [activeModule, setActiveModule] = useState<Module>("overview");
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  useEffect(() => {
  axios.get("http://localhost:5000/api/ping")
    .then((res) => console.log("✅ Connected to backend:", res.data))
    .catch((err) => console.error("❌ Backend not connected:", err));
}, []);


  const modules = [
    {
      id: "password",
      title: "Password Safety",
      description: "Learn to create and manage strong, secure passwords",
      icon: Lock,
      color: "cyber-green",
      estimatedTime: "15 min"
    },
    {
      id: "phishing",
      title: "Phishing Detection",
      description: "Identify and avoid malicious emails and websites",
      icon: Eye,
      color: "cyber-orange",
      estimatedTime: "20 min"
    },
    {
      id: "social",
      title: "Social Engineering",
      description: "Recognize manipulation tactics and protect yourself",
      icon: Users,
      color: "cyber-purple",
      estimatedTime: "18 min"
    },
    {
      id: "browsing",
      title: "Secure Browsing",
      description: "Browse the web safely and protect your privacy",
      icon: Globe,
      color: "cyber-blue",
      estimatedTime: "12 min"
    },
    {
      id: "wifi-sniffer",
      title: "WiFi Sniffer Simulation",
      description: "See how attackers intercept data on public networks",
      icon: Wifi,
      color: "cyber-red",
      estimatedTime: "10 min",
      isSpecial: true
    }
  ];

  const handleModuleComplete = (moduleId: string) => {
    setCompletedModules(new Set([...completedModules, moduleId]));
  };

  const renderActiveModule = () => {
    switch (activeModule) {
      case "password":
        return <PasswordModule onComplete={() => handleModuleComplete("password")} />;
      case "phishing":
        return <PhishingModule onComplete={() => handleModuleComplete("phishing")} />;
      case "social":
        return <SocialEngineeringModule onComplete={() => handleModuleComplete("social")} />;
      case "browsing":
        return <SecureBrowsingModule onComplete={() => handleModuleComplete("browsing")} />;
      case "wifi-sniffer":
        return <WifiSnifferSimulation onComplete={() => handleModuleComplete("wifi-sniffer")} />;
      default:
        return null;
    }
  };

  if (activeModule !== "overview") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="mb-6 flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setActiveModule("overview")}
              className="flex items-center gap-2"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back to Modules
            </Button>
          </div>
          {renderActiveModule()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-dark">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <Shield className="h-8 w-8 text-primary animate-glow-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">CyberSecurity Awareness</h1>
              <p className="text-muted-foreground">Interactive Cybersecurity Education Platform</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">Progress</span>
              </div>
              <p className="text-2xl font-bold text-primary">
                {completedModules.size}/{modules.length}
              </p>
              <p className="text-sm text-muted-foreground">Modules Completed</p>
            </Card>
            
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-5 w-5 text-success" />
                <span className="font-semibold text-foreground">Security Level</span>
              </div>
              <p className="text-2xl font-bold text-success">
                {completedModules.size === 0 ? "Beginner" : 
                 completedModules.size < 3 ? "Learning" :
                 completedModules.size < 5 ? "Advanced" : "Expert"}
              </p>
            </Card>
            
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
              <div className="flex items-center gap-3 mb-2">
                <Play className="h-5 w-5 text-accent" />
                <span className="font-semibold text-foreground">Time Invested</span>
              </div>
              <p className="text-2xl font-bold text-accent">
                {completedModules.size * 15}m
              </p>
              <p className="text-sm text-muted-foreground">Learning Time</p>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-cyber bg-clip-text text-transparent">
            Cybersecurity Awareness Through Interactive Learning
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore real-world security scenarios, learn to identify threats, and develop the skills to protect yourself online.
          </p>
        </div>

        {/* Learning Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              isCompleted={completedModules.has(module.id)}
              onClick={() => setActiveModule(module.id as Module)}
            />
          ))}
        </div>

        {/* Feature Highlight */}
        <Card className="p-8 bg-gradient-glow border-primary/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-cyber opacity-5"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-primary/20 border border-primary/30">
                <Wifi className="h-8 w-8 text-primary animate-cyber-pulse" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Featured: WiFi Sniffer Simulation</h3>
                <p className="text-muted-foreground">Experience how attackers intercept data on public networks</p>
              </div>
            </div>
            <p className="text-foreground mb-6 leading-relaxed">
              Our interactive WiFi sniffer simulation demonstrates real packet interception techniques used by attackers 
              on public networks. See exactly how your data can be compromised and learn essential protection strategies.
            </p>
            <Button 
              onClick={() => setActiveModule("wifi-sniffer")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Start Simulation
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>

  );
};

export default Index;