<template>
  <div class="playground">
    <div class="editor">
      <EditorTemplate
        class="editor-item"
        @change-compiled="compiledTemplate = $event"
      />
      <EditorScript
        class="editor-item"
        @change-compiled="compiledScript = $event"
      />
      <EditorStyle
        class="editor-item"
        @change-compiled="compiledStyle = $event"
      />
    </div>
    <PreviewComponent
      :compiled-template="compiledTemplate"
      :compiled-script="compiledScript"
      :compiled-style="compiledStyle"
    />
  </div>
</template>

<script>
import EditorTemplate from './EditorTemplate.vue';
import EditorScript from './EditorScript.vue';
import EditorStyle from './EditorStyle.vue';
import PreviewComponent from './PreviewComponent.vue';

export default {
  components: {
    EditorTemplate,
    EditorScript,
    EditorStyle,
    PreviewComponent,
  },
  data() {
    return {
      compiledTemplate: 'var __render__ = function () {};\nvar __staticRenderFns__ = [];\n',
      compiledScript: 'var __componentOptions__ = {};',
      compiledStyle: 'var __compiledStyle__ = ``;',
    };
  },
};
</script>

<style scoped>
.playground {
  display: flex;
  height: 100%;
}

.editor {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.editor-item {
  flex: 1;
}
</style>
