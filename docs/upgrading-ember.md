## Upgrading Ember CLI

Follow these steps to update the project version of ember-cli. If someone else has done the upgrade and you're just refreshing code ignore the SKIP lines.

```shell
npm r -g ember-cli
npm cache clean
bower cache clean
rm -rf node_modules bower_components dist tmp
npm i -g ember-cli
npm i --save-dev ember-cli # (SKIP if someone else has updated ember-cli already)
npm link shared-goodcity
ember init # (SKIP if someone else has updated ember-cli already)
npm i
bower i
```
