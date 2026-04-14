import { T } from "../_lib/tokens";

export default function Toggle({ on, onClick }: { on: boolean; onClick: (e: React.MouseEvent) => void }) {
  return (
    <button onClick={onClick} style={{
      width: 34, height: 20, borderRadius: 10, border: "none",
      background: on ? T.accent : T.borderHi, position: "relative",
      cursor: "pointer", padding: 0, flexShrink: 0,
    }}>
      <div style={{ position: "absolute", top: 2, left: on ? 16 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 150ms" }} />
    </button>
  );
}
