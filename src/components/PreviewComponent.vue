<template>
  <div>
    <h3>Preview</h3>
    <input
      id="source"
      v-model="source"
      type="checkbox"
    >
    <label for="source">Source Code</label>
    <div
      v-show="!source"
      class="preview-container"
    >
      <component
        :is="componentOptions"
        v-if="componentOptions.render"
      />
    </div>
    <MonacoEditor
      v-if="source"
      :value="compiledCode"
      class="editor"
      language="javascript"
    />
  </div>
</template>

<script>
import MonacoEditor from 'vue-monaco';
import Prettier from 'prettier/standalone';
import ParserBabylon from 'prettier/parser-babylon';

export default {
  components: {
    MonacoEditor,
  },
  props: {
    compiledTemplate: {
      type: String,
      default: 'var __render__ = function () {};\nvar __staticRenderFns__ = [];\n',
    },
    compiledScript: {
      type: String,
      default: 'var __componentOptions__ = {};',
    },
    compiledStyle: {
      type: String,
      default: 'var __compiledStyle__ = ``;',
    },
  },
  data() {
    return {
      source: false,
      styleEl: null,
      componentOptions: {},
    };
  },
  computed: {
    compiledCode() {
      const code = `
${this.compiledTemplate}
${this.compiledScript}\n
${this.compiledStyle}

// render functions
if (typeof __render__ !== 'undefined' && __render__) {
  __componentOptions__.render = __render__;
  __componentOptions__.staticRenderFns = __staticRenderFns__;
  __componentOptions__._compiled = true;
}

// functional template
if (typeof __functionalTemplate__ !== 'undefined' && __functionalTemplate__) {
  __componentOptions__.functional = true;
}

// css module
if (typeof __injectStyles__ !== 'undefined' && __injectStyles__) {
  if (__componentOptions__.functional) {
    var originalRender = __componentOptions__.render;
    __componentOptions__.render = function renderWithStyleInjection (h, context) {
      debugger;
      __injectStyles__.call(context)
      return originalRender(h, context)
    }
  } else {
    var existing = __componentOptions__.beforeCreate;
    __componentOptions__.beforeCreate = existing
      ? [].concat(existing, __injectStyles__)
      : [__injectStyles__]
  }
}

// scoped css
if (typeof __scopedId__ !== 'undefined' && __scopedId__) {
  __componentOptions__._scopeId = __scopedId__;
}

return {
  options: __componentOptions__,
  style: __compiledStyle__,
};
      `;


      const result = Prettier.format(code, {
        singleQuote: true,
        parser: 'babel',
        plugins: [ParserBabylon],
      });

      return result;
    },
  },
  mounted() {
    this.$watch(
      vm => [vm.compiledTemplate, vm.compiledScript, vm.compiledStyle].join(),
      this.renderCode,
      { immediate: true },
    );
  },
  methods: {
    renderCode() {
      if (this.styleEl) {
        document.head.removeChild(this.styleEl);
        this.styleEl = null;
      }

      const normalizer = new Function(this.compiledCode); // eslint-disable-line

      const { options, style } = normalizer();

      this.componentOptions = options;

      // Add style to head
      this.styleEl = document.createElement('style');
      this.styleEl.textContent = style;
      document.head.appendChild(this.styleEl);
    },
  },
};
</script>

<style>

</style>
