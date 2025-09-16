import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Code, Zap, CheckCircle, Star, Sparkles } from "lucide-react";
const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);
  const features = [{
    icon: <Code className="h-8 w-8" />,
    title: "Semantic Understanding",
    description: "Stop drowning in line-by-line diffs. See AI-generated changes organized by their functional impact on your codebase."
  }, {
    icon: <Zap className="h-8 w-8" />,
    title: "Architectural View",
    description: "Instantly spot how AI changes affect your system's architecture and identify potential issues before they reach production."
  }];
  const testimonial = {
    name: "Sarah Chen",
    role: "Engineering Manager",
    company: "TechCorp",
    content: "Our team was flying blind with AI assistants, struggling to understand the scope of suggested changes. Wildest AI's real-time visualization lets us instantly see how AI-generated code fits into our architecture.",
    rating: 5
  };
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
        <nav className="hidden md:flex items-center space-x-4">
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <a href="https://marketplace.visualstudio.com/items?itemName=WildestAI.wildest-vscode-ext&ssr=false" target="_blank" rel="noopener noreferrer">
              VS Code Extension
            </a>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <a href="https://open-vsx.org/extension/WildestAI/wildest-vscode-ext" target="_blank" rel="noopener noreferrer">
              OpenVSX Extension
            </a>
          </Button>
        </nav>
      </div>
    </header>

    {/* Hero Section */}
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 hero-gradient"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
            <Sparkles className="h-4 w-4 mr-2" />
            The AI Code Understanding Gap
          </Badge>
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            When AI writes 100x more code, <span className="gradient-text">how do you make sense of it?</span>
          </h1>
          <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Traditional diff tools can't show you how AI-generated changes affect your codebase. See how leading teams visualize and understand AI code in real-time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 animate-pulse-glow" asChild>
              <a href="https://marketplace.visualstudio.com/items?itemName=WildestAI.wildest-vscode-ext&ssr=false" target="_blank" rel="noopener noreferrer">
                Install for VS Code <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://open-vsx.org/extension/WildestAI/wildest-vscode-ext" target="_blank" rel="noopener noreferrer">
                Install for Other Editors <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>

    {/* Expert Quote Section */}
    <section className="py-12 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Sundar Pichai Quote */}
          <div className="p-6 bg-background/50 backdrop-blur-sm rounded-lg border border-border/50 flex flex-col h-full">
            <p className="text-lg mb-4">
              "Across the company [Google], we have only accomplished a 10% engineering velocity increase using AI."
            </p>
            <div className="mt-auto flex items-center">
              <div>
                <p className="font-semibold">Sundar Pichai</p>
                <p className="text-sm text-muted-foreground">CEO of Google, June 2025</p>
              </div>
            </div>
          </div>
          {/* Andrej Karpathy Quote */}
          <div className="p-6 bg-background/50 backdrop-blur-sm rounded-lg border border-border/50 flex flex-col h-full">
            <p className="text-lg mb-4">
              "Keep AI on a tight leash. It's not useful for me to get a Diff [code change] of 1000s of lines of code. I'm still the bottleneck."
            </p>
            <div className="mt-auto flex items-center">
              <div>
                <p className="font-semibold">Andrej Karpathy</p>
                <p className="text-sm text-muted-foreground">OpenAI co-founder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

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
          <div className="w-full lg:w-2/3 order-2 flex flex-col justify-center">
            <div className="w-full max-w-4xl mx-auto">
              {/* <div className="flex justify-between mb-4 px-2">
                <h3 className="text-lg font-semibold">Before (traditional diff)</h3>
                <h3 className="text-lg font-semibold">After (Wildest Visualization)</h3>
              </div> */}
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

    {/* Features Section */}
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="bg-background/50 backdrop-blur-sm border-border/50">
              <CardContent className="pt-6">
                <div className="mb-4 p-2 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* Single Testimonial Section */}
    {/* <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-background/50 backdrop-blur-sm border-border/50">
            <CardContent className="pt-6">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="mb-6 text-muted-foreground">{testimonial.content}</p>
              <div>
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                <div className="text-sm text-muted-foreground">{testimonial.company}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section> */}

    {/* CTA Section */}
    <section className="py-20">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">
            Ready to <span className="gradient-text">supercharge</span> your development?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Install the Wildest AI extension and start coding smarter today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 animate-pulse-glow" asChild>
              <a href="https://marketplace.visualstudio.com/items?itemName=WildestAI.wildest-vscode-ext&ssr=false" target="_blank" rel="noopener noreferrer">
                Get VS Code Extension <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://open-vsx.org/extension/WildestAI/wildest-vscode-ext" target="_blank" rel="noopener noreferrer">
                Get OpenVSX Extension <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Free • Open Source • No account required
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