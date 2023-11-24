import { ReactNode } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import useFilter from "./hook/useFilter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "./components/Modal";
import ComponentNumber from "./components/NumberSheet";
import airplane from "./assets/airplane.png";

function App() {
  const {
    data,
    setData,
    shouldHighlight,
    setShouldHighlight,
    date,
    handleValueChange,
    showModal,
    setShowModal,
    dataFiltered,
    sendDataModal,
    setNumberSheets,
    validNumberSheets,
  } = useFilter();

  const preventDefaultHandler = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <>
      <section className="flex flex-col items-center justify-center">
        <p className="text-7xl mb-7 font-semibold">Spreadsheet📂</p>
        {data.length == 0 && (
          <>
            <p className="text-2xl font-semibold">
              How many spreadsheets will you filter?
            </p>
            <ComponentNumber number={4} {...{ setNumberSheets }} />
            <div
              className="w-1/2 py-2"
              onDragOver={(e) => {
                preventDefaultHandler(e);
                setShouldHighlight(true);
              }}
              onDragEnter={(e) => {
                preventDefaultHandler(e);
                setShouldHighlight(true);
              }}
              onDragLeave={(e) => {
                preventDefaultHandler(e);
                setShouldHighlight(false);
              }}
              onDrop={(e) => {
                preventDefaultHandler(e);
                validNumberSheets(e, false);
                setShouldHighlight(false);
              }}
            >
              <label
                htmlFor="dropzone-file"
                className={`flex flex-col items-center justify-center w-full h-28 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-cyan-900 ${
                  shouldHighlight ? `bg-cyan-900` : `bg-cyan-950`
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <p className="mb-2 font-semibold text-gray-500 dark:text-gray-400">
                    {shouldHighlight
                      ? "Leave Your File Here"
                      : "Drag and drop your files here"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                    XLSX, XLS
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  accept=".xlsx, .xls"
                  onChange={(e) => validNumberSheets(e, true)}
                  value={""}
                />
              </label>
            </div>
            <img className="h-1/2 cloud" src={airplane} alt="airplane" />
          </>
        )}
      </section>
      {data.length > 0 && (
        <>
          <div className="mb-4">
            <p className="text-2xl font-semibold text-left">
              Select a date range
            </p>
            <div className="flex justify-between">
              <div className="w-1/2">
                <Datepicker
                  value={date}
                  onChange={handleValueChange}
                  primaryColor={"amber"}
                  displayFormat={"DD/MM/YYYY"}
                  separator={"|"}
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => sendDataModal()}
                  className="bg-cyan-950 hover:bg-cyan-900 text-white font-bold py-2 px-4 border-b-4 border-cyan-800 hover:border-cyan-800 rounded"
                >
                  Export Whatsapp
                </button>
                <button
                  className="bg-amber-400 hover:bg-amber-300 text-white font-bold py-2 px-4 border-b-4 border-amber-500 hover:border-amber-400 rounded"
                  onClick={() => {
                    setData([]);
                    setNumberSheets(0);
                  }}
                >
                  Clear File
                </button>
                <p className="bg-red-400 hover:bg-red-300 text-white font-bold py-2 px-4 border-b-4 border-red-500 hover:border-red-400 rounded-full">
                  #{data.length}
                </p>
              </div>
            </div>
          </div>
          <div className="overflow-scroll h-100 rounded-lg shadow-2xl">
            <table>
              <thead>
                <tr>
                  {Object.keys(data[0]).map((key, index) => (
                    <th
                      key={index}
                      className="px-3 py-3 bg-cyan-950 text-center text-xs font-semibold text-gray-200"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, index) => (
                      <td key={index} className="text-gray-950 px-4">
                        {value as ReactNode}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <ToastContainer />
      <Modal {...{ showModal, setShowModal, dataFiltered }} />
    </>
  );
}

export default App;
