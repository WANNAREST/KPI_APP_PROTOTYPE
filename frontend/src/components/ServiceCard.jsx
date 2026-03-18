const ServiceCard = ({ name, port, tech, color, techColor }) => {
  return (
    <div className={`card border-t-4 ${color}`}>
      <div className="card-body pb-4">
        <div className="flex justify-end mb-4">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-teal-500/10 text-teal-600 border border-teal-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.6)]"></span>
            ONLINE
          </span>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-500 text-lg mb-4 shadow-sm">
          ⊟
        </div>
        <p className="text-sm font-bold text-stone-900">{name}</p>
        <div className="flex items-center justify-between mt-1.5">
          <p className="text-xs text-stone-600">Port {port}</p>
          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold ${techColor}`}>
            {tech}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ServiceCard;


