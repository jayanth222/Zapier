export const ZapCell = ({ name, index }: { name?: string; index: number }) => {
  return (
    <div>
      <div className="flex max-w-md min-w-sm justify-center gap-x-2 rounded-md border border-slate-500 px-2 py-4">
        <div className="text-xl font-semibold">{index}</div>
        <div className="text-xl font-semibold">{name}</div>
      </div>
      <div></div>
    </div>
  );
};
