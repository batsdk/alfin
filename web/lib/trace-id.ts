import { v4 as uuidv4 } from "uuid";

// Sent on every request to the API so each call can be traced through its logs
export const TRACE_ID_HEADER = "x-tract-id";

// A fresh id per request. Uses the uuid package rather than crypto.randomUUID(),
// which only exists in secure contexts and so breaks over plain-http LAN URLs.
export const createTraceId = () => uuidv4();
