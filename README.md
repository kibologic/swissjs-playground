# SwissJS Playground

Interactive browser-based playground for [SwissJS](https://swissjs.org).

**Live:** [play.swissjs.org](https://play.swissjs.org) *(coming soon)*

## Features

- Live code editor with syntax-aware textarea
- Example selector (Counter, Todo, Fetch, Form, Signals)
- Shareable URLs — share your snippet via base64-encoded query param
- Preview pane that shows the component output

## Development

```sh
pnpm install
pnpm dev
# → http://localhost:5100
```

## Architecture

The playground is itself a SwissJS application:

```
app/
├── components/
│   ├── Topbar.uix         # Nav bar, example selector, share button
│   ├── EditorPane.uix     # Code editor textarea
│   └── PreviewPane.uix    # iframe preview pane
├── pages/
│   └── PlaygroundPage.uix # Root page — splits layout, holds state
├── public/
│   └── index.html
└── main.ui                # Entry point
```

## Roadmap

- v0.1: Editor + example selector + shareable URLs (current)
- v0.2: Real Swite browser build — compile and run .uix code in the iframe
- v0.3: Monaco editor with SwissJS syntax highlighting
- v0.4: Multi-file support (file tree)

## Related

- [SwissJS Framework](https://github.com/kibologic/swiss-lib)
- [Examples](https://github.com/kibologic/examples)
- [Swite Build Tool](https://github.com/kibologic/swite)
