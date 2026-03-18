export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-50/80 backdrop-blur-md p-4 transition-all">
      <div className={`card w-full ${maxWidth} bg-white shadow-2xl border-stone-200`}>
        <div className="card-header border-stone-200">
          <h2 className="text-lg font-bold text-stone-900">{title}</h2>
          <button onClick={onClose} className="text-stone-600 hover:text-rose-600 transition-colors cursor-pointer text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-rose-500/10">✕</button>
        </div>
        <div className="card-body">
          {children}
        </div>
      </div>
    </div>
  );
}


