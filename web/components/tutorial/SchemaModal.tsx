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

export function SchemaModal({
  open,
  onOpenChange,
  modelNames = ["jellyfish"],
}: SchemaModalProps) {
  const [schemas, setSchemas] = useState<ModelSchema[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const fetchSchemas = async () => {
      setLoading(true);
      setError(null);
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

        if (fetchedSchemas.length > 0) {
          setSchemas(fetchedSchemas);
        } else {
          setError("Schemas not found");
        }
      } catch (err: any) {
        console.error("Failed to fetch schemas:", err);
        setError(err?.message || "Failed to load schemas");
      } finally {
        setLoading(false);
      }
    };

    fetchSchemas();
  }, [open, modelNames]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto border-6 border-primary/60">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Model schemas</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-6">
          {loading && (
            <div className="text-center py-8 text-muted-foreground">
              Loading schemas...
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
