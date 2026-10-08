import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import artifact from "@/data/greeting-structural.json";
import fixture from "@/data/daily-driver-fixture.json";
import { useState } from "react";
import { ExternalLink, FileCode2, GitBranch, Info, Network, Quote } from "lucide-react";

const sampleDiffUrl = "/examples/greeting.diff";
const sampleArtifactUrl = "/examples/greeting-structural.json";
const fixtureManifestUrl = "/examples/daily-driver-fixture.json";
const reviewerTaskProtocolUrl = "/examples/daily-driver-review-task.json";
const acceptanceCoverageUrl = "/examples/daily-driver-acceptance-coverage.json";
const schemaUrl = `https://github.com/WildestAI/DiffGraph-CLI/blob/${fixture.source.commit}/diffgraph/schema/diffgraph-v2.schema.json`;

type Selection = "file" | "symbol" | "relationship";

const DiffGraphProof = () => {
  const [selection, setSelection] = useState<Selection>("symbol");
  const file = artifact.files[0];
  const symbol = artifact.symbols[0];
  const relationship = artifact.relationships[0];
  const selected = selection === "file" ? file : selection === "symbol" ? symbol : relationship;
  const evidence = selected.evidence[0];
  const sourceRange = evidence.line_start
    ? `${evidence.file ?? file.path}:${evidence.line_start}${evidence.line_end && evidence.line_end !== evidence.line_start ? `-${evidence.line_end}` : ""}`
    : evidence.file ?? file.path;

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
              <Button variant="outline" size="sm" asChild><a href={fixtureManifestUrl}><Info className="mr-2 h-4 w-4" /> View fixture manifest</a></Button>
              <Button variant="outline" size="sm" asChild><a href={reviewerTaskProtocolUrl}><Info className="mr-2 h-4 w-4" /> View review protocol</a></Button>
              <Button variant="outline" size="sm" asChild><a href={acceptanceCoverageUrl}><Info className="mr-2 h-4 w-4" /> View evidence coverage</a></Button>
            </div>
          </div>

          <Card className="bg-background/80 border-border/50 mb-6">
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
                  <div><dt className="font-medium text-foreground">Evidence</dt><dd>{evidence.kind} — <a className="text-primary hover:underline" href={sampleDiffUrl}>{sourceRange}</a></dd></div>
                  <div><dt className="font-medium text-foreground">Schema / generator</dt><dd>v{artifact.schema_version} / wild {artifact.wild_version}</dd></div>
                  <div><dt className="font-medium text-foreground">Generated</dt><dd>{artifact.generated_at}</dd></div>
                  <div><dt className="font-medium text-foreground">Input</dt><dd>{artifact.diff_ref.kind} diff; Python</dd></div>
                </dl>
                <div className="mt-5 rounded-md border border-border bg-muted/40 p-3 text-sm">
                  <div className="flex items-center gap-2 font-medium text-foreground"><Quote className="h-4 w-4 text-primary" /> Source evidence</div>
                  {"snippet" in evidence && evidence.snippet ? (
                    <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded bg-background p-2 font-mono text-xs text-foreground">{evidence.snippet}</pre>
                  ) : (
                    <p className="mt-2 text-muted-foreground">This selected evidence is backed by the parser finding at {sourceRange}.</p>
                  )}
                  <a className="mt-2 inline-flex text-primary hover:underline" href={sampleDiffUrl}>Open the checked-in textual diff</a>
                </div>
                <a href={schemaUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-primary hover:underline mt-5">View schema <ExternalLink className="ml-1 h-4 w-4" /></a>
              </aside>
            </CardContent>
          </Card>

          <Card className="bg-background/80 border-border/50">
            <CardContent className="pt-6 text-sm text-muted-foreground">
              <p><span className="font-medium text-foreground">Versioned fixture:</span> {fixture.fixtureVersion} documents this checked-in sanitized diff and artifact from the pinned CLI source revision, schema v{fixture.artifact.schemaVersion}, and SHA-256 digests.</p>
              <p className="mt-2">It is a static AI-off structural baseline, not an end-to-end benchmark. Install, extension, provider, recovery, timing, and reviewer-task measurements remain unreported. The linked review protocol is a static, no-network task template—not a completed reviewer study. The evidence-coverage record lists every daily-driver criterion and marks unmeasured evidence plainly.</p>
              <a className="mt-3 inline-flex text-primary hover:underline" href={fixture.source.commitUrl} target="_blank" rel="noopener noreferrer">Verify pinned CLI source revision <ExternalLink className="ml-1 h-4 w-4" /></a>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DiffGraphProof;
