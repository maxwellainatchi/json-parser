const classNames = (
  classNames:
    | string
    | Array<string | undefined | null>
    | Record<string, boolean>
    | undefined
    | void
): string => {
  if (!classNames) {
    return "";
  }
  if (Array.isArray(classNames)) {
    return classNames.filter((val) => val).join(" ");
  }
  if (typeof classNames === "object") {
    return Object.entries(classNames).reduce(
      (str, [name, value]) => (value ? str : `${str} ${name}`),
      ""
    );
  }
  return classNames;
};

export default classNames;
