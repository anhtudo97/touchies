// src/inngest/functions.ts
import { firecrawl } from "@/lib/firecrawl";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { inngest } from "./client";

const URL_REGEX = /https?:\/\/[^\s]+/g;

export const processTask = inngest.createFunction(
  { id: "process-task", triggers: { event: "app/task.created" } },
  async ({ event, step }) => {

    const { prompt } = event.data as { prompt: string; };

    const urls = await step.run("exctract-urls", async () => {
      // Simulate URL extraction from the prompt
      return prompt.match(URL_REGEX) ?? [];
    }) as string[];

    const scrapedContent = await step.run("scrape-urls", async () => {
      // Simulate scraping content from the extracted URLs
      const results = await Promise.all(
        urls.map(async (url) => {
          const result = await firecrawl.scrape(url, { formats: ["markdown"] });
          return result.markdown ?? null;
        })
      );

      return results.filter(Boolean).join("\n\n");
    });

    const finalPrompt = scrapedContent
      ? `Based on the following scraped content:\n\n${scrapedContent}\n\nAnswer the original prompt: ${prompt}`
      : prompt;

    const google = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_API_KEY!,
    });
    // Here you would typically call an LLM with the finalPrompt to get a response
    await step.run("generate-text", async () => {
      return await generateText({
        model: google("gemini-2.5-flash"),
        prompt: finalPrompt,
      });
    });
  }
); 