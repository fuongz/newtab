import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['dist', 'node_modules', 'public'],
  rules: {
    'antfu/if-newline': 'off',
    'vue/singleline-html-element-content-newline': 'off',
  },
})
