import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import releaseTruth from "@/data/release-truth.json";
import { ExternalLink, ShieldCheck } from "lucide-react";

const statusTone = {
  Available: "default",
  Beta: "secondary",
  Planned: "outline",
} as const;

function statusGroup(status: string): keyof typeof statusTone {
  if (status.startsWith("Available")) return "Available";
  if (status.startsWith("Beta")) return "Beta";
  return "Planned";
}

const ReleaseTruth = () => {
  const products = [
    {
      name: "DiffGraph CLI",
      status: releaseTruth.cli.status,
      detail: `${releaseTruth.cli.provider} ${releaseTruth.cli.model}; install from the verified source revision.`,
      href: `${releaseTruth.cli.repository}/commit/${releaseTruth.cli.sourceRevision}`,
      linkLabel: "Verify source",
    },
    {
      name: "VS Code extension",
      status: releaseTruth.extension.status,
      detail: `Version ${releaseTruth.extension.version} on the VS Code Marketplace and Open VSX.`,
      href: releaseTruth.extension.marketplace,
      linkLabel: "View Marketplace listing",
    },
    {
      name: "MCP server",
      status: releaseTruth.mcp.status,
      detail: releaseTruth.mcp.supportedInstall
        ? "A supported installation path is available."
        : "Source-only preview; there is no supported installation path yet.",
      href: releaseTruth.roadmapUrl,
      linkLabel: "View roadmap",
    },
  ];

  return (
    <section id="release-truth" className="py-20 bg-secondary/30" aria-labelledby="release-truth-title">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <Badge variant="outline" className="mb-4">
                <ShieldCheck className="h-4 w-4 mr-2" /> Dated release status
              </Badge>
              <h2 id="release-truth-title" className="text-3xl md:text-4xl font-bold mb-3">
                Availability as of {releaseTruth.asOf}
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                Product status, install links, and data handling are sourced from one public manifest and dated {releaseTruth.asOf}.
              </p>
            </div>
            <a
              href="/release-truth.json"
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              View machine-readable manifest <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {products.map((product) => {
              const group = statusGroup(product.status);
              return (
                <Card key={product.name} className="bg-background/80 border-border/50">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <Badge variant={statusTone[group]}>{group}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{product.status}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{product.detail}</p>
                    <a
                      href={product.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-primary hover:underline"
                    >
                      {product.linkLabel} <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="bg-background/80 border-border/50 mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Verified runtime support and AI-off behavior</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-2">DiffGraph CLI</h3>
                <p className="text-sm text-muted-foreground mb-2">Python {releaseTruth.cli.minimumPython} or newer.</p>
                <p className="text-sm text-muted-foreground">{releaseTruth.cli.aiOff}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">VS Code extension {releaseTruth.extension.version}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Requires VS Code {releaseTruth.extension.minimumVscode} or newer. The published Marketplace package contains a runnable CLI for {releaseTruth.extension.publishedRuntimeTargets.join(", ")} only.
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  Missing packaged runtimes: {releaseTruth.extension.missingRuntimeTargets.join(", ")}.
                </p>
                <p className="text-sm text-muted-foreground">{releaseTruth.extension.aiOff}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/80 border-border/50 mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Data handling and retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-2">What stays local</h3>
                  <p className="text-sm text-muted-foreground mb-2">{releaseTruth.dataHandling.localProcessing}</p>
                  <p className="text-sm text-muted-foreground">{releaseTruth.dataHandling.localArtifacts}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Credentials and WildestAI retention</h3>
                  <p className="text-sm text-muted-foreground mb-2">{releaseTruth.dataHandling.credentialHandling}</p>
                  <p className="text-sm text-muted-foreground">{releaseTruth.dataHandling.wildestAiRetention}</p>
                </div>
              </div>
              {releaseTruth.dataHandling.thirdParties.map((party) => (
                <div key={party.name} className="border-t border-border/50 pt-5">
                  <h3 className="font-semibold mb-2">Third party: {party.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {party.when}. Data sent: {party.data}.
                  </p>
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    <a href={party.dataControlsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-primary hover:underline">
                      Data controls and retention <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                    <a href={party.privacyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-primary hover:underline">
                      Privacy policy <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-background/80 border-border/50">
            <CardContent className="pt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-2">AI data flow</h3>
                <p className="text-sm text-muted-foreground">{releaseTruth.aiDataFlow}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Planned — not shipped</h3>
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  {releaseTruth.planned.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <a
                  href={releaseTruth.roadmapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-primary hover:underline mt-4"
                >
                  Track remaining release-truth work <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ReleaseTruth;
