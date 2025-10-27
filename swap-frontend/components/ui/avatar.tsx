
export function Avatar({name}:{name?:string}){
  const safe = (name || '').toString();
  let i = '';

  if (!safe.trim()) {
    i = "?";
  } else {
    const parts = safe.split(' ').filter(Boolean);
    if (parts.length === 1) {
      i = parts[0].slice(0, 2).toUpperCase();
    } else {
      i = parts.map(s => s[0]).slice(0, 2).join('').toUpperCase();
    }
  }

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700">
      {i}
    </div>
  );
}
