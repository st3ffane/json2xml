const REMOVE_DECIMAL_FIRST = /^\d+/;
const UNCAMEL_FIRST = /^[A-Z]/;
const UNCAMEL = /[A-Z]/g;
const CAMEL = /-[a-z]/g;
// will rename camelCase vars to css style var
// ex: MyVarName => my-var-name
export const unCamelCaseName = name => {
  return (name || "")
    .replace(REMOVE_DECIMAL_FIRST, "") // for array and strings
    .replace(UNCAMEL_FIRST, l => l.toLowerCase()) // first one without -
    .replace(UNCAMEL, l => "-" + l.toLowerCase());
};
// exact opposite of precedent
export const camelCaseName = name => {
  return (name || "").replace(CAMEL, l => l[1].toUpperCase());
};
