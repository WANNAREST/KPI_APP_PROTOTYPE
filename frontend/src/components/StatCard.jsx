const StatCard = ({ label, value, sub, iconBg, icon }) => {
  return (
    <div className="card p-5">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-stone-600 font-semibold uppercase tracking-wide">{label}</p>
          <p className="text-3xl font-bold text-stone-900 mt-2">{value}</p>
          <p className="text-[11px] text-stone-500 mt-1">{sub}</p>
        </div>
        <div className={`w-10 h-10 rounded-2xl ${iconBg} flex items-center justify-center text-lg`}>
          <img src={icon} alt="icon" className="w-5 h-5 opacity-80" />
        </div>
      </div>
    </div>
  )
}

export default StatCard;


