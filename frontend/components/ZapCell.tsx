export const ZapCell = ({
  name,
  index,
  imageURL,
  onClick,
}: {
  name?: string;
  index: number;
  imageURL?: string;
  onClick: () => void;
}) => {
  return (
    <div>
      <div
        onClick={onClick}
        className="flex max-w-md min-w-sm cursor-pointer justify-center gap-x-2 rounded-md border border-slate-500 px-2 py-4 capitalize"
      >
        {imageURL && <img src={imageURL} width={30} />}
        <div className="text-xl font-semibold">{index}</div>
        <div className="text-xl font-semibold">{name}</div>
      </div>
      <div></div>
    </div>
  );
};
