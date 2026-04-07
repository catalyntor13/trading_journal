import { auth } from "./auth"; // importă obiectul tău auth de server

// Extragem tipurile inferate din configurarea ta de server
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;