import { useMemo } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Position,
  Handle,
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

interface Field {
  name: string;
  fieldType: string;
}

interface ModelSchema {
  modelName: string;
  fields: Field[];
}

interface SchemaDiagramProps {
  schemas: ModelSchema[];
  modelNames: string[];
}

function normalizeFieldName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "");
}

const RELATIONSHIPS: {
  source: string;
  target: string;
  sourceField: string;
  targetField: string;
  type: "many-to-one" | "one-to-many" | "many-to-many";
  label: string;
}[] = [
  {
    source: "home",
    target: "jellyfish",
    sourceField: "jellyfish",
    targetField: "homes",
    type: "many-to-one",
    label: "N:1",
  },
  {
    source: "jellyfish",
    target: "foodChain",
    sourceField: "foods",
    targetField: "jellyfish",
    type: "one-to-many",
    label: "1:N",
  },
  {
    source: "foodChain",
    target: "food",
    sourceField: "food",
    targetField: "jellyfish",
    type: "many-to-one",
    label: "N:1",
  },
];

function EntityNode({ data }: { data: { label: string; fields: Field[] } }) {
  const filteredFields = data.fields.filter(
    (f) => !["id", "createdAt", "updatedAt"].includes(f.name)
  );

  const isRelationshipField = (fieldType: string) =>
    ["BelongsTo", "HasMany", "HasManyThrough"].includes(fieldType);

  return (
    <div className="bg-card border-2 border-primary/50 rounded-lg shadow-lg min-w-[200px] overflow-hidden relative">
      <Handle
        type="target"
        position={Position.Left}
        id="node-left"
        className="!bg-primary !w-2 !h-2 !opacity-0"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="node-right"
        className="!bg-primary !w-2 !h-2 !opacity-0"
      />

      <div className="bg-primary/40 px-4 py-2 border-b-2 border-primary/50">
        <h3 className="text-sm font-bold capitalize text-primary">
          {data.label}
        </h3>
      </div>

      <div className="bg-card">
        {filteredFields.map((field) => {
          const isRelField = isRelationshipField(field.fieldType);
          return (
            <div
              key={field.name}
              className={`relative flex justify-between py-2 px-3 text-xs border-b border-primary/10 last:border-0 gap-4 ${
                isRelField ? "bg-primary/5" : ""
              }`}
            >
              <Handle
                type="target"
                position={Position.Left}
                id={`${field.name}-left`}
                className="!bg-primary !w-2 !h-2 !border-0 !opacity-0"
                style={{ top: "50%" }}
              />

              <span
                className={`font-mono font-medium ${isRelField ? "text-primary" : "text-foreground"}`}
              >
                {field.name}
              </span>
              <span className="font-mono text-muted-foreground text-[11px]">
                {field.fieldType}
              </span>

              <Handle
                type="source"
                position={Position.Right}
                id={`${field.name}-right`}
                className="!bg-primary !w-2 !h-2 !border-0 !opacity-0"
                style={{ top: "50%" }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RelationshipEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const label = (data?.label as string) || "";

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        d={edgePath}
        fill="none"
        className="stroke-primary stroke-2"
      />

      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "all",
            }}
            className="text-[10px] bg-background px-2 py-1 rounded border border-primary/30 text-muted-foreground font-medium"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

const nodeTypes = { entity: EntityNode };
const edgeTypes = { relationship: RelationshipEdge };

export function SchemaDiagram({ schemas, modelNames }: SchemaDiagramProps) {
  const { nodes, edges } = useMemo(() => {
    if (schemas.length === 0) {
      return { nodes: [], edges: [] };
    }

    const sortedSchemas = [...schemas].sort((a, b) => {
      const indexA = modelNames.indexOf(a.modelName);
      const indexB = modelNames.indexOf(b.modelName);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    const nodeSpacing = 320;
    const nodes: Node[] = sortedSchemas.map((schema, index) => ({
      id: schema.modelName,
      type: "entity",
      position: { x: index * nodeSpacing, y: 0 },
      data: { label: schema.modelName, fields: schema.fields },
    }));

    const findFieldName = (
      modelName: string,
      searchField: string
    ): string | null => {
      const schema = sortedSchemas.find((s) => s.modelName === modelName);
      if (!schema) return null;

      const exactMatch = schema.fields.find((f) => f.name === searchField);
      if (exactMatch) return exactMatch.name;

      const normalizedSearch = normalizeFieldName(searchField);
      const match = schema.fields.find(
        (f) => normalizeFieldName(f.name) === normalizedSearch
      );
      return match?.name || null;
    };

    const edges: Edge[] = RELATIONSHIPS.filter(
      (rel) =>
        modelNames.includes(rel.source) && modelNames.includes(rel.target)
    ).map((rel, index) => {
      const sourceFieldName = findFieldName(rel.source, rel.sourceField);
      const targetFieldName = findFieldName(rel.target, rel.targetField);

      const sourceHandle = sourceFieldName
        ? `${sourceFieldName}-right`
        : "node-right";
      const targetHandle = targetFieldName
        ? `${targetFieldName}-left`
        : "node-left";

      const edge: Edge = {
        id: `edge-${index}`,
        source: rel.source,
        target: rel.target,
        sourceHandle,
        targetHandle,
        type: "relationship",
        data: { type: rel.type, label: rel.label },
      };
      return edge;
    });

    return { nodes, edges };
  }, [schemas, modelNames]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      fitViewOptions={{ padding: 0.05, minZoom: 0.5, maxZoom: 1.5 }}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      panOnDrag={false}
      zoomOnScroll={false}
      zoomOnPinch={false}
      zoomOnDoubleClick={false}
      preventScrolling={false}
      proOptions={{ hideAttribution: true }}
      className="bg-transparent"
    />
  );
}
