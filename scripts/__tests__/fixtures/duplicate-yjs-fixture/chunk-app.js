// Simulated application chunk referencing Yjs
const Y = { Doc: function () {} };
function init() {
  const d = new Y.Doc();
  return d;
}
module.exports = { init };
