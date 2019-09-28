import { camelCaseName } from "../src/naming.format";
import { escape } from "../src/escape";
import singular from "./singular";
/**
 * Parse an xml string to a json object
 * @param {string} xml the xml to parse
 * @param {object} registry a mapping between namespace:type for
 * object prototypes
 */

function xmlToJson(xml, registry = {}, parent) {
  // Create the return object
  var obj = {};
  const nodename = camelCaseName(xml.nodeName);
  if (xml.nodeType == 1) {
    // element
    // if child node is a string, need to pass it to constructor

    const ns = xml.attributes
      ? xml.attributes["namespace"] || { nodeValue: "" }
      : { nodeValue: "" };

    let value = undefined;
    let proto = registry[ns.nodeValue + ":" + nodename] || registry[nodename];

    if (
      xml.hasChildNodes() &&
      xml.childNodes.length === 1 &&
      xml.childNodes.item(0).nodeType === 3
    ) {
      // only string in this node, create an Object
      value = xml.childNodes.item(0).nodeValue;
      // by default, if no type is defined, it will be a String
      if (!proto) proto = String;
    }
    obj = new (proto || Object)(value);

    // check custom attributes
    if (xml.attributes.length > 0) {
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j);
        obj[camelCaseName(attribute.nodeName)] = attribute.nodeValue;
      }
    }
  }

  // do childrens
  if (xml.hasChildNodes()) {
    // if children name is node singular, we change node prototype
    // to an array
    let single = singular(nodename);
    for (var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i);
      if (item.nodeType === 3) continue;
      var nodeName = camelCaseName(item.nodeName);

      // if is node singular, create an array
      if (nodeName === single) {
        if (obj.push === undefined) {
          Object.setPrototypeOf(obj, new Array());
        }
        obj.push(xmlToJson(item, registry, obj));
      } else if (typeof obj[nodeName] == "undefined") {
        // if unknown, create a new property
        obj[nodeName] = xmlToJson(item, registry, obj);
      } else {
        // property is already known, transform simple object property
        // to an array
        if (typeof obj[nodeName].push == "undefined") {
          // change to array, but do not loose custom attributes
          var old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item, registry, obj));
      }
    }
  }
  return obj;
}

export default xmlToJson;
