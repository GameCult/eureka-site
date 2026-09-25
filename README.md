# eureka-site

The landing page for [Eureka](https://github.com/GameCult/Eureka), GameCult's
workflow where the agent that writes the code does not get to certify that it
works.

It is a scroll-driven flight through a PlayStation 1 world. You start in a hall
where a cracked monument reads ALL TESTS PASSING. From there you drop down a
shaft into Eureka's organ chamber, pass through a lattice being probed by Soul
and a gallery of real defects that green suites missed, see the archive where
the rules keep their evidence, and reach Epiphany's chamber. Then you climb back
up to find the monument split open. GameCult's aperture hangs behind the fog the
whole way.

Live preview: https://yggdrasil.gamecult.org/eureka/ (stopgap). Intended home:
`eureka.gamecult.org`.

## How it works

The page is plain HTML: the text is readable without JavaScript and without
motion. On top of that, one timeline owns everything. Scroll position becomes a
path parameter `u`, and `u` drives the camera, the organs, the staccato lines,
Soul's probes, the framing shift away from each text panel, and the aperture's
iris.

| File | Owns |
| --- | --- |
| `prototype/index.html` | The copy. Each `<section data-stop>` pins one camera stop. |
| `prototype/world.js` | The scene and `ROUTE`: stops, in page order, plus unnamed points that shape the flight between them. |
| `prototype/organs.js` | PS1 demakes of Epiphany's organs, after Aquarium's [visual language](https://github.com/GameCult/Aquarium/blob/main/docs/epiphany-agent-sdf-visual-language.md). |
| `prototype/ps1.js` | The one PS1 material and the framebuffer: vertex snapping to a 240-line grid, affine texturing, per-vertex lighting, and 15-bit colour with the console's 4x4 dither. |
| `prototype/main.js` | The scroll timeline, sizing, and the frame loop. |
| `prototype/vendor/` | three.js 0.186.1 module build (MIT, licence alongside). |

The sections and the route stops must agree one to one, in order. The page
checks this on load and logs `[eureka] page sections and route stops disagree`
if they don't.

Everything is drawn in code: textures come from `<canvas>` at load, and there
are no model files. Colours follow the GameCult brand. The organs keep their
Aquarium palettes, and the mascot's greens are the other exception; the brand
defines neither.

## Run it

Serve `prototype/` over HTTP, because ES modules don't load from `file://`:

```bash
python -m http.server 8765 --directory prototype
```

Add `?debug` for the camera and timeline readout. Add `?wp=N` to jump to stop
`N`, which is useful for headless captures.

The Claude desktop app's in-app browser cannot capture this page once it is
scrolled. Check it in a normal browser, or with headless Chrome driven by
puppeteer.

## Deploy

The runbook in `gamecult-ops` owns the Yggdrasil deploy:
`runbooks/eureka-prototype-yggdrasil.md`.

## Notes

- `BRIEF.md` is the handoff from the agent running Eureka, followed by the
  operator's dated rulings. Where they disagree, the rulings win.
- `gpt6-copy.md` is the long-form copy draft the page's text was cut from.
- Page copy is still a draft.
