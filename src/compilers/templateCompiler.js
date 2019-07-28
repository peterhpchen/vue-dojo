import { compile } from 'vue-template-compiler';
import transpile from 'vue-template-es2015-compiler';

export default (source, options = {}) => {
  const {
    render, staticRenderFns, errors, tips,
  } = compile(source, options);

  let code = transpile(`
    var render = function() {${render}};\nvar staticRenderFns = [${staticRenderFns}]
  `);

  code += 'render._withStripped = true;';

  return {
    code,
    errors,
    tips,
  };
};
