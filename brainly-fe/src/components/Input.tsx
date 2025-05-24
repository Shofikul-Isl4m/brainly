interface InputProsps {
  placeholder: string;
  ref?: any;
}

export function Input({ ref, placeholder }: InputProsps) {
  return (
    <div>
      <input
        type={"text"}
        ref={ref}
        placeholder={placeholder}
        className="px-4 py-2 m-2 border rounded "
      ></input>
    </div>
  );
}
