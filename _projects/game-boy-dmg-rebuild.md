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

Nintendo released the Game Boy in Japan on April 21, 1989, then in North America that July for $89.99 with *Tetris* in the box, and in Europe in September 1990. Its model number, DMG-01, stands for "Dot Matrix Game."

## The electronics in 1989

**Processor.** At the heart of the Game Boy is a single Sharp chip, the LR35902. Its CPU core, the Sharp SM83, is an 8-bit design that borrows from both the Intel 8080 and the Zilog Z80, running at about 4.19 MHz. The same chip also holds the picture processing unit, the sound hardware, and a tiny 256-byte boot ROM. That boot ROM is what scrolls the Nintendo logo down the screen at power-on and checks that a real cartridge is inserted. Alongside it sit just 8 KB of work RAM and 8 KB of video RAM.

**Screen.** The display is a 2.6-inch reflective STN (super-twisted nematic) LCD with a resolution of 160 × 144 pixels. It shows four shades of grey with its famous green tint, and refreshes at about 59.7 Hz.

**Sound.** The sound hardware has four channels: two pulse-wave channels (one with a pitch sweep), a programmable wave channel that plays 32 four-bit samples, and a noise channel for drums and explosions. Games can pan these channels left and right, but you only hear the stereo through headphones. The built-in speaker is mono.

**Power.** Four AA batteries supply 6 volts, and the whole system draws about 0.7 watts.

## What this rebuild changes

The goal is to keep everything that makes this a DMG: the original Sharp processor and main board, the cartridge slot, and the controls. Only the parts that wear out with age or hold the system back get replaced:

- **The screen** gets swapped for a modern backlit IPS panel. It's bright, sharp, readable without a lamp, and free of the ghosting and dead lines of the original.
- **The speaker** gets replaced with a new one, since a 35-year-old speaker has usually seen better days.

The IPS kit draws about 0.3 to 0.8 watts, close to the original screen's 0.7 watts, so battery life stays in the same range.

## How the rebuild works

<!-- PHOTO: the Game Boy opened up -->

**1. Swap the front board.** Six tri-wing screws hold the back on. Inside, a ribbon cable links the front board, which carries the original LCD, to the main CPU board in the back. The FunnyPlaying kit replaces that whole front board with its own, which carries the new IPS panel and its control electronics, so the original Sharp processor and main board stay untouched. Before anything gets stuck down, the new screen is plugged in and powered on as a dry test to check for dead pixels and creased ribbons. ([Hand Held Legend install guide](https://docs.handheldlegend.com/s/portal/doc/q5-ips-retro-pixel-UKe0qrFOrQ))

<!-- PHOTO: the IPS screen powered on during the dry test -->

**2. Fit the new screen into the shell.** The Q5 panel is about 11% larger than the original screen, so it needs a matching Q5 lens and a shell with a bigger window. An original shell can be trimmed to fit, but an IPS-ready shell skips that step. A small bracket holds the panel in line with the window. Once it's closed up, the old contrast wheel becomes the screen's control, adjusting brightness and switching between color palettes. ([kit details](https://handheldlegend.com/products/game-boy-dmg-retro-pixel-ips-lcd-kit-funnyplaying))

<!-- PHOTO: the finished screen in the shell -->

**3. Replace the speaker.** The DMG uses a 28 mm, 8-ohm speaker, and the new one solders straight onto the kit's control board. A fresh speaker gives clearer, crisper sound, closer to what the Game Boy sounded like new. It's still a single mono speaker, so stereo stays a headphones-only feature, and a new speaker alone won't make it dramatically louder. ([replacement speaker](https://handheldlegend.com/collections/game-boy-dmg/products/game-boy-speaker))

<!-- PHOTO: old speaker next to the new one -->

## Parts list

Everything comes from [Hand Held Legend](https://handheldlegend.com/collections/game-boy-dmg). Prices are as listed in October 2026.

- [Game Boy DMG Retro Pixel Q5 IPS LCD Backlight Kit, FunnyPlaying](https://handheldlegend.com/products/game-boy-dmg-retro-pixel-ips-lcd-kit-funnyplaying): $64.99. The IPS panel, new front board, and ribbon cables.
- [Game Boy DMG Q5 IPS Tempered Glass Screen Lens](https://handheldlegend.com/products/game-boy-dmg-ips-q5-tempered-glass-screen-lens): $4.99. Needed for the larger Q5 viewing window.
- [Game Boy DMG Retro Pixel Bracket, FunnyPlaying](https://handheldlegend.com/products/funnyplaying-retro-pixel-bracket): $3.49. Holds the panel in line with the window. Made only for this kit.
- [Game Boy Speaker Replacement](https://handheldlegend.com/collections/game-boy-dmg/products/game-boy-speaker), DMG 1 W 28 mm option: $2.99.
- [Game Boy Screwdrivers](https://handheldlegend.com/products/tri-wing-screwdriver-for-nintendo-game-boy-original-color-advance-and-ds): $3.99 each. A tri-wing tip for the case and a Phillips tip for the screen board.
- [Game Boy DMG IPS Shell, FunnyPlaying](https://handheldlegend.com/products/funnyplaying-game-boy-dmg-ips-shell) (optional): $9.99. An IPS-ready shell, if you'd rather not trim the original. Buttons aren't included, so the originals move over.

The essentials (kit, lens, bracket, and speaker) come to about $76 before tools.

## References

- [Game Boy / Color Architecture](https://copetti.org/writings/consoles/game-boy), Rodrigo Copetti
- [Game Boy](https://en.wikipedia.org/wiki/Game_Boy), Wikipedia
- [Game Boy hardware specs](https://www.gametechwiki.com/w/index.php/Game_Boy), Game Tech Wiki
- [Q5 IPS Retro Pixel install guide](https://docs.handheldlegend.com/s/portal/doc/q5-ips-retro-pixel-UKe0qrFOrQ), Hand Held Legend
