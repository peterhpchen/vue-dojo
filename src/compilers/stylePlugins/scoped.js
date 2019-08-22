const postcss = require('postcss');
const selectorParser = require('postcss-selector-parser');

export default postcss.plugin('add-id', opts => function addId(root) {
  const keyframes = Object.create(null);
  const id = opts;
  root.each(function rewriteSelector(node) {
    if (!node.selector) {
      // handle media queries
      if (node.type === 'atrule') {
        if (node.name === 'media') {
          node.each(rewriteSelector);
        } else if (/-?keyframes$/.test(node.name)) {
          // register keyframes
          keyframes[node.params] = node.params = `${node.params}-${id}`; // eslint-disable-line
        }
      }
      return;
    }
    node.selector = selectorParser((selectors) => { // eslint-disable-line
      selectors.each((selector) => {
        let node = null; // eslint-disable-line
        // find the last child node to insert attribute selector
        selector.each((n) => { // eslint-disable-line
          // ">>>" combinator
          // and /deep/ alias for >>>, since >>> doesn't work in SASS
          if (
            n.type === 'combinator'
            && (n.value === '>>>' || n.value === '/deep/')
          ) {
            n.value = ' '; // eslint-disable-line
            n.spaces.before = n.spaces.after = ''; // eslint-disable-line
            return false;
          }

          // in newer versions of sass, /deep/ support is also dropped, so add a ::v-deep alias
          if (n.type === 'pseudo' && n.value === '::v-deep') {
            n.value = n.spaces.before = n.spaces.after = ''; // eslint-disable-line
            return false;
          }

          if (n.type !== 'pseudo' && n.type !== 'combinator') {
            node = n;
          }
        });

        if (node) {
          node.spaces.after = '';
        } else {
          // For deep selectors & standalone pseudo selectors,
          // the attribute selectors are prepended rather than appended.
          // So all leading spaces must be eliminated to avoid problems.
          selector.first.spaces.before = ''; // eslint-disable-line
        }

        selector.insertAfter(
          node,
          selectorParser.attribute({
            attribute: id,
          }),
        );
      });
    }).processSync(node.selector);
  });

  // If keyframes are found in this <style>, find and rewrite animation names
  // in declarations.
  // Caveat: this only works for keyframes and animation rules in the same
  // <style> element.
  if (Object.keys(keyframes).length) {
    root.walkDecls((decl) => {
      // individual animation-name declaration
      if (/^(-\w+-)?animation-name$/.test(decl.prop)) {
        decl.value = decl.value // eslint-disable-line
          .split(',')
          .map(v => keyframes[v.trim()] || v.trim())
          .join(',');
      }
      // shorthand
      if (/^(-\w+-)?animation$/.test(decl.prop)) {
        decl.value = decl.value // eslint-disable-line
          .split(',')
          .map((v) => {
            const vals = v.trim().split(/\s+/);
            const i = vals.findIndex(val => keyframes[val]);
            if (i !== -1) {
              vals.splice(i, 1, keyframes[vals[i]]);
              return vals.join(' ');
            }
            return v;
          })
          .join(',');
      }
    });
  }
});
