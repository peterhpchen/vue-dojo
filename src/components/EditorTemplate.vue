<template>
  <div class="vdj-editor">
    <div class="vdj-editor__func-bar">
      <span>Template</span>
      <input
        id="compiled-template"
        v-model="compiled"
        type="checkbox"
      >
      <label for="compiled-template">Compiled Code</label>
      <input
        id="functional"
        v-model="functional"
        type="checkbox"
      >
      <label for="functional">Functional</label>
      <button @click="tidy">
        Tidy
      </button>
    </div>
    <MonacoEditor
      v-if="!compiled"
      key="original"
      v-model="code"
      class="editor"
      language="html"
      :options="{automaticLayout: true}"
    />
    <MonacoEditor
      v-else
      key="compiled"
      :value="compiledPreview"
      class="editor"
      :options="{readOnly: true, automaticLayout: true}"
      language="javascript"
    />
  </div>
</template>

<script>
import MonacoEditor from 'vue-monaco';
import * as VueTemplateCompiler from 'vue-template-compiler';
import * as VueTemplateES2015Compiler from 'vue-template-es2015-compiler';
import Prettier from 'prettier/standalone';
import ParserBabylon from 'prettier/parser-babylon';
import ParserHtml from 'prettier/parser-html';

export default {
  components: {
    MonacoEditor,
  },
  data() {
    return {
      compiled: false,
      code: '<div><h3 class="dojo-title">hello {{title}}</h3></div>',
      functional: false,
    };
  },
  computed: {
    compiledCode() {
      return VueTemplateCompiler.compile(this.code);
    },
    compiledPreview() {
      const {
        render, staticRenderFns, errors,
      } = this.compiledCode;

      if (errors && errors.length) {
        return 'var __render__ = function () {};\n'
          + 'var __staticRenderFns__ = [];\n';
      }

      let code = VueTemplateES2015Compiler(
        `var __render__ = function (${this.functional ? '_h,_vm' : ''}) {${render}};`
        + `var __staticRenderFns__ = [${staticRenderFns.map(fn => `function (${this.functional ? '_h,_vm' : ''}) {${fn}}`)}];`,
        { transforms: { stripWithFunctional: this.functional } },
      );

      if (this.functional) {
        code += 'var __functionalTemplate__ = true;';
      }

      const result = Prettier.format(code, {
        singleQuote: true,
        parser: 'babel',
        plugins: [ParserBabylon],
      });

      return result;
    },
  },
  watch: {
    compiledPreview: {
      handler(val) {
        this.$emit('change-compiled', val);
      },
      immediate: true,
    },
  },
  methods: {
    tidy() {
      this.code = Prettier.format(this.code, {
        parser: 'html',
        plugins: [ParserHtml],
      });
    },
  },
};
</script>

<style scoped>
.vdj-editor__func-bar {
  padding: 10px;
  height: 35px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}
.editor {
  height: calc(100% - 55px);
}
</style>
