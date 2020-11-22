## Smoke Tests

First, install dependencies with `yarn`

Command commands have been aliased in package.json#scripts:

### Running Tests

```bash
yarn test
```

### Verbose Output (including stdio)

```bash
yarn test:verbose
```

### Debugging Tests

place a `debugger;` where you want to pause

run:
```bash
yarn test:debug
```

open `about://inspect` in chrome.

NOTE: execution is paused immediately before running anything. You'll need to resume execution before you get to your `debugger;`
