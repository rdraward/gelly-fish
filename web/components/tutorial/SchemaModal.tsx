import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { GellyLogo } from "@/components/shared/GellyLogo";
import { api } from "@/api";

interface Field {
  name: string;
  fieldType: string;
}

interface ModelSchema {
  modelName: string;
  fields: Field[];
}

interface SchemaData {
  gadgetMeta: {
    model: {
      fields: Field[];
    } | null;
  };
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
  // Create cache key from sorted model names
  const cacheKey = [...modelNames].sort().join(",");

  // Return cached data if available
  if (schemaCache.has(cacheKey)) {
    return schemaCache.get(cacheKey)!;
  }

  // If already loading, return the existing promise
  if (loadingPromises.has(cacheKey)) {
    return loadingPromises.get(cacheKey)!;
  }

  // Start fetching
  const fetchPromise = (async () => {
    try {
      // Build query for all models
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

      // Use the Gadget client's internal request method
      // The client should handle authentication automatically
      const client = api as any;
      let response: any;

      // Try the request method (most common in GraphQL clients)
      if (typeof client.request === "function") {
        response = await client.request(query);
      } else if (typeof client.query === "function") {
        response = await client.query(query);
      } else {
        // Fallback: construct GraphQL endpoint and use fetch
        // Gadget apps typically expose GraphQL at /api/graphql
        const endpoint =
          client.connection?.endpoint ||
          client.endpoint ||
          window.location.origin + "/api";
        const graphqlUrl = endpoint.replace(/\/api$/, "") + "/api/graphql";

        const fetchResponse = await fetch(graphqlUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies for authentication
          body: JSON.stringify({ query }),
        });

        if (!fetchResponse.ok) {
          throw new Error(`HTTP error! status: ${fetchResponse.status}`);
        }

        response = await fetchResponse.json();
      }

      // Handle response - could be { data: {...} } or direct data
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

      // Cache the result
      if (fetchedSchemas.length > 0) {
        schemaCache.set(cacheKey, fetchedSchemas);
      }

      return fetchedSchemas;
    } finally {
      // Remove from loading promises once done
      loadingPromises.delete(cacheKey);
    }
  })();

  // Store the promise so concurrent requests can share it
  loadingPromises.set(cacheKey, fetchPromise);

  return fetchPromise;
}

export function SchemaModal({
  open,
  onOpenChange,
  modelNames = ["jellyfish"],
}: SchemaModalProps) {
  const [schemas, setSchemas] = useState<ModelSchema[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-load schemas when component mounts (even if modal is closed)
  useEffect(() => {
    const cacheKey = [...modelNames].sort().join(",");

    // If already cached, set it immediately
    if (schemaCache.has(cacheKey)) {
      setSchemas(schemaCache.get(cacheKey)!);
      return;
    }

    // Otherwise, fetch in the background
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

  // When modal opens, ensure we have the data
  useEffect(() => {
    if (!open) return;

    const cacheKey = [...modelNames].sort().join(",");

    // If cached, use it immediately
    if (schemaCache.has(cacheKey)) {
      setSchemas(schemaCache.get(cacheKey)!);
      setLoading(false);
      setError(null);
      return;
    }

    // Otherwise, show loading and fetch
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
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto border-6 border-primary/60">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Model schemas</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-6 min-h-[300px]">
          {loading && (
            <div className="space-y-6">
              {modelNames.map((modelName, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-primary/60 hover:bg-primary/60">
                        <TableHead className="font-semibold text-primary-foreground">
                          Field Name
                        </TableHead>
                        <TableHead className="font-semibold text-primary-foreground">
                          Field Type
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <Skeleton className="h-5 w-32" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-5 w-24" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
              <div className="flex items-center justify-center py-4">
                <div className="animate-pulse">
                  <GellyLogo height={48} className="opacity-60" />
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="text-center py-8 text-destructive">{error}</div>
          )}
          {!loading &&
            !error &&
            schemas.length > 0 &&
            schemas.map((schema) => (
              <div key={schema.modelName} className="space-y-2">
                <h3 className="text-lg font-semibold capitalize">
                  {schema.modelName}
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary/60 hover:bg-primary/60">
                      <TableHead className="font-semibold text-primary-foreground">
                        Field Name
                      </TableHead>
                      <TableHead className="font-semibold text-primary-foreground">
                        Field Type
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schema.fields.map((field) => (
                      <TableRow key={field.name}>
                        <TableCell className="font-mono font-medium">
                          {field.name}
                        </TableCell>
                        <TableCell className="font-mono text-muted-foreground">
                          {field.fieldType}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          {!loading && !error && schemas.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No schemas found
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
