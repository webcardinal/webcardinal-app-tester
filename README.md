## Description

Application playground and testing area for WebCardinal contributors.

## Make it work

### Install components of your Application

```
npm install
```

### Generate the distribution

```bash
# production ready distribution
npm run build

# development usage
# npm run dev 
```

Active distribution can be found in __`webcardinal`__ directory.

The default bundle brought from [webcardinal-bundler](https://github.com/webcardinal/webcardinal-bundler) is __all__.

This distribution is used by:
- [webcardinal-app-tester](https://github.com/webcardinal/webcardinal-app-tester)
- testing environments from [webcardinal-tests](https://github.com/webcardinal/webcardinal-tests)

### Run local server

```
npm run server
```

### Run tests

```
npm run test
```

<br>

---

#### Advanced options for development build

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
          "webcardinal-core",
          <ANY_WEBCARDINAL_COMPONENT>
        ]
      }
    }
  ]
}
  
```