<template>
  <div class="editor-container">
    <div class="editor-title">
      <h3>Template</h3>
      <input
        id="compiled-template"
        v-model="compiled"
        type="checkbox"
      >
      <label for="compiled-template">Compiled Code</label>
    </div>
    <MonacoEditor
      v-if="!compiled"
      key="original"
      v-model="code"
      class="editor"
      language="html"
    />
    <MonacoEditor
      v-else
      key="compiled"
      :value="compiledPreview"
      class="editor"
      :options="{readOnly: true}"
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

export default {
  components: {
    MonacoEditor,
  },
  data() {
    return {
      compiled: false,
      code: '<div><h3 class="dojo-title">hello {{title}}</h3></div>',
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

      const code = VueTemplateES2015Compiler(
        `var __render__ = function () {${render}};`
        + `var __staticRenderFns__ = [${staticRenderFns.map(fn => `function () {${fn}}`)}];`,
      );
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
};
</script>

<style>

.editor {
  width: 600px;
  height: 100%;
}

.editor-container{
  display: flex;
  flex-direction: column;
}
</style>
