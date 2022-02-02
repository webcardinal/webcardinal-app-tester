## Description

Application playground and testing area for WebCardinal contributors.

## Make it work

1. #### Install components of your Application

    ```
    npm install
    ```

2. #### Run local server

    ```
    npm run server
    ```

---

### Use a custom distribution

1. #### Bring the latest WebCardinal *bundle-all*
    ```bash
    npm run local
    ```

2. #### Generate the distribution
    ```bash
    # production ready distribution
    npm run build
    
    # development usage
    # npm run dev 
    ```

Active distribution can be found in __`webcardinal`__ directory.

The default bundle brought from [webcardinal-bundler](https://github.com/webcardinal/webcardinal-bundler) is __all__.

---

### Run tests

```
npm test
```

<br>

In order to create your automatic test for WebCardinal check also commands: `create-test` and `commit-test` from `octopus.json`.

---

### Advanced options, tips&tricks

For a quicker build of WebCardinal, scoping the components that will be build is possible width `devComponents`.
```json
{
  "name": "build-webcardinal-components",
  "actions": [
    {
      "type": "buildWebCardinalComponents",
      "src": "./.dev/webcardinal/.webcardinal",
      "target": "./webcardinal",
      "options": {
        "DEV": true,
        "devComponents": [
          "webcardinal-core"
          // <ANY_WEBCARDINAL_COMPONENT>
        ]
      }
    }
  ]
}
```

<br>

Check also webcardinal-bundler wiki:

For freezing or (releasing) check "[How to freeze all bundlers](https://github.com/webcardinal/webcardinal-bundler/wiki/How-to-freeze-all-bundlers)".

For codding style check the "[WebCardinal coding style in your IDE](https://github.com/webcardinal/webcardinal-bundler/wiki/Coding-style-in-your-IDE)".

