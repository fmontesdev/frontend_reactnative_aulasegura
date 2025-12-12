module.exports = function(api) {
  api.cache(true);
  return {
    // Incluye las transformaciones necesarias para proyectos Expo
    presets: ['babel-preset-expo'],
  };
};
