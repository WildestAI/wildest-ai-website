import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import artifact from "../../public/examples/greeting-structural.json";
import { useState } from "react";
import { ExternalLink, FileCode2, GitBranch, Info, Network } from "lucide-react";

const sampleDiffUrl = "/examples/greeting.diff";
const sampleArtifactUrl = "/examples/greeting-structural.json";

type Selection = "file" | "symbol" | "relationship";

const DiffGraphProof = () => {
  const [selection, setSelection] = useState<Selection>("symbol");
  const file = artifact.files[0];
  const symbol = artifact.symbols[0];
  const relationship = artifact.relationships[0];
  const selected = selection === "file" ? file : selection === "symbol" ? symbol : relationship;

  return (
    <section className="py-20 bg-secondary/30" aria-labelledby="diffgraph-proof-title">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <Badge variant="outline" className="mb-4"><Network className="h-4 w-4 mr-2" /> Static, local proof</Badge>
              <h2 id="diffgraph-proof-title" className="text-3xl md:text-4xl font-bold mb-3">A real structural DiffGraph artifact</h2>
              <p className="text-muted-foreground max-w-3xl">
                This sanitized Python change is rendered from a checked-in DiffGraph v{artifact.schema_version} artifact. It makes no network requests and contains no AI-generated relationships.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" asChild><a href={sampleArtifactUrl}><FileCode2 className="mr-2 h-4 w-4" /> View artifact</a></Button>
              <Button variant="outline" size="sm" asChild><a href={sampleDiffUrl}><GitBranch className="mr-2 h-4 w-4" /> View textual diff</a></Button>
            </div>
          </div>

          <Card className="bg-background/80 border-border/50">
            <CardHeader className="space-y-3">
              <CardTitle className="text-xl">Interactive topology</CardTitle>
              <p className="text-sm text-muted-foreground">
                Select a node or relationship to inspect its source evidence. Keyboard users can tab to each control and activate it with Enter or Space.
              </p>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,.8fr)] gap-6">
              <div className="rounded-lg border border-border bg-muted/30 p-5" aria-label="DiffGraph topology">
                <div className="flex flex-col items-center gap-3 text-center">
                  <button type="button" onClick={() => setSelection("file")} aria-pressed={selection === "file"} className={`w-full max-w-sm rounded-lg border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${selection === "file" ? "border-primary bg-primary/10" : "border-border bg-background hover:bg-accent"}`}>
                    <span className="block text-xs text-muted-foreground">Changed file</span><span className="font-mono text-sm font-semibold">{file.path}</span>
                  </button>
                  <div className="h-8 border-l-2 border-dashed border-primary/60" aria-hidden="true" />
                  <button type="button" onClick={() => setSelection("relationship")} aria-pressed={selection === "relationship"} className={`rounded-full border px-3 py-1 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${selection === "relationship" ? "border-primary bg-primary/10" : "border-border bg-background hover:bg-accent"}`}>{relationship.kind}</button>
                  <div className="h-8 border-l-2 border-dashed border-primary/60" aria-hidden="true" />
                  <button type="button" onClick={() => setSelection("symbol")} aria-pressed={selection === "symbol"} className={`w-full max-w-sm rounded-lg border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${selection === "symbol" ? "border-primary bg-primary/10" : "border-border bg-background hover:bg-accent"}`}>
                    <span className="block text-xs text-muted-foreground">Changed {symbol.kind}</span><span className="font-mono text-sm font-semibold">{symbol.qualified_name}()</span>
                  </button>
                </div>
              </div>
              <aside className="rounded-lg border border-border bg-background p-5" aria-live="polite">
                <div className="flex items-center gap-2 mb-3"><Info className="h-4 w-4 text-primary" /><h3 className="font-semibold">Selected evidence</h3></div>
                <p className="text-sm font-medium mb-2">{"name" in selected ? selected.name : selected.kind}</p>
                <dl className="space-y-3 text-sm text-muted-foreground">
                  <div><dt className="font-medium text-foreground">Analysis source</dt><dd>{selected.analysis_source}</dd></div>
                  <div><dt className="font-medium text-foreground">Evidence</dt><dd>{selected.evidence[0].kind} — <a className="text-primary hover:underline" href={sampleDiffUrl}>{selected.evidence[0].file ?? file.path}{selected.evidence[0].line_start ? `:${selected.evidence[0].line_start}` : ""}</a></dd></div>
                  <div><dt className="font-medium text-foreground">Schema / generator</dt><dd>v{artifact.schema_version} / wild {artifact.wild_version}</dd></div>
                  <div><dt className="font-medium text-foreground">Generated</dt><dd>{artifact.generated_at}</dd></div>
                  <div><dt className="font-medium text-foreground">Input</dt><dd>{artifact.diff_ref.kind} diff; Python</dd></div>
                </dl>
                <a href="https://github.com/WildestAI/DiffGraph-CLI/blob/main/diffgraph/schema/diffgraph-v2.schema.json" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-primary hover:underline mt-5">View schema <ExternalLink className="ml-1 h-4 w-4" /></a>
              </aside>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DiffGraphProof;
