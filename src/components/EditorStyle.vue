<template>
  <div class="editor-container">
    <div class="editor-title">
      <h3>Style</h3>
      <input
        id="compiled-style"
        v-model="compiled"
        type="checkbox"
      >
      <label for="compiled-style">Compiled Code</label>
      <div class="cssType">
        <input
          id="normal"
          v-model="cssType"
          value="normal"
          type="radio"
        >
        <label for="normal">normal</label>
        <input
          id="cssModule"
          v-model="cssType"
          value="cssModule"
          type="radio"
        >
        <label for="cssModule">CSS Module</label>
        <input
          id="scopedCss"
          v-model="cssType"
          value="scopedCss"
          type="radio"
        >
        <label for="scopedCss">Scoped CSS</label>
      </div>
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

import hash from 'hash-sum';


import scopedPlugins from '@/compilers/stylePlugins/scoped';


export default {
  components: {
    MonacoEditor,
  },
  data() {
    return {
      compiled: false,
      code: '.dojo-title { color: #1982c4; }',
      compiledCode: '',
      moduleJson: '',
      cssType: 'normal',
      scopedId: `data-v-${hash('vue-dojo')}`,
    };
  },
  computed: {
    cssModule() {
      return this.cssType === 'cssModule';
    },
    scopedCss() {
      return this.cssType === 'scopedCss';
    },
    normal() {
      return this.cssType === 'normal';
    },
    compiledPreview() {
      try {
        let code = Prettier.format(this.compiledCode, {
          parser: 'css',
          plugins: [ParserPostcss],
        });

        code = `var __compiledStyle__ = \`${code ? `\n${code}` : ''}\`;`;
        if (this.cssModule) {
          code += `\nvar __injectStyles__ = function (context) { this.$style = ${this.moduleJson}; }`;
        }
        if (this.scopedCss) {
          code += `\nvar __scopedId__ = '${this.scopedId}'`;
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
      if (this.normal) {
        this.compiledCode = this.code;
        return;
      }

      const postcssPlugins = [];

      if (this.cssModule) {
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
        return;
      }

      if (this.scopedCss) {
        postcssPlugins.push(scopedPlugins(this.scopedId));
        this.compiledCode = postcss(postcssPlugins).process(this.code).css;
      }
    },
  },
};
</script>

<style>

</style>
