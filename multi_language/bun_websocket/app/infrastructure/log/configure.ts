import { configure, getConsoleSink } from "@logtape/logtape"

await configure({
  sinks: { console: getConsoleSink() },
  loggers: [
    {
      category: "web_chat_bun",
      lowestLevel: "debug",
      sinks: ["console"]
    }
  ]
})
