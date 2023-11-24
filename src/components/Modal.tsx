import { useState } from "react";
import { DataFilteredProps } from "../interfaces/interfaces";

const Modal = ({
  showModal,
  setShowModal,
  dataFiltered,
}: {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  dataFiltered: DataFilteredProps[];
}) => {
  const [noResult, setNoResult] = useState(false);
  return (
    <>
      {showModal ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none backdrop-blur-xl">
            <div className="relative my-6 mx-auto w-4/5">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                  <h3 className="text-3xl font-semibold text-left">
                    Leaked Information
                  </h3>
                  <div className="space-x-2">
                    <button
                      className="bg-amber-400 hover:bg-amber-300 text-white font-bold py-2 px-4 border-b-4 border-amber-500 hover:border-amber-400 rounded"
                      type="button"
                      onClick={() => setNoResult(!noResult)}
                    >
                      {!noResult ? "No return date" : "With return date"}
                    </button>
                    <button
                      className="bg-red-400 hover:bg-red-300 text-white font-bold py-2 px-4 border-b-4 border-red-500 hover:border-red-400 rounded"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      X
                    </button>
                  </div>
                </div>
                <div className="overflow-auto h-100 text-left p-6">
                  <h1 className="text-xl pb-4 font-semibold">
                    List of Whatsapp📲
                  </h1>
                  <table>
                    <tbody>
                      {dataFiltered.map((row, index) => (
                        <tr key={index}>
                          <td className="text-gray-950 px-4 border-b-2">
                            <p className="font-bold">
                              {`*Pasajero #${index + 1}*:
                              ${row.pasajero} / *Fecha de ida*:
                              ${row.ida}
                               / *Agente*: ${row.agentes}  ${
                                !noResult
                                  ? `/ *Fecha de retorno*:
                               ${row.retorno}`
                                  : ""
                              }`}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Modal;
