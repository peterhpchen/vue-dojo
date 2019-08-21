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
      <input
        id="cssModule"
        v-model="cssModule"
        type="checkbox"
      >
      <label for="cssModule">CSS Module</label>
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

import postcss from 'postcss';
import postcssModules from 'postcss-modules';

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
      cssModule: false,
      code: '.dojo-title { color: #1982c4; }',
      compiledCode: '',
      moduleJson: '',
    };
  },
  computed: {
    compiledPreview() {
      try {
        let code = Prettier.format(this.compiledCode, {
          parser: 'css',
          plugins: [ParserPostcss],
        });

        code = `var __compiledStyle__ = \`${code ? `\n${code}` : ''}\`;`;
        if (this.cssModule) {
          code += `\nvar __injectStyles__ = function () { this.$style = ${this.moduleJson}; }`;
        }

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
    cssModule: {
      handler() {
        this.compileStyle();
      },
      immediate: true,
    },
    compiledPreview: {
      handler(val) {
        this.compileStyle();
        this.$emit('change-compiled', val);
      },
      immediate: true,
    },
  },
  methods: {
    compileStyle() {
      if (!this.cssModule) {
        this.compiledCode = this.code;
        return;
      }

      const postcssPlugins = [];
      postcssPlugins.push(postcssModules({
        camelCase: true,
        getJSON: (_cssFileName, json) => {
          const camelCaseJson = Object.keys(json)
            .filter(key => key.indexOf('-') <= 0)
            .reduce(
              (result, currentKey) => Object.assign(result, { [currentKey]: json[currentKey] }),
              {},
            );
          this.moduleJson = JSON.stringify(camelCaseJson);
        },
      }));

      postcss(postcssPlugins).process(this.code).then((postcssResult) => {
        this.compiledCode = postcssResult.css;
      });
    },
  },
};
</script>

<style>

</style>
