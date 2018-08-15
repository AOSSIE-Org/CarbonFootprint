module.exports = function(api) {
  api.cache(false);
  var plugins = [];
  if (process.env.mode === "production") {
    plugins = plugins.concat([
      "transform-remove-console",
      "transform-remove-debugger"
    ]);
  }
  var presets = [["@babel/env", { modules: false }]];
  return { plugins, presets };
};
