import type { Point } from "@/lib/analysisTypes";

// Mirrors the landmark/mesh-connection drawing shared by
// vg_celebrity_face_mesh_overlay.dart (green) and vg_showdown_face_mesh_overlay.dart (white).
// Coordinates are normalized 0-1; viewBox is 0-100 with non-scaling strokes so line
// weight stays consistent regardless of the hero's rendered size.
export function MeshOverlay({ landmarks, meshConnections, color = "#ffffff", dotOpacity = 0.92, lineOpacity = 0.72 }: {
  landmarks?: Point[];
  meshConnections?: [number, number][];
  color?: string;
  dotOpacity?: number;
  lineOpacity?: number;
}) {
  if (!landmarks || landmarks.length === 0 || !meshConnections || meshConnections.length === 0) return null;
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      {meshConnections.map(([a, b], i) => {
        const p1 = landmarks[a];
        const p2 = landmarks[b];
        if (!p1 || !p2) return null;
        return (
          <line
            key={i}
            x1={p1.x * 100}
            y1={p1.y * 100}
            x2={p2.x * 100}
            y2={p2.y * 100}
            stroke={color}
            strokeOpacity={lineOpacity}
            strokeWidth={1.2}
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
      {landmarks.map((p, i) => (
        <circle key={i} cx={p.x * 100} cy={p.y * 100} r={1} fill={color} opacity={dotOpacity} />
      ))}
    </svg>
  );
}
