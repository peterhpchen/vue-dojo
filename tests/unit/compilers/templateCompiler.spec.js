import templateCompiler from '@/compilers/templateCompiler';

describe('templateCompiler.js', () => {
  it.only('should get correct code', () => {
    const templateCode = `
      <div>{{name}}</div>
    `;

    const result = templateCompiler(templateCode);

    expect(result.errors.length).toBe(0);
    expect(result.code).toMatch('var render = function');
    expect(result.code).toMatch('var staticRenderFns = [');
    expect(result.code).toMatch('render._withStripped = true;');
  });
});
