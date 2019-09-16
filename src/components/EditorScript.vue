<template>
  <div class="vdj-editor">
    <div class="vdj-editor__func-bar">
      <span>Script</span>
      <input
        id="compiled-script"
        v-model="compiled"
        type="checkbox"
      >
      <label for="compiled-script">Compiled Code</label>
      <button @click="tidy">
        Tidy
      </button>
    </div>
    <MonacoEditor
      v-if="!compiled"
      key="original"
      v-model="code"
      class="editor"
      language="javascript"
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

import * as Babel from '@babel/standalone';
import vueBabelPresetJsx from '@vue/babel-preset-jsx';

import Prettier from 'prettier/standalone';
import ParserBabylon from 'prettier/parser-babylon';

export default {
  components: {
    MonacoEditor,
  },
  data() {
    return {
      compiled: false,
      code: 'export default { data () { return { title: \'vue-dojo\'};}};',
    };
  },
  computed: {
    compiledCode() {
      const code = this.code ? this.code : 'export default {};';
      const result = code.replace('export default', 'var __componentOptions__ =');
      return result;
    },
    compiledPreview() {
      try {
        Babel.registerPreset('@vue/babel-preset-jsx', vueBabelPresetJsx);
        const result = Babel.transform(this.compiledCode, {
          presets: [
            '@vue/babel-preset-jsx',
            'es2015',
          ],
        }).code;
        return result;
      } catch {
        return 'var __componentOptions__ = {};';
      }
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
        singleQuote: true,
        parser: 'babel',
        plugins: [ParserBabylon],
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
