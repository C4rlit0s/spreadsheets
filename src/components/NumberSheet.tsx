const ComponentNumber = ({
  number,
  setNumberSheets,
}: {
  number: number;
  setNumberSheets: (number: number) => void;
}) => {
  return (
    <div className="grid w-1/2 grid-cols-4 gap-2 rounded-xl bg-gray-200 p-2">
      {[...Array(number)].map((_, index) => (
        <div key={index}>
          <input
            type="radio"
            name="option"
            id={index.toString()}
            value={index + 1}
            className="peer hidden"
            onChange={(e) => {
              setNumberSheets(Number(e.target.value));
            }}
          />
          <label
            htmlFor={index.toString()}
            className="block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-red-400 peer-checked:font-bold peer-checked:text-white"
          >
            {index + 1}
          </label>
        </div>
      ))}
    </div>
  );
};

export default ComponentNumber;
