## Development Notes

* Cordova loads app like "file://www/index.html" so can't use "/assets" or "//domain.com" style relative paths. In website mode even though the current url might be `goodcity.hk/offers/1/items` ember adds a `<base href'/'>` tag so urls in templates are still relative from the root (in cordova mode config.locationType is set to hash i.e. `goodcity.hk/#/offers/1/items` and no base tag is added).

* CustomAsynchelper for MockAjax call is mockApi, example to show how to use it:
  ```js
    mockApi('get', '/route_name', {json:data})
  ```
  Example on how to use it with FactoryGuy
  ```js
    mockApi('get',
              '/territories',
              {territories: FactoryGuy.buildList('territory_with_many_districts', 3)});
  ```

* To keep whitespace settings consistent in source code we're using .editorconfig which can be installed in your favourite editor via http://editorconfig.org/#download

* Shared brocfile imports can be found in ```shared.goodcity/index.js```

* Build error with pickadate.js 3.5.6 - https://github.com/amsul/pickadate.js/issues/685
