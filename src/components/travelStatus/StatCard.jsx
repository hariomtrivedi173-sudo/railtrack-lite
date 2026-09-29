export default function StatCard({ label, value, tag, color, icon, tint }) {
  return (
    <div className="card stat" style={{ borderTopColor: color }}>
      <div className="row">
        <span className="lbl">{label}</span>
        <span className="sico" style={{ background: tint, color }}>{icon}</span>
      </div>
      <div className="row end">
        <strong className="big" style={{ color: color === '#8b1f36' ? '#0f172a' : color }}>{value}</strong>
        <span className="tag" style={{ background: tint, color }}>{tag}</span>
      </div>
    </div>
  )
}