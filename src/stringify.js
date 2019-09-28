import { escapeXMLText } from "./escape";
import singular from "./singular";
import * as format from "./naming.format";
const START = "<";
const EMPTY = "/>";
const PRIMITIVES = ["String", "Boolean", "Number", "Bigint"];
const UNVALID_ARRAY_PROPS = /^\d+|length$/;
const stringifyObject = (obj, opts, nName) => {
  // for each properties
  let tmp = []; // buffer to store strings
  let inners = []; // pour les inners nodes
  let { preserveEmptyOrNull } = opts;
  const nodeName = format.unCamelCaseName(nName || obj.constructor.name);
  let isPrimitive = PRIMITIVES.indexOf(obj.constructor.name) > -1;
  tmp.push(START + nodeName);
  for (let [key, value] of Object.entries(obj)) {
    // foreach properties, need to check inner type (array, object...)
    if (
      !preserveEmptyOrNull &&
      (value === undefined || value === null || value === "")
    )
      continue;

    let node = format.unCamelCaseName(key);

    if (!node) continue;
    // type of props
    if (Array.isArray(value)) {
      // an array: add outer node
      // if custom array, we must had properties...
      inners.push(stringify(value, opts, node));
    } else if (value && typeof value === "object") {
      // object property
      inners.push(stringifyObject(value, opts, node));
      // is it a primitive-like object -ie Boolean, Integer, ....?
    } else {
      // simple property
      tmp.push(` ${node}="${escapeXMLText(value)}"`);
    }
  }
  if (isPrimitive) inners.push(obj); // push object value
  // end of node
  if (inners.length > 0) {
    tmp.push(">"); // close node
    tmp.push(...inners);
    tmp.push(`</${nodeName}>`);
  } else {
    // empty node
    tmp.push(EMPTY);
  }
  return tmp.join("");
};

const ZERO = "0".charCodeAt(0);
const NINE = "9".charCodeAt(0);
/**
 * Stringify a js object to an xml string
 *
 * @param {any} obj Object to stringify as xml
 * @param {object} opts parser options as:
 *  preserveNullOrEmptyValue: if true, undefined, null and empty string
 *  will render as empty node properties
 * @param {string} nName if defined, the name used for the node, will
 *  fallback to the class name or 'object'
 * @return {string} xmilified object
 */
export const stringify = (
  obj,
  opts = {
    preserveEmptyOrNull: false
  },
  outerName
) => {
  if (!obj) return "";
  if (Array.isArray(obj)) {
    // outer element
    let node = format.unCamelCaseName(outerName || "array");
    let single = singular(node);
    // do array got custom properties???
    // let props = Object.keys(obj).filter(p => !UNVALID_ARRAY_PROPS.test(p));
    let props = [];
    let childs = [];
    Object.entries(obj).map(([k, v]) => {
      // if index, add a child item
      const c = k.charCodeAt(0);
      if (c >= ZERO && c <= NINE) childs.push(stringify(v, opts, single));
      else if (k !== "length")
        props.push(` ${format.unCamelCaseName(k)}="${escapeXMLText(v || "")}"`);
    });

    return [`<${node}`, ...props, ">", ...childs, `</${node}>`].join("");
  } else if (typeof obj === "object") {
    // for each properties
    return stringifyObject(obj, opts, outerName);
  } else {
    // not array nor object (maybe a primitive?)
    // return parsed value
    if (outerName)
      return `<${outerName}>${escapeXMLText("" + obj)}</${outerName}>`;
    return escapeXMLText("" + obj);
  }
};
export default stringify;
