<template>
  <div class="editor-container">
    <div class="editor-title">
      <h3>Script</h3>
      <input
        id="compiled-script"
        v-model="compiled"
        type="checkbox"
      >
      <label for="compiled-script">Compiled Code</label>
    </div>
    <MonacoEditor
      v-if="!compiled"
      key="original"
      v-model="code"
      class="editor"
      language="javascript"
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
import * as Babel from '@babel/standalone';

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
        const result = Babel.transform(this.compiledCode, { presets: ['es2015'] }).code;
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
};
</script>

<style>

</style>
