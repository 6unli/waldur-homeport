// require all modules ending in "_test" from the
// scripts directory and all subdirectories
// eslint-disable-next-line no-undef
var testsContext = require.context('../app/scripts', true, /\.spec$/);
testsContext.keys().forEach(testsContext);
