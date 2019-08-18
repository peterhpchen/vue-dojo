<template>
  <div class="editor-container">
    <div class="editor-title">
      <h3>Style</h3>
      <input
        id="compiled"
        v-model="compiled"
        type="checkbox"
      >
      <label for="compiled">Compiled Code</label>
    </div>
    <MonacoEditor
      v-if="!compiled"
      key="original"
      v-model="code"
      class="editor"
      language="css"
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
import Prettier from 'prettier/standalone';
import ParserPostcss from 'prettier/parser-postcss';
import ParserBabylon from 'prettier/parser-babylon';

export default {
  components: {
    MonacoEditor,
  },
  data() {
    return {
      compiled: false,
      code: '.dojo-title { color: #1982c4; }',
    };
  },
  computed: {
    compiledCode() {
      return this.code;
    },
    compiledPreview() {
      try {
        let code = Prettier.format(this.compiledCode, {
          parser: 'css',
          plugins: [ParserPostcss],
        });

        code = `var __compiledStyle__ = \`${code ? `\n${code}` : ''}\`;`;

        const result = Prettier.format(code, {
          singleQuote: true,
          parser: 'babel',
          plugins: [ParserBabylon],
        });

        return result;
      } catch {
        return 'var __compiledStyle__ = \'\';';
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
};
</script>

<style>

</style>
