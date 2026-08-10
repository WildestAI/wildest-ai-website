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
      linkLabel: "Verify source",
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
