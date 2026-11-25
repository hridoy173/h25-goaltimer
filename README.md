# GoalTimer
Open `index.html` in a browser (no build step). Data lives in LocalStorage (`goaltimer_timers`, `goaltimer_settings`).
Only the target date/time is stored; countdowns are computed every second.

## Window pinning limits
"New window" opens a small pop-up (`?view=<id>`). Normal web pages **cannot** stay above other apps.
Chrome/Edge 116+ offers Document Picture-in-Picture (a real always-on-top window) — not yet wired in.
Fallback: resize the pop-up and use your OS's "always on top" option, or use Focus + Fullscreen.

## Not yet built
Per-timer layout/font/card customization, reminders/Notification API, timezone field, default-layout settings.
