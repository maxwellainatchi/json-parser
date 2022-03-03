import React, { useState } from "react";
import styles from "./FileInput.module.scss";
import classNames from "../utility/classNames";

const FileInput: React.FC<
  Exclude<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> & {
    onFileSelect?: (files: FileList | null) => void;
    clearOnSelect?: boolean;
  }
> = ({ onFileSelect, clearOnSelect = false, className, ...rest }) => {
  let [files, setFiles] = useState<FileList | null>(null);
  return (
    <label className={styles.file}>
      <input
        {...rest}
        type="file"
        className={classNames([className, styles.display])}
        onChange={(e) => {
          if (!clearOnSelect) {
            setFiles(e.target.files);
          }
          onFileSelect?.(e.target.files);
        }}
      />
      <span className={styles.display}>
        {(files?.length ?? 0) === 0
          ? "Choose a file..."
          : files!.length === 1
          ? files![0].name
          : `${files!.length} files selected.`}
      </span>
    </label>
  );
};

export default FileInput;
