
export function Avatar({name}:{name:string}){
  const i=name.split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase();
  return <div className='flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700'>{i}</div>;
}
