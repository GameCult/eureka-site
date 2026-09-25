# How we built a PS1 dungeon to sell a code-review workflow

[Eureka](https://github.com/GameCult/Eureka) is a Claude Code skill built on
one rule: the agent that writes the code does not get to certify that the code
works. It needed a landing page. This repo is that page, and it turned into a
PlayStation 1 game you scroll through.

Preview: **https://yggdrasil.gamecult.org/eureka/** until it moves to
`eureka.gamecult.org`.

## Two briefs, neither in charge

We started with two documents, and both are in this repo.

The first was [`BRIEF.md`](BRIEF.md). The agent that had been running Eureka on
a live multi-repo campaign wrote it with no guidance from us, because we wanted
the view from the ground. It is good on evidence. It lists real defects, each
caught by a pass that did not write the code, sitting behind a green suite. It
is also confident about things nobody had asked it to decide, such as which
static-site generator to use. We kept the evidence and overruled the rest. The
dated rulings at the top of the file record what was overruled.

The second was [`gpt6-copy.md`](gpt6-copy.md), a long copy draft that came out
of a longer conversation about where Eureka and GameCult are going. The page's
text is cut from it, along with its taste for short lines that land one at a
time.

## A camera on rails

The reference was [acko.net](https://acko.net/). What we took from it was
specific: the page background is a WebGL scene, and scrolling moves the camera
through it along a fixed path. Reading the page is the same as travelling
through it.

So the page is a route. Every section of text pins one camera stop, and unnamed
points in between shape the flight. It begins in a hall where a cracked monument
reads ALL TESTS PASSING, in front of a wall of green checkmarks. The next stop
looks at a floor hatch stencilled GREEN, which has been pried up. Below the
hatch, the route runs:

1. Down a shaft into Eureka's organ chamber.
2. Through a lattice where Soul's probes flip green nodes to orange.
3. Along a gallery of specimen cases, one per real defect.
4. Past an archive where the rules keep their evidence.
5. Into Epiphany's chamber.
6. Up a second shaft into the hall, where the monument has now split along its
   crack.

One number owns all of it. Scroll position becomes a path parameter `u`, and `u`
drives the camera, the organs, the probe animation, the staccato lines, and the
monument splitting at the end. There is no second clock to drift out of sync.

## Going full PlayStation

The first pass rendered at low resolution with a dither, which was tasteful and
wrong. Then we found keijiro's
[Retro3D](https://github.com/keijiro/Retro3D), a Unity shader of about 20 lines,
and went all the way to PlayStation 1. The whole effect comes down to a few
tricks, and each one ports to WebGL in a line or two:

- **Vertex snapping.** The PS1's geometry chip had no sub-pixel precision, so
  every projected vertex snaps to a 240-line pixel grid. That is where the
  wobble comes from.
- **Affine textures.** Texture coordinates are multiplied by depth in the vertex
  shader and divided back out per pixel. That cancels the GPU's perspective
  correction and gives the PS1's texture swim. Large floors are split into
  tiles, as PS1 games did, so the warp looks charming rather than broken.
- **15-bit colour** with the console's own 4×4 ordered dither, applied in a final
  full-screen pass.
- **Everything else:** lighting computed per vertex, fog to black, no mipmaps,
  nearest-neighbour filtering, and half-transparent surfaces for glass and
  Soul's crystal.

Nothing here is a model file. Every texture is drawn to a `<canvas>` at load,
and every mesh is built in code.

## The organs

Eureka's faculties come from Epiphany, the larger system it is the sister of.
[Aquarium](https://github.com/GameCult/Aquarium/blob/main/docs/epiphany-agent-sdf-visual-language.md)
already defines how each organ looks, as raymarched distance fields with PBR
materials. We demade them:

- **Self** is a black core inside gold orrery rails.
- **Soul** is a see-through verdict crystal with a white oath light, blue edges
  and a red risk seam.
- **Hands** is a dark tool with three enamel jaws and a hot cutting edge.
- **Imagination** is an opal seed wrapped in curling ribbon petals.
- **Life** is a teal nautilus shell carrying an ember and memory beads.

They sit on Aquarium's own orbit slots, so the camera's circuit around the
chamber is the Aquarium layout. The sixth seat, where Epiphany keeps her Face,
belongs to the viewer: in Eureka, the operator is a human.

Epiphany's chamber has all eight organs, Face, Eyes and Body included, each in
scaffolding. She is still growing bones.

## The thing at the far plane

GameCult's mark is a camera aperture, and we wanted it to hang behind the fog as
a megastructure. An earlier AI rendering showed the whole thing, evenly lit and
front-on, and it read as a medallion. Scale comes from what you can't see. This
aperture is a separate sky layer: it follows the camera's rotation and never
moves closer. It is tilted so you see it at an angle and held at a fixed depth
of fog. Its six blades are habitats (forest, desert, ice, falls, highlands, a
night city) around a gold hub, with stations in orbit. Underground it fades to a
faint presence. The iris opens as you read.

## Small machines that earned their place

- **Framing follows the text.** Text panels covered the subject in most shots.
  We didn't retune 26 camera angles. Each section already says which side its
  panel is on, so the camera shifts its framing toward the other side, eased
  between stops.
- **Stops are checked.** The page's sections and the route's stops must match
  one to one, in order. The page checks this on load and says so in the console
  when they don't.
- **Motion is optional.** Without JavaScript, or with reduced motion turned on,
  it is a readable page of prose. Reduced motion replaces the flight with a
  still frame per section.
- **Verification ran headless.** The in-app browser we were using could not
  capture the page once it had scrolled, even with rendering paused. Every stop
  was checked with headless Chrome driven by puppeteer instead, using the
  `?debug` readout and the `?wp=N` jump.

## Where things live

| File | Owns |
| --- | --- |
| `prototype/index.html` | The copy. Each `<section data-stop>` pins a camera stop. |
| `prototype/world.js` | The scene, the aperture, and `ROUTE`. |
| `prototype/organs.js` | The organ demakes and Epiphany's scaffolding. |
| `prototype/ps1.js` | The PS1 material, the framebuffer and dither, and geometry helpers. |
| `prototype/main.js` | The scroll timeline and the frame loop. |
| `prototype/vendor/` | three.js 0.186.1 (MIT). |

Run it locally by serving `prototype/` over HTTP, since ES modules won't load
from `file://`:

```bash
python -m http.server 8765 --directory prototype
```

The Yggdrasil deploy is documented in `gamecult-ops`, in
`runbooks/eureka-prototype-yggdrasil.md`. The copy is still a draft.
