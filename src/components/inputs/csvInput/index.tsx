import React from "react";

const CSVUpload: React.FC<{ setFile: (file: File | undefined) => void }> = ({
  setFile,
}) => {

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <input
      type="file"
      accept=".csv"
      onChange={handleFileChange}
      className="block w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-violet-50 file:text-violet-700
                   hover:file:bg-violet-100"
    />
  );
};

export default CSVUpload;
