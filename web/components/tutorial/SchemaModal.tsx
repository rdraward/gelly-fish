import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/api";
import { SchemaDiagram } from "./SchemaDiagram";

interface Field {
  name: string;
  fieldType: string;
}

interface ModelSchema {
  modelName: string;
  fields: Field[];
}

interface SchemaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modelNames?: string[];
}

// In-memory cache for schema data (keyed by sorted model names)
const schemaCache = new Map<string, ModelSchema[]>();
const loadingPromises = new Map<string, Promise<ModelSchema[]>>();

async function fetchSchemas(modelNames: string[]): Promise<ModelSchema[]> {
  const cacheKey = [...modelNames].sort().join(",");

  if (schemaCache.has(cacheKey)) {
    return schemaCache.get(cacheKey)!;
  }

  if (loadingPromises.has(cacheKey)) {
    return loadingPromises.get(cacheKey)!;
  }

  const fetchPromise = (async () => {
    try {
      const modelQueries = modelNames
        .map(
          (name, index) => `
            model${index}: model(apiIdentifier: "${name}") {
              fields {
                name
                fieldType
              }
            }
          `
        )
        .join("\n");

      const query = `
        query {
          gadgetMeta {
            ${modelQueries}
          }
        }
      `;

      const client = api as any;
      let response: any;

      if (typeof client.request === "function") {
        response = await client.request(query);
      } else if (typeof client.query === "function") {
        response = await client.query(query);
      } else {
        const endpoint =
          client.connection?.endpoint ||
          client.endpoint ||
          window.location.origin + "/api";
        const graphqlUrl = endpoint.replace(/\/api$/, "") + "/api/graphql";

        const fetchResponse = await fetch(graphqlUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ query }),
        });

        if (!fetchResponse.ok) {
          throw new Error(`HTTP error! status: ${fetchResponse.status}`);
        }

        response = await fetchResponse.json();
      }

      const data = response?.data || response;
      const models = data?.gadgetMeta || {};

      const fetchedSchemas: ModelSchema[] = modelNames
        .map((modelName, index) => {
          const modelData = models[`model${index}`];
          if (modelData?.fields) {
            return {
              modelName,
              fields: modelData.fields,
            };
          }
          return null;
        })
        .filter((schema): schema is ModelSchema => schema !== null);

      if (fetchedSchemas.length > 0) {
        schemaCache.set(cacheKey, fetchedSchemas);
      }

      return fetchedSchemas;
    } finally {
      loadingPromises.delete(cacheKey);
    }
  })();

  loadingPromises.set(cacheKey, fetchPromise);
  return fetchPromise;
}

export function SchemaModal({
  open,
  onOpenChange,
  modelNames = ["home", "jellyfish", "foodChain", "food"],
}: SchemaModalProps) {
  const [schemas, setSchemas] = useState<ModelSchema[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cacheKey = [...modelNames].sort().join(",");

    if (schemaCache.has(cacheKey)) {
      setSchemas(schemaCache.get(cacheKey)!);
      return;
    }

    fetchSchemas(modelNames)
      .then((fetchedSchemas) => {
        if (fetchedSchemas.length > 0) {
          setSchemas(fetchedSchemas);
        } else {
          setError("Schemas not found");
        }
      })
      .catch((err: any) => {
        console.error("Failed to fetch schemas:", err);
        setError(err?.message || "Failed to load schemas");
      });
  }, [modelNames]);

  useEffect(() => {
    if (!open) return;

    const cacheKey = [...modelNames].sort().join(",");

    if (schemaCache.has(cacheKey)) {
      setSchemas(schemaCache.get(cacheKey)!);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    fetchSchemas(modelNames)
      .then((fetchedSchemas) => {
        if (fetchedSchemas.length > 0) {
          setSchemas(fetchedSchemas);
        } else {
          setError("Schemas not found");
        }
      })
      .catch((err: any) => {
        console.error("Failed to fetch schemas:", err);
        setError(err?.message || "Failed to load schemas");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [open, modelNames]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[95vw] w-full max-h-[90vh] border-6 border-primary/60">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Model schemas</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mt-2">
          These are the data models and fields you can read using Gelly.
        </p>

        <div className="mt-4 h-[550px] bg-background/50 rounded-lg border border-primary/20 p-2">
          {loading && (
            <div className="flex items-center justify-center h-full gap-8">
              {modelNames.map((name, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-40 w-44" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-full text-destructive">
              {error}
            </div>
          )}

          {!loading && !error && schemas.length > 0 && (
            <SchemaDiagram schemas={schemas} modelNames={modelNames} />
          )}

          {!loading && !error && schemas.length === 0 && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No schemas found
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
