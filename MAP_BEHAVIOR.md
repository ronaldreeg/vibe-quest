# Map behavior

Vibe Quest keeps every listing individually discoverable, including several listings at one venue or several pins that visually collide at the current zoom.

## Pin placement rules

1. A listing with no nearby collision stays on its exact public map coordinate.
2. Pins whose centers land within 28 screen pixels are treated as one visual map spot. This is recalculated after every pan and zoom.
3. Two listings spread horizontally, three form a triangle, and four form a diamond.
4. Five or more listings use a compact centered grid with 32 pixels between pin centers. The grid grows in both directions instead of becoming one long row.
5. Ordering is stable: listings happening today come first, then upcoming, then anytime listings; title and ID break ties. Pins do not randomly swap places while browsing.
6. Fan-out changes only the rendered pin position. Search, map bounds, directions, privacy, and listing data continue to use the listing's original public coordinate.
7. Hover and tap labels identify the individual listing and note how many listings share that map spot.

The public map currently renders at most 150 pins at once. At substantially higher city density, the next scaling step is server-side viewport queries plus count clusters at low zoom, while preserving this fan-out behavior after clusters are opened.
