import { useRef, useState, useCallback, useEffect } from 'react';
import type { DrcViolation, LayoutData } from '@workspace/api-client-react';

interface LayoutViewerProps {
  layoutData: LayoutData;
  violations: DrcViolation[];
  selectedViolationIdx: number | null;
  onSelectViolation: (idx: number) => void;
}

const PADDING = 0.1; // 10% padding around the layout
const VIOLATION_COLORS: Record<string, { fill: string; stroke: string; selectedFill: string; selectedStroke: string }> = {
  critical: {
    fill: 'rgba(239,68,68,0.25)',
    stroke: 'rgba(239,68,68,0.85)',
    selectedFill: 'rgba(239,68,68,0.5)',
    selectedStroke: 'rgb(239,68,68)',
  },
  warning: {
    fill: 'rgba(245,158,11,0.25)',
    stroke: 'rgba(245,158,11,0.85)',
    selectedFill: 'rgba(245,158,11,0.5)',
    selectedStroke: 'rgb(245,158,11)',
  },
  info: {
    fill: 'rgba(59,130,246,0.25)',
    stroke: 'rgba(59,130,246,0.85)',
    selectedFill: 'rgba(59,130,246,0.5)',
    selectedStroke: 'rgb(59,130,246)',
  },
};

// PDK layer colours — vibrant palette for checked layers
const LAYER_PALETTE = [
  'rgba(100,149,237,0.40)', // cornflower blue
  'rgba(60,179,113,0.40)',  // medium sea green
  'rgba(218,112,214,0.40)', // orchid
  'rgba(255,165,0,0.40)',   // orange
  'rgba(135,206,235,0.40)', // sky blue
  'rgba(255,99,71,0.40)',   // tomato
];
const LAYER_STROKE_PALETTE = [
  'rgba(100,149,237,0.80)',
  'rgba(60,179,113,0.80)',
  'rgba(218,112,214,0.80)',
  'rgba(255,165,0,0.80)',
  'rgba(135,206,235,0.80)',
  'rgba(255,99,71,0.80)',
];

// Unconfigured layer style — dim gray so PDK layers stand out
const UNCONFIGURED_FILL   = 'rgba(120,120,120,0.18)';
const UNCONFIGURED_STROKE = 'rgba(120,120,120,0.35)';

function polyToPoints(
  vertices: number[][],
  toSvgX: (x: number) => number,
  toSvgY: (y: number) => number
): string {
  return vertices
    .filter((v) => Array.isArray(v) && v.length >= 2 && Number.isFinite(v[0]) && Number.isFinite(v[1]))
    .map(([x, y]) => `${toSvgX(x).toFixed(2)},${toSvgY(y).toFixed(2)}`)
    .join(' ');
}

