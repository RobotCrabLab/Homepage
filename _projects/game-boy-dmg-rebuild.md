---
title: Rebuilding an original Game Boy
summary: Bringing a 1989 Game Boy (DMG-01) up to date with a backlit IPS screen and a new speaker, while keeping the original processor and board.
year: 2026
status: In progress
tools: [Tri-wing screwdriver, Soldering iron, FunnyPlaying Q5 IPS kit]
featured: true
order: 0
---

<!-- PHOTO: the finished Game Boy, or the unit as it arrived. To add a photo, upload it to assets/images/projects/ and replace this comment with:
![Describe the photo]({{ '/assets/images/projects/your-photo.jpg' | relative_url }})
To use one as the big image at the top of the page, add  image: /assets/images/projects/your-photo.jpg  to the header above. -->

## Background

Nintendo released the Game Boy in Japan on April 21, 1989, then in North America that July for $89.99 with *Tetris* in the box, and in Europe in September 1990. Its model number, DMG-01, stands for "Dot Matrix Game." It was designed by Gunpei Yokoi and Nintendo's Research & Development 1 team, the group behind the Game & Watch.

Yokoi had a design philosophy often translated as "lateral thinking with withered technology": use components that are mature, cheap, and well understood, and find new ways to use them. The Game Boy is the classic example. Its competitors, the Atari Lynx and later the Sega Game Gear, had color backlit screens and much more power, but they could drain six AA batteries in four to six hours. The Game Boy ran for roughly 15 to 30 hours on four AAs, cost less, and outsold them by a huge margin. Together with the Game Boy Color, it sold 118.69 million units.

## The electronics in 1989

**Processor.** At the heart of the Game Boy is a single Sharp chip, the LR35902. Its CPU core, the Sharp SM83, is an 8-bit design that borrows from both the Intel 8080 and the Zilog Z80, running at about 4.19 MHz. The same chip also holds the picture processing unit, the sound hardware, and a tiny 256-byte boot ROM. That boot ROM is what scrolls the Nintendo logo down the screen at power-on and checks that a real cartridge is inserted. Alongside it sit just 8 KB of work RAM and 8 KB of video RAM.

**Screen.** The display is a 2.6-inch reflective STN (super-twisted nematic) LCD with a resolution of 160 × 144 pixels. It shows four shades of grey with its famous green tint, and refreshes at about 59.7 Hz. There's no backlight. A mirror-like layer behind the glass reflects room light back through the pixels, which is why you played under a lamp or by a window. STN panels are also slow to change state, so anything that moves fast leaves a ghostly trail. After 35-plus years, many of these screens develop missing vertical lines as the connection between the LCD glass and its ribbon cable fails.

**Sound.** The sound hardware has four channels: two pulse-wave channels (one with a pitch sweep), a programmable wave channel that plays 32 four-bit samples, and a noise channel for drums and explosions. Games can pan these channels left and right, but you only hear the stereo through headphones. The built-in speaker is mono.

**Power.** Four AA batteries supply 6 volts, and the whole system draws about 0.7 watts.

## What this rebuild changes

The goal is to keep everything that makes this a DMG: the original Sharp processor and main board, the cartridge slot, and the controls. Only the parts that wear out with age or hold the system back get replaced:

- **The screen** gets swapped for a modern backlit IPS panel. It's bright, sharp, readable without a lamp, and free of the ghosting and dead lines of the original.
- **The speaker** gets replaced with a new one, since a 35-year-old speaker has usually seen better days.

The IPS kit draws about 0.3 to 0.8 watts, close to the original screen's 0.7 watts, so battery life stays in the same range.

## Teardown

<!-- PHOTO: tools laid out, then the back of the Game Boy with screws removed -->

**Tools:** a Y1 tri-wing screwdriver, a PH1 Phillips screwdriver, a plastic spudger, flush cutters, a soldering iron, and isopropyl alcohol for cleaning.

1. **Remove the batteries and any cartridge.**
2. **Open the back.** Remove the six tri-wing screws from the back shell, including the two inside the battery compartment.
3. **Separate the halves carefully.** Open the Game Boy like a book. The front and back halves are still joined by a ribbon cable that runs from the front (display) board to the main CPU board. This cable is fragile and is a common failure point, so don't pull on it. Gently unplug it from the connector on the CPU board. The main board can stay in the rear shell for this whole project.
4. **Remove the front board.** Remove the Phillips screws holding the front board to the front shell, and lift it out. The original LCD, the power LED, and the contrast wheel all live on this board.
5. **Free the speaker.** The speaker sits in the lower right of the front shell, and its two wires are soldered to the front board. Desolder them, or simply remove the old speaker, since it's being replaced.
6. **Clean up.** With the shell empty, now is a good time to wash the plastic and clean the button membranes and contacts.

