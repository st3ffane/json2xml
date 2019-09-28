// dummy singular name for a node
// ie: cats -> cat
//     properties -> property
const RULES = /(ies|s|aux)$/; // I'm sure there will be plenty of other rules...
const SINGULAR = {
  ies: "y",
  s: "",
  aux: "au"
};
export default plural => plural.replace(RULES, r => SINGULAR[r]);
