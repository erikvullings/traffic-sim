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

## TODO

- Synchronize with testbed time service (optional)
- Display (sim) time in app (simState contains current time and speed, as well as state).
- Allow the user to add a via or end location by clicking on the map
