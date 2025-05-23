export function Input({
  onchange,
  placeholder,
}: {
  onchange: () => void;
  placeholder: string;
}) {
  return (
    <div>
      <input
        type={"text"}
        placeholder={placeholder}
        className="px-4 py-2 m-2 border rounded "
        onChange={onchange}
      ></input>
    </div>
  );
}
