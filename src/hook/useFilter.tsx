import { useCallback, useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { parse } from "date-fns";
import { toast } from "react-toastify";
import { DataFilteredProps } from "../interfaces/interfaces";

const useFilter = () => {
  const customId = "custom-id-search";
  const [data, setData] = useState([]);
  const [dataFiltered, setDataFiltered] = useState<DataFilteredProps[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [shouldHighlight, setShouldHighlight] = useState<boolean>(false);
  const [date, setDate] = useState({
    startDate: new Date(0),
    endDate: new Date(0).setMonth(11),
  });
  const [numberSheets, setNumberSheets] = useState<number>(0);

  const handleFilter = useCallback(() => {
    if (typeof date.startDate !== "object") {
      const filteredData = data?.filter((item) => {
        const departureDate = parse(
          item["FECHA DE IDA"],
          "dd/MM/yyyy",
          new Date()
        );
        const returnDate = parse(
          item["FECHA DE RETORNO"],
          "dd/MM/yyyy",
          new Date()
        );
        const start = new Date(date.startDate);
        const end = new Date(date.endDate);
        return (
          (departureDate.getTime() >= start.getTime() &&
            departureDate.getTime() <= end.getTime()) ||
          (returnDate.getTime() >= start.getTime() &&
            returnDate.getTime() <= end.getTime())
        );
      });

      if (filteredData?.length === 0) {
        toast.error("No result😭", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        setData(filteredData);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date.endDate, date.startDate]);

  const handleClearFilter = useCallback(() => {
    const storedData = localStorage.getItem("items");

    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    handleFilter();
  }, [date.startDate, handleFilter]);

  useEffect(() => {
    if (date.endDate === null) {
      handleClearFilter();
    }
  }, [date.endDate, handleClearFilter]);

  const fileReader = (files: File, numberSheets: number) => {
    const reader = new FileReader();
    reader.readAsBinaryString(files);
    reader.onload = (event) => {
      const data = event.target?.result;
      const workbook = XLSX.read(data, {
        type: "binary",
        dateNF: "dd/mm/yyyy",
      });

      const dataSheets: { [key: string]: unknown } = {};
      for (let i = 0; i < numberSheets; ++i) {
        const sheetName = workbook.SheetNames[i];

        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
        dataSheets[sheetName] = jsonData;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parsed: any[] = Object.values(dataSheets);

      const allData = [];
      for (let i = 0; i < parsed.length; i++) {
        for (let j = 0; j < parsed[i].length; j++) {
          allData.push(parsed[i][j]);
        }
      }

      setData(allData as never);
      localStorage.setItem("items", JSON.stringify(allData));
    };
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    numberSheets: number
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const files = event.target.files;

    if (files?.length) {
      fileReader(files[0], numberSheets);
      setShouldHighlight(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleValueChange = (dateValue: any) => {
    setDate(dateValue);
  };

  const handleValueFilter = (textInput: string) => {
    const searchData = data?.filter(({ AGENTES }: { AGENTES: string }) => {
      return AGENTES?.toLowerCase().includes(textInput.toLowerCase());
    });
    if (searchData.length === 0) {
      handleClearFilter();
      setDate({ startDate: null!, endDate: null! });
      toast.error("No result😭", {
        toastId: customId,
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else if (textInput === "") {
      handleClearFilter();
      setDate({ startDate: null!, endDate: null! });
    } else {
      setData(searchData);
    }
  };

  const handleDrop = (
    event: React.DragEvent<HTMLElement>,
    numberSheets: number
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const { files } = event.dataTransfer;

    if (files && files.length) {
      fileReader(files[0], numberSheets);
    }
    setShouldHighlight(false);
  };

  const sendDataModal = () => {
    setShowModal(true);
    const dataFiltered: DataFilteredProps[] = data?.map((row) => {
      const jsonData = {
        pasajero: row["NOMBRE Y APELLIDO DEL PASAJERO"],
        agentes: row["AGENTES"],
        ida: row["FECHA DE IDA"],
        retorno: row["FECHA DE RETORNO"],
      };
      return jsonData;
    });
    setDataFiltered(dataFiltered);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validNumberSheets = (e: any, inputField: boolean) => {
    e.preventDefault();
    e.stopPropagation();

    if (numberSheets > 0) {
      if (inputField) {
        handleFileUpload(e, numberSheets);
      } else {
        handleDrop(e, numberSheets);
      }
    } else {
      toast.error("Invalid number of spreadsheets, please select a number", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return {
    data,
    setData,
    shouldHighlight,
    setShouldHighlight,
    date,
    setDate,
    handleFilter,
    handleFileUpload,
    handleClearFilter,
    handleValueChange,
    handleDrop,
    showModal,
    setShowModal,
    dataFiltered,
    sendDataModal,
    validNumberSheets,
    numberSheets,
    setNumberSheets,
    handleValueFilter,
  };
};

export default useFilter;
