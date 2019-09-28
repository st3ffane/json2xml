const ESCAPE_XML_CHAR = {
  '"': "&quot;",
  "&": "&amp;",
  "'": "&apos;",
  "<": "&lt;",
  ">": "&gt;"
};
function escapeXMLReplaceChar(match) {
  return ESCAPE_XML_CHAR[match];
}
export function escapeXMLText(text) {
  return ("" + (text || "")).replace(/&|<|>|"|'/g, escapeXMLReplaceChar);
}
