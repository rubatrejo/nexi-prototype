import { T } from "../_lib/tokens";

export default function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 9, fontWeight: 600, color: T.textDim, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>{label}</div>
      {children}
    </div>
  );
}
