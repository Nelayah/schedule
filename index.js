const req = require.context('./src', true, /^\.\/[^_][\w-]+\/style\/index\.tsx?$/);

req.keys().forEach(mod => {
  let v = req(mod);
  if (v && v.default) v = v.default;
  const match = mod.match(/^\.\/([^_][\w-]+)\/index\.tsx?$/);
  exports[camelCase(match[1])] = v;
});