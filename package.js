/* globals Package */

Package.describe({
  name: 'hacknlove:semantic-form',
  version: '0.0.5',
  summary: 'validate and use semantic-forms',
  git: 'https://github.com/hacknlove/semantic-form',
  documentation: 'README.md'
})

Package.onUse(function (api) {
  api.versionsFrom('1.4')
  api.use('ecmascript')
  api.use('templating', 'client')
  api.use('semantic:ui@2.0.0', 'client')
  api.use('hacknlove:semantic-input-image@0.0.2', 'client', {weak: true})
  api.addFiles('semantic-form.html', 'client')
  api.addFiles('semantic-form.js', 'client')
})
