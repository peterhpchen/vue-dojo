<template>
  <div class="vdj-playground">
    <SplitPane
      :default-percent="50"
      split="vertical"
    >
      <template slot="paneL">
        <SplitPane
          :default-percent="33"
          split="horizontal"
        >
          <template slot="paneL">
            <EditorTemplate
              class="vdj-editor"
              @change-compiled="compiledTemplate = $event"
            />
          </template>
          <template slot="paneR">
            <SplitPane
              :default-percent="50"
              split="horizontal"
            >
              <template slot="paneL">
                <EditorScript
                  class="vdj-editor"
                  @change-compiled="compiledScript = $event"
                />
              </template>
              <template slot="paneR">
                <EditorStyle
                  class="vdj-editor"
                  @change-compiled="compiledStyle = $event"
                />
              </template>
            </SplitPane>
          </template>
        </SplitPane>
      </template>
      <template slot="paneR">
        <PreviewComponent
          class="vdj-editor"
          :compiled-template="compiledTemplate"
          :compiled-script="compiledScript"
          :compiled-style="compiledStyle"
        />
      </template>
    </SplitPane>
  </div>
</template>

<script>
import SplitPane from 'vue-splitpane';
import EditorTemplate from './EditorTemplate.vue';
import EditorScript from './EditorScript.vue';
import EditorStyle from './EditorStyle.vue';
import PreviewComponent from './PreviewComponent.vue';

export default {
  components: {
    SplitPane,
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
.vdj-playground {
  height: 100%;
}

.vdj-editor {
  height: 100%;
}
</style>
