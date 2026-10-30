# Blueprint: platform25

Catalog blueprint: Static site (static-site)

## Idea
A 2.5D web platformer game. All 3D assets are produced by headless Blender Python scripts written by the factory stations and exported as glb. The game itself is Vite plus Three.js in the browser.

## Stack
- HTML, CSS and vanilla JavaScript
- Cloudflare Pages

## Structure
- public/ with the site files
- no build step until a spec needs one
- .openspec/specs/ with one spec per section or feature
- brain/ seeded from the idea brief

## First specs
- site-shell

## Notes
Default for sites and landing pages. Keep it build free as long as possible.

Pipeline: greenfield. Next station after intake is blueprint review of this file, then spec-writer.
