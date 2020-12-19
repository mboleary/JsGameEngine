# Audio Library Module

https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

## Mixer

Mixer should have access to
- All AudioPlayers and everything else connected to a track

Mixer should be able to
- Have effects
- Volume
- Send audio to a single or multiple track(s)
- Mute the track

There should be able to be sub-mixers

## EffectsContainer

This class will have all of the functionality to add effects to an audio track, or Player, or something else too. It should be able to take in an audio track, and apply any effects, then connect the end result to an audio track.