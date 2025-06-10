import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Code, Zap, Users, Sparkles, CheckCircle, Star } from "lucide-react";
const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);
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
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
            <Button variant="outline" size="sm">Sign In</Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Get Started
            </Button>
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
              The New Agile for <span className="gradient-text">
AI Code</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">Unhobble AI Code Generation by equipping your teams with the tools to understand AI-generated diffs and prompt AI to generate multiple builds</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 animate-pulse-glow">
                Start Building <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
            </div>
            
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose <span className="gradient-text">Wildest AI</span>?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the next generation of software development with AI-powered tools designed for modern teams.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105">
                <CardContent className="p-8 text-center">
                  <div className="text-primary mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Code Demo Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Code smarter, not harder
              </h2>
              <p className="text-xl text-muted-foreground mb-8">AI generates 100x the output of human engineers, but current tools rely on text and line-by-line diffs. </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Semantic understanding of code changes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Visualization of code changes based on functions and operations (not file structure)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Zoom-in and out to understand different layers </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Performance optimization</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <Card className="bg-card/80 backdrop-blur-sm border-border/50 animate-float">
                <CardContent className="p-6">
                  <div className="aspect-video w-full">
                    <iframe
                      className="w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/0GmbbfMj-ew"
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Developers Are Saying</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of developers who have transformed their workflow
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />)}
                  </div>
                  <p className="text-muted-foreground mb-6">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

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
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 animate-pulse-glow">
              Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <div className="mt-4 text-sm text-muted-foreground">
              No credit card required • Free 14-day trial
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img src="/lovable-uploads/ba71df48-aa83-4792-9619-cfb9dca550e8.png" alt="Wildest AI Logo" className="w-8 h-8 object-contain" />
                </div>
                <span className="text-lg font-bold">Wildest AI</span>
              </div>
              <p className="text-muted-foreground">
                The New Agile for AI Code
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-muted-foreground">
                <div>Features</div>
                <div>Pricing</div>
                <div>Documentation</div>
                <div>API</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-muted-foreground">
                <div>About</div>
                <div>Careers</div>
                <div>Blog</div>
                <div>Contact</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-muted-foreground">
                <div>Help Center</div>
                <div>Community</div>
                <div>Status</div>
                <div>Security</div>
              </div>
            </div>
          </div>
          <div className="border-t border-border/50 mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Wildest AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;
