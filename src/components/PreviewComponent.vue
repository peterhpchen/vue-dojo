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
    />
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
import Vue from 'vue';

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
      codeVM: null,
      styleEl: null,
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

// css module
if (typeof __injectStyles__ !== 'undefined' && __injectStyles__) {
  var existing = __componentOptions__.beforeCreate;
  __componentOptions__.beforeCreate = existing
    ? [].concat(existing, __injectStyles__)
    : [__injectStyles__]
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
      const previewContainer = this.$el.getElementsByClassName('preview-container')[0];

      // Remove previous render element
      if (this.codeVM) {
        this.codeVM.$destroy();
        previewContainer.removeChild(previewContainer.firstChild);
        this.codeVM = null;

        if (this.styleEl) {
          document.head.removeChild(this.styleEl);
          this.styleEl = null;
        }
      }

      // Create render element
      const codeEl = document.createElement('div');
      previewContainer.appendChild(codeEl);

      const normalizer = new Function(this.compiledCode); // eslint-disable-line

      const { options, style } = normalizer();

      // Create Vue instance
      this.codeVM = new Vue({ ...options }).$mount(codeEl);

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
