import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ReleaseTruth from "@/components/ReleaseTruth";
import { ArrowRight, CheckCircle, Code, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const OPEN_VSX_URL = import.meta.env.VITE_OPEN_VSX_URL || "https://open-vsx.org/extension/WildestAI/wildest-vscode-ext";
  const VS_CODE_EXTENSION_URL = import.meta.env.VITE_VS_CODE_EXTENSION_URL || "https://marketplace.visualstudio.com/items?itemName=WildestAI.wildest-vscode-ext";

  useEffect(() => {
    setIsVisible(true);
  }, []);
  const features = [{
    icon: <Code className="h-8 w-8" />,
    title: "Semantic Understanding",
    description: "Move beyond line-by-line diffs with reports that organize changed code by functional impact."
  }, {
    icon: <Zap className="h-8 w-8" />,
    title: "Architectural View",
    description: "Explore changed files, summaries, and dependency relationships in one visual report."
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
        <nav className="hidden md:flex items-center space-x-4">
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <a href={VS_CODE_EXTENSION_URL} target="_blank" rel="noopener noreferrer">
              VS Code Extension
            </a>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <a href={OPEN_VSX_URL} target="_blank" rel="noopener noreferrer">
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
            When AI changes code faster, <span className="gradient-text">how do you make sense of it?</span>
          </h1>
          <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Traditional diffs show changed lines. Wildest AI helps you review the files, summaries, and relationships behind a larger change.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 animate-pulse-glow" asChild>
              <a href={VS_CODE_EXTENSION_URL} target="_blank" rel="noopener noreferrer">
                Install for VS Code <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href={OPEN_VSX_URL} target="_blank" rel="noopener noreferrer">
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
            <blockquote className="text-lg mb-4 italic">
              “Across the company, we have only accomplished a 10% engineering velocity increase using AI.”
            </blockquote>
            <div className="mt-auto flex items-center">
              <div>
                <p className="font-semibold">Sundar Pichai</p>
                <cite className="text-sm text-muted-foreground">CEO of Google — Lex Fridman Podcast (June 5, 2025)</cite>
              </div>
            </div>
          </div>
          {/* Andrej Karpathy Quote */}
          <div className="p-6 bg-background/50 backdrop-blur-sm rounded-lg border border-border/50 flex flex-col h-full">
            <blockquote className="text-lg mb-4 italic">
              “Keep AI on a tight leash. It's not useful for me to get a diff of thousands of lines of code. I'm still the bottleneck.”
            </blockquote>
            <div className="mt-auto flex items-center">
              <div>
                <p className="font-semibold">Andrej Karpathy</p>
                <cite className="text-sm text-muted-foreground">
                  Founding member of OpenAI — Y Combinator talk "Software Is Changing (Again)" (June 2025)
                </cite>
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
                AI agents can produce large changes quickly, while review tools still center on text and line-by-line diffs.
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
                  <span className="w-full">Local HTML report for sharing and review</span>
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

    <ReleaseTruth />


    {/* CTA Section */}
    <section className="py-20">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">
            Ready to <span className="gradient-text">understand</span> your next change?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Install the Wildest AI extension and review your staged or unstaged changes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 animate-pulse-glow" asChild>
              <a href={VS_CODE_EXTENSION_URL} target="_blank" rel="noopener noreferrer">
                Get VS Code Extension <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href={OPEN_VSX_URL} target="_blank" rel="noopener noreferrer">
                Get OpenVSX Extension <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Open source • No Wildest AI account required
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