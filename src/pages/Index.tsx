import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Code, Zap, Users, Sparkles, CheckCircle, Star } from "lucide-react";
const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    teamSize: ""
  });
  useEffect(() => {
    setIsVisible(true);
  }, []);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission here
    setIsDialogOpen(false);
  };
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const features = [{
    icon: <Code className="h-8 w-8" />,
    title: "DiffGraph",
    description: "Quickly visualize the changes AI code introduces"
  }, {
    icon: <Zap className="h-8 w-8" />,
    title: "Prompt Orchestrator",
    description: "Gathers objectives & constraints then orchestrates AI agents to execute"
  }, {
    icon: <Users className="h-8 w-8" />,
    title: "Scenario Engine",
    description: "Generates multiple builds for the user to choose best fit"
  }];
  const testimonials = [{
    name: "Sarah Chen",
    role: "Senior Developer",
    company: "TechCorp",
    content: "Wildest AI has transformed how we approach development. The AI suggestions are incredibly accurate.",
    rating: 5
  }, {
    name: "Marcus Rodriguez",
    role: "CTO",
    company: "StartupXYZ",
    content: "We've reduced our development time by 60% while improving code quality. Game-changer!",
    rating: 5
  }, {
    name: "Emily Watson",
    role: "Lead Engineer",
    company: "DevStudio",
    content: "The agile AI approach has revolutionized our sprint planning and execution.",
    rating: 5
  }];
  return <div className="min-h-screen bg-background">
    {/* Header */}
    <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <img src="/lovable-uploads/ba71df48-aa83-4792-9619-cfb9dca550e8.png" alt="Wildest AI Logo" className="w-10 h-10 object-contain" />
          </div>
          <span className="text-xl font-bold">Wildest AI</span>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Get Started with Wildest AI</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={formData.firstName} onChange={e => handleInputChange("firstName", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={formData.lastName} onChange={e => handleInputChange("lastName", e.target.value)} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={e => handleInputChange("email", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamSize">Size of Engineering Team</Label>
                  <Select value={formData.teamSize} onValueChange={value => handleInputChange("teamSize", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10</SelectItem>
                      <SelectItem value="10-50">10-50</SelectItem>
                      <SelectItem value="50-100">50-100</SelectItem>
                      <SelectItem value="100-500">100-500</SelectItem>
                      <SelectItem value="500+">500+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Submit
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </nav>
      </div>
    </header>

    {/* Hero Section */}
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 hero-gradient"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
            <Sparkles className="h-4 w-4 mr-2" />
            The Future of Development is Here
          </Badge>
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            The Operating System for <span className="gradient-text">AI Code</span>
          </h1>
          <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">Unhobble AI Code Generation by equipping your teams with interactive visualizations of AI-generated diffs </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 animate-pulse-glow">
                  Start Building <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>
      </div>
    </section>

    {/* Features Section */}
    

    {/* Code Demo Section */}
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="w-full lg:w-1/3 order-1 flex flex-col items-center lg:items-start">
            <div className="w-full max-w-lg">
              <h2 className="text-4xl font-bold mb-6 text-center lg:text-left">
                Code smarter, not harder
              </h2>
              <p className="text-xl text-muted-foreground mb-8 text-center lg:text-left">
                AI generates 100x the output of human engineers, but current tools rely on text and line-by-line diffs.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="w-full">Semantic understanding of code changes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="w-full">Visualization of code changes based on functional relationship (not file structure)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="w-full">Zoom-in and out to understand different layers </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="w-full">Performance optimization</span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-2/3 order-2 flex justify-center">
            <div className="w-full">
              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="p-0">
                  <div style={{
                    position: "relative",
                    boxSizing: "content-box",
                    maxHeight: "80vh",
                    width: "100%",
                    aspectRatio: "1.6",
                    padding: "40px 0 40px 0"
                  }}>
                    <iframe src="https://app.supademo.com/embed/cmc0qtem7iz1nsn1rmw7aellf?embed_v=2" loading="lazy" title="Code Demo" allow="clipboard-write" allowFullScreen style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%"
                    }}></iframe>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Testimonials Section */}


    {/* CTA Section */}
    <section className="py-20">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">
            Ready to <span className="gradient-text">supercharge</span> your development?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join the AI revolution and start building the future today.
          </p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 animate-pulse-glow">
                Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </DialogTrigger>
          </Dialog>
          <div className="mt-4 text-sm text-muted-foreground">
            No credit card required • Free 14-day trial
          </div>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="border-t border-border/50 py-12">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        &copy; {new Date().getFullYear()} Wildest AI. All rights reserved.
      </div>
    </footer>
  </div>;
};
export default Index;