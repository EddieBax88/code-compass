import { createFileRoute, Link } from "@tanstack/react-router";
import { Cpu, ArrowLeft, Upload, FileCode, AlertTriangle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/plc")({
  head: () => {
    const title = "Industrial PLC Parsing (L5X) — NFPA 70 NEC 2026 Edition | Code Compass";
    const description =
      "NFPA 70 National Electrical Code (NEC) 2026 Edition — upload Rockwell L5X exports and parse tags, routines, and rung logic with SHA-256 verification for NEC-compliant controls-engineer troubleshooting.";
    const url = "https://codecompass.com/plc";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: PlcPage,
});

interface ParseResult {
  metadata: {
    project_name: string;
    version: string;
    l5x_hash: string;
    controller: { name: string | null; processorType: string | null } | null;
    programs: Array<{ name: string | null; mainRoutineName: string | null }>;
  };
  routines: Array<{
    name: string;
    type: string;
    rung_count: number;
    rungs: Array<{
      index: number;
      comment: string | null;
      logic_text: string | null;
      warnings?: Array<{ type: string; instruction: string; tag: string; message: string }>;
    }>;
  }>;
  tag_inventory: string[];
  validation_summary: {
    total_rungs: number;
    total_warnings: number;
    tags_defined: number;
  };
  svg: string;
}

function PlcPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ParseResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/parse-l5x", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to parse file");
        return;
      }

      setResult(data);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-5 py-14">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" /> Back to dashboard
      </Link>

      <div className="mt-6 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-md bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-ember">
          <Cpu className="h-5 w-5" />
        </span>
        <div className="text-[10px] uppercase tracking-[0.2em] text-accent">Module 02</div>
      </div>

      <h1 className="mt-3 font-display text-4xl font-semibold">Industrial PLC Parsing</h1>
      <p className="mt-2 font-display text-sm font-medium text-primary">
        NFPA 70 National Electrical Code (NEC) 2026 Edition
      </p>
      <p className="mt-2 text-muted-foreground max-w-xl">
        Upload Rockwell L5X exports. Parse tags, routines, and rung logic with SHA-256 verification
        for NEC-compliant controls-engineer troubleshooting and code review per the 2026 Edition.
      </p>

      {!result && (
        <div className="mt-10 rounded-2xl border border-dashed border-border bg-card/60 p-8">
          <div className="flex flex-col items-center gap-4">
            <FileCode className="h-12 w-12 text-muted-foreground/50" />
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-[0.18em] text-primary mb-2">
                Upload L5X File
              </div>
              <input
                type="file"
                accept=".L5X,.l5x"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-muted-foreground
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-primary-foreground
                  hover:file:bg-primary/90
                  file:cursor-pointer cursor-pointer"
              />
            </div>
            {file && (
              <div className="text-sm text-muted-foreground">
                Selected: <span className="font-mono text-foreground">{file.name}</span>
              </div>
            )}
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Upload className="h-4 w-4 animate-pulse" />
                  Parsing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Parse & Visualize
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-lg border border-red-500/50 bg-red-950/20 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-red-400">Parse Error</div>
            <div className="text-sm text-red-300/80 mt-1">{error}</div>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-8 space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-display text-2xl font-semibold">
                  {result.metadata.project_name}
                </h2>
                <div className="mt-1 text-sm text-muted-foreground space-x-3">
                  <span>Version: {result.metadata.version}</span>
                  <span>•</span>
                  <span className="font-mono text-xs">
                    {result.metadata.l5x_hash.slice(0, 30)}...
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setResult(null);
                  setFile(null);
                  setError(null);
                }}
                className="text-xs uppercase tracking-[0.18em] text-primary hover:text-primary/80"
              >
                Upload New
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="rounded-md bg-background/50 p-3">
                <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1">
                  Controller
                </div>
                <div className="font-mono text-xs">
                  {result.metadata.controller?.processorType || "N/A"}
                </div>
              </div>
              <div className="rounded-md bg-background/50 p-3">
                <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1">
                  Routines
                </div>
                <div className="font-mono text-xs">{result.routines.length}</div>
              </div>
              <div className="rounded-md bg-background/50 p-3">
                <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1">
                  Total Rungs
                </div>
                <div className="font-mono text-xs">{result.validation_summary.total_rungs}</div>
              </div>
              <div className="rounded-md bg-background/50 p-3">
                <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1">
                  Tags Defined
                </div>
                <div className="font-mono text-xs">{result.validation_summary.tags_defined}</div>
              </div>
            </div>

            {result.validation_summary.total_warnings > 0 && (
              <div className="mt-4 rounded-md border border-yellow-500/50 bg-yellow-950/20 p-3 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-200">
                  <span className="font-semibold">{result.validation_summary.total_warnings}</span>{" "}
                  tag reference warning{result.validation_summary.total_warnings > 1 ? "s" : ""}{" "}
                  detected
                </div>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-6 py-4 bg-background/30">
              <h3 className="font-display text-lg font-semibold">Ladder Logic Visualization</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Visual rung representation with live-pulse animation support
              </p>
            </div>
            <div className="p-6 overflow-x-auto" dangerouslySetInnerHTML={{ __html: result.svg }} />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-display text-lg font-semibold mb-4">Routine Details</h3>
            <div className="space-y-4">
              {result.routines.map((routine, idx) => (
                <div key={idx} className="border border-border rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-semibold">{routine.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {routine.type} • {routine.rung_count} rungs
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {routine.rungs.slice(0, 5).map((rung, rungIdx) => (
                      <div key={rungIdx} className="text-xs border-l-2 border-primary/30 pl-3">
                        <div className="flex items-start gap-2">
                          <span className="font-mono text-primary font-bold shrink-0">
                            #{rung.index}
                          </span>
                          <div className="flex-1 min-w-0">
                            {rung.comment && (
                              <div className="text-muted-foreground italic mb-1">
                                // {rung.comment}
                              </div>
                            )}
                            <div className="font-mono text-foreground break-all">
                              {rung.logic_text}
                            </div>
                            {rung.warnings && rung.warnings.length > 0 && (
                              <div className="mt-1 text-yellow-400 text-[10px]">
                                ⚠ {rung.warnings.length} warning
                                {rung.warnings.length > 1 ? "s" : ""}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {routine.rung_count > 5 && (
                      <div className="text-xs text-muted-foreground pt-2">
                        ... and {routine.rung_count - 5} more rungs
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-display text-lg font-semibold mb-4">Tag Inventory</h3>
            <div className="flex flex-wrap gap-2">
              {result.tag_inventory.slice(0, 50).map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-block rounded-md bg-background/50 px-3 py-1.5 text-xs font-mono"
                >
                  {tag}
                </span>
              ))}
              {result.tag_inventory.length > 50 && (
                <span className="text-xs text-muted-foreground self-center">
                  +{result.tag_inventory.length - 50} more
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
