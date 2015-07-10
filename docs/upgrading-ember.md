## Upgrading Ember CLI

Follow these steps to update the project version of ember-cli. If someone else has done the upgrade and you're just refreshing code ignore the SKIP lines.

```shell
npm uninstall -g ember-cli
npm cache clean
bower cache clean
rm -rf node_modules bower_components dist tmp
npm install -g ember-cli
npm install --save-dev ember-cli # (SKIP if someone else has updated ember-cli already)
npm link shared-goodcity
ember init # (SKIP if someone else has updated ember-cli already)
ember install
```