export function LayoutViewer({ layoutData, violations, selectedViolationIdx, onSelectViolation }: LayoutViewerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [svgSize, setSvgSize] = useState({ w: 800, h: 500 });

  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSvgSize({ w: Math.max(width, 200), h: Math.max(height, 200) });
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Pan + zoom state
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const isPanning = useRef(false);
  const lastPan = useRef({ x: 0, y: 0 });

  // Coordinate mapping — guard against degenerate/NaN bounds before any arithmetic.
  // hasLayoutPreview in results.tsx already filters these out, but a second check
  // here prevents a silent NaN cascade if the component is ever called directly
  // with malformed API data.
  const bounds = layoutData?.bounds;
  if (
    !bounds ||
    !Number.isFinite(bounds.minX) || !Number.isFinite(bounds.minY) ||
    !Number.isFinite(bounds.maxX) || !Number.isFinite(bounds.maxY) ||
    bounds.maxX <= bounds.minX || bounds.maxY <= bounds.minY   // degenerate / inverted
  ) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground p-4 text-center">
        Layout coordinates are invalid and cannot be displayed.
      </div>
    );
  }
  const layoutW = bounds.maxX - bounds.minX;
  const layoutH = bounds.maxY - bounds.minY;

  const availW = svgSize.w * (1 - 2 * PADDING);
  const availH = svgSize.h * (1 - 2 * PADDING);
  const scaleX = availW / (layoutW || 1);
  const scaleY = availH / (layoutH || 1);
  const baseScale = Math.min(scaleX, scaleY);

  const offsetX = svgSize.w * PADDING + (availW - layoutW * baseScale) / 2;
  const offsetY = svgSize.h * PADDING + (availH - layoutH * baseScale) / 2;

  const toSvgX = useCallback(
    (x: number) => offsetX + (x - bounds.minX) * baseScale,
    [offsetX, bounds.minX, baseScale]
  );
  const toSvgY = useCallback(
    (y: number) => svgSize.h - (offsetY + (y - bounds.minY) * baseScale),
    [svgSize.h, offsetY, bounds.minY, baseScale]
  );

  const resetView = useCallback(() => setTransform({ x: 0, y: 0, scale: 1 }), []);

  const onWheel = useCallback((e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const rect = svgRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
    setTransform((prev) => {
      const newScale = Math.min(Math.max(prev.scale * factor, 0.2), 50);
      const newX = mx - (mx - prev.x) * (newScale / prev.scale);
      const newY = my - (my - prev.y) * (newScale / prev.scale);
      return { x: newX, y: newY, scale: newScale };
    });
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isPanning.current = true;
    lastPan.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - lastPan.current.x;
    const dy = e.clientY - lastPan.current.y;
    lastPan.current = { x: e.clientX, y: e.clientY };
    setTransform((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
  }, []);

  const onMouseUp = useCallback(() => { isPanning.current = false; }, []);

  // ── Layer colour maps ──────────────────────────────────────────────────────
  // Build a name lookup from configuredLayers: "layer/datatype" → name
  const configuredLayerNameMap = new Map<string, string>(
    (layoutData.configuredLayers ?? []).map((cl) => [`${cl.layer}/${cl.datatype}`, cl.name])
  );

  // Assign palette colours only to PDK-configured layers (by layer number)
  const pdkLayerNums = Array.from(
    new Set(
      (layoutData.configuredLayers ?? []).map((cl) => cl.layer)
    )
  );
  const pdkLayerColorMap = new Map<number, { fill: string; stroke: string }>(
    pdkLayerNums.map((layer, i) => [
      layer,
      {
        fill: LAYER_PALETTE[i % LAYER_PALETTE.length],
        stroke: LAYER_STROKE_PALETTE[i % LAYER_STROKE_PALETTE.length],
      },
    ])
  );

  // Fallback colour map for all layers (used when configuredLayers is absent)
  const allLayerNums = Array.from(new Set((layoutData.polygons ?? []).map((p) => p.layer)));
  const allLayerColorMap = new Map<number, { fill: string; stroke: string }>(
    allLayerNums.map((layer, i) => [
      layer,
      {
        fill: LAYER_PALETTE[i % LAYER_PALETTE.length],
        stroke: LAYER_STROKE_PALETTE[i % LAYER_STROKE_PALETTE.length],
      },
    ])
  );

  const hasConfiguredLayers = (layoutData.configuredLayers?.length ?? 0) > 0;

  // Count unconfigured polygons for the legend
  const unconfiguredLayerNums = hasConfiguredLayers
    ? allLayerNums.filter((n) => !pdkLayerNums.includes(n))
    : [];

  function getPolyColor(layer: number, isPdkLayer: boolean | undefined) {
    if (!hasConfiguredLayers) {
      // No layer info from backend — use full palette for all layers
      return allLayerColorMap.get(layer) ?? { fill: UNCONFIGURED_FILL, stroke: UNCONFIGURED_STROKE };
    }
    if (isPdkLayer === false) {
      return { fill: UNCONFIGURED_FILL, stroke: UNCONFIGURED_STROKE };
    }
    return pdkLayerColorMap.get(layer) ?? allLayerColorMap.get(layer) ?? { fill: UNCONFIGURED_FILL, stroke: UNCONFIGURED_STROKE };
  }

  // Violations with geometry — filter to entries with a valid polygon
  const violationsWithGeometry = (Array.isArray(violations) ? violations : [])
    .map((v, idx) => ({ v, idx }))
    .filter(({ v }) =>
      Array.isArray(v.geometry) &&
      v.geometry.length >= 3 &&
      v.geometry.every((pt) => Array.isArray(pt) && pt.length >= 2 && Number.isFinite(pt[0]) && Number.isFinite(pt[1]))
    );

  const baseStrokeWidth = Math.max(0.5, Math.min(1.5, layoutW / 200)) / baseScale;

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[400px] bg-[#0d1117] rounded-lg overflow-hidden select-none">
      {/* Toolbar */}
      <div className="absolute top-2 right-2 z-10 flex gap-1">
        <button
          onClick={resetView}
          className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 text-white rounded font-mono transition-colors"
          title="Reset zoom"
        >
          Reset
        </button>
      </div>

      {/* Legend */}
      <div className="absolute top-2 left-2 z-10 bg-black/50 rounded px-2 py-1.5 text-xs text-white/80 space-y-0.5 max-w-[180px]">
        <div className="font-semibold font-mono text-white/60 mb-1">
          {hasConfiguredLayers ? 'PDK Layers (checked)' : 'Layers'}
        </div>

        {/* PDK / all layers */}
        {(hasConfiguredLayers ? pdkLayerNums : allLayerNums).slice(0, 5).map((layerNum) => {
          const c = (hasConfiguredLayers
            ? pdkLayerColorMap.get(layerNum)
            : allLayerColorMap.get(layerNum)
          ) ?? { fill: UNCONFIGURED_FILL, stroke: UNCONFIGURED_STROKE };
          // Find the name from configuredLayers (match on layer number; take first matching datatype)
          const cl = (layoutData.configuredLayers ?? []).find((x) => x.layer === layerNum);
          const label = cl
            ? `${cl.name} (${layerNum}/${cl.datatype})`
            : `L${layerNum}`;
          return (
            <div key={layerNum} className="flex items-center gap-1.5">
              <span
                className="inline-block w-3 h-3 shrink-0 rounded-sm border"
                style={{ background: c.fill, borderColor: c.stroke }}
              />
              <span className="font-mono truncate" title={label}>{label}</span>
            </div>
          );
        })}
        {(hasConfiguredLayers ? pdkLayerNums : allLayerNums).length > 5 && (
          <div className="text-white/40 font-mono">
            +{(hasConfiguredLayers ? pdkLayerNums : allLayerNums).length - 5} more
          </div>
        )}

        {/* Unconfigured layers note */}
        {unconfiguredLayerNums.length > 0 && (
          <>
            <div className="border-t border-white/10 my-1" />
            <div className="flex items-center gap-1.5 text-white/40">
              <span
                className="inline-block w-3 h-3 shrink-0 rounded-sm border"
                style={{ background: UNCONFIGURED_FILL, borderColor: UNCONFIGURED_STROKE }}
              />
              <span className="font-mono">
                {unconfiguredLayerNums.length} unchecked layer{unconfiguredLayerNums.length !== 1 ? 's' : ''}
              </span>
            </div>
          </>
        )}

        {/* Violation severity swatches */}
        {violationsWithGeometry.length > 0 && (
          <>
            <div className="border-t border-white/10 my-1" />
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm border border-red-500/80 bg-red-500/25 shrink-0" />
              <span>Critical</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm border border-amber-500/80 bg-amber-500/25 shrink-0" />
              <span>Warning</span>
            </div>
          </>
        )}
      </div>

      {/* Scroll/pan hint */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-white/30 font-mono pointer-events-none">
        scroll to zoom · drag to pan
      </div>

      <svg
        ref={svgRef}
        width={svgSize.w}
        height={svgSize.h}
        className="cursor-grab active:cursor-grabbing"
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <g transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}>
          {/* Background layout polygons — unconfigured first (dim), PDK on top (vivid) */}
          {(layoutData.polygons ?? [])
            .filter((poly) => Array.isArray(poly.vertices) && poly.vertices.length >= 3)
            .slice()
            .sort((a, b) => {
              // Draw unconfigured layers first so PDK layers render on top
              const aIsPdk = a.isPdkLayer !== false;
              const bIsPdk = b.isPdkLayer !== false;
              if (aIsPdk === bIsPdk) return 0;
              return aIsPdk ? 1 : -1;
            })
            .map((poly, i) => {
              const color = getPolyColor(poly.layer, poly.isPdkLayer);
              const layerKey = `${poly.layer}/${poly.datatype}`;
              const layerName = configuredLayerNameMap.get(layerKey) ?? `Layer ${poly.layer}/${poly.datatype}`;
              return (
                <polygon
                  key={i}
                  points={polyToPoints(poly.vertices, toSvgX, toSvgY)}
                  fill={color.fill}
                  stroke={color.stroke}
                  strokeWidth={baseStrokeWidth}
                >
                  <title>{poly.isPdkLayer === false ? `Unchecked: ${layerName}` : layerName}</title>
                </polygon>
              );
            })}

          {/* Violation polygons */}
          {violationsWithGeometry.map(({ v, idx }) => {
            const isSelected = idx === selectedViolationIdx;
            const colors = VIOLATION_COLORS[v.severity] ?? VIOLATION_COLORS.info;
            return (
              <polygon
                key={`viol-${idx}`}
                points={polyToPoints(v.geometry!, toSvgX, toSvgY)}
                fill={isSelected ? colors.selectedFill : colors.fill}
                stroke={isSelected ? colors.selectedStroke : colors.stroke}
                strokeWidth={isSelected ? baseStrokeWidth * 2.5 : baseStrokeWidth * 1.5}
                className="cursor-pointer transition-all duration-150"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectViolation(idx);
                }}
              >
                <title>
                  {v.rule} ({v.severity}) — {v.location}
                </title>
              </polygon>
            );
          })}

          {/* Selected violation: bright animated ring */}
          {selectedViolationIdx !== null &&
            violationsWithGeometry.find(({ idx }) => idx === selectedViolationIdx) && (() => {
              const { v } = violationsWithGeometry.find(({ idx }) => idx === selectedViolationIdx)!;
              const colors = VIOLATION_COLORS[v.severity] ?? VIOLATION_COLORS.info;
              return (
                <polygon
                  points={polyToPoints(v.geometry!, toSvgX, toSvgY)}
                  fill="none"
                  stroke={colors.selectedStroke}
                  strokeWidth={baseStrokeWidth * 4}
                  strokeDasharray={`${baseStrokeWidth * 8} ${baseStrokeWidth * 4}`}
                  opacity={0.9}
                  style={{ pointerEvents: 'none' }}
                />
              );
            })()}
        </g>
      </svg>
    </div>
  );
}
