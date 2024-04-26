# Traffic simulator

A simple traffic simulator to move some vehicles along a route.

## Installation

The application is a mono-repository, developed in TypeScript. It typically consists of the following packages:

- root
  - GUI: The client part of the application. 
  - Server: Hono-based service
  - Shared: Shared type and interface definitions

## Development

In all `packages` folder, copy `example.env` to `.env`. Optionally, update your settings, e.g. the PORT that you want to use for the sim server and for the web developer server. And, of course, the location of the Valhalla service.

```bash
pnpm i
npm start
```
## Screenshots

![Admin view](https://github.com/erikvullings/traffic-sim/assets/3140667/aeed5d68-0a1f-4efe-bbb3-80434e7c1b20)
Admin view. You can set user to Administrator in About (i) page. An admin can, via the settings, add new vehicles including their route.

![User view](https://github.com/erikvullings/traffic-sim/assets/3140667/0f1ff86f-be7b-46b2-ae39-c81d4dd7be7a)
The default user view has no controls.

## TODO

- Synchronize with testbed time service (optional)
- Display (sim) time in app (simState contains current time and speed, as well as state).