<!-- PHOTO: front board with the original LCD removed from the shell -->

## Installing the IPS screen

This build uses a FunnyPlaying Q5 IPS kit for the DMG. The Q5 panel is about 11% larger than the original screen while keeping the correct aspect ratio. The kit replaces the whole front board. It comes with the IPS panel, a new large front board with its own control electronics, ribbon cables, an LED diffuser for the power light, and adhesive. The matching Q5 glass lens and the screen alignment bracket are sold separately. These steps follow the Retro Pixel version of the kit. FunnyPlaying's laminated versions install the same way.

<!-- PHOTO: kit contents laid out -->

1. **Dry test first.** Before any adhesive goes on, connect the panel to its control board, plug the ribbon into the CPU board, add batteries, and power on. Check for dead pixels and make sure none of the ribbon cables are bent or creased. Installed kits generally can't be returned, so this is the moment to catch a bad panel.
2. **Solder the speaker** to the new control board. Polarity doesn't matter here. This is where the new speaker goes in (see below).
3. **Assemble the screen.** On a flat surface, connect the panel to the control board, peel the adhesive strip on the back of the control board, and stick it to the back of the panel. Set the assembly into the alignment bracket with the longer flex cable passing through the wide opening on the back. Then press the large ribbon cable into its connector with firm but gentle force, and latch it on both sides.
4. **Prepare the shell.** How much plastic needs to come out depends on the shell:
    - A FunnyPlaying Q5 shell has the window pre-cut, so no trimming is needed.
    - An IPS-ready shell needs about 1 mm of plastic beveled from around the window.
    - The original shell needs the screen window enlarged and two screw posts on the front half cut flush.
5. **Fit the screen.** Put the buttons and rubber membranes back in the front shell. Line the bracket's holes up with the screw posts, fold the board into place, and seat the speaker in its cutout. Make sure the contrast wheel turns freely. If it binds, trim any plastic touching it, or flush-cut and reflow the through-hole pins underneath it so nothing sticks up. Secure the board with its eight PH1 screws.
6. **Close it up.** Plug the ribbon cable back into the CPU board, fold the halves together, and replace the six tri-wing screws.

<!-- PHOTO: the new screen powered on inside the shell -->

**Using the new screen.** The original contrast wheel becomes the screen's control. On the Retro Pixel version, rolling the wheel changes brightness, pressing it switches to color palette mode, and a five-second press cycles through pixel display modes. Newer OSD versions of the kit open an on-screen menu instead, with 15 brightness levels, 36 color options, display effects, and frame blending.

## Replacing the speaker

The DMG uses a 28 mm, 8-ohm speaker, and after three decades the original is often worn, torn, or dusty enough to sound muffled or buzzy. A new 8-ohm replacement rated at 1 watt is the same size, comes with pre-soldered wires and an adhesive ring, and solders straight onto the IPS kit's control board. The result is clearer, crisper sound, closer to what the Game Boy sounded like new. It's still a single mono speaker, so stereo remains a headphones-only feature, and a new speaker alone won't make the Game Boy dramatically louder. For a real jump in volume, the next step would be a replacement amplifier board, such as RetroSix's CleanAmp.

<!-- PHOTO: old speaker next to the new one -->

## References

- [Game Boy / Color Architecture](https://copetti.org/writings/consoles/game-boy), Rodrigo Copetti
- [Game Boy](https://en.wikipedia.org/wiki/Game_Boy), Wikipedia
- [Game Boy hardware specs](https://www.gametechwiki.com/w/index.php/Game_Boy), Game Tech Wiki
- [Q5 IPS Retro Pixel install guide](https://docs.handheldlegend.com/s/portal/doc/q5-ips-retro-pixel-UKe0qrFOrQ), Hand Held Legend
- [FunnyPlaying DMG Q5 Retro Pixel IPS kit](https://handheldlegend.com/en-at/products/game-boy-dmg-retro-pixel-ips-lcd-kit-funnyplaying), Hand Held Legend
- [Game Boy replacement speaker](https://handheldlegend.com/collections/game-boy-dmg/products/game-boy-speaker), Hand Held Legend
