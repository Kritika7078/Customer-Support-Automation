// import { Inngest } from "inngest";

// export const inngest = new Inngest({ id: "ticketing-system" });

import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "ticketing-system",
  eventKey: process.env.INNGEST_EVENT_KEY,      // required
  signingKey: process.env.INNGEST_SIGNING_KEY,  // required
});