import { UploadInputSchema } from "./src/types/index";
import fs from "fs";

const data = JSON.parse(fs.readFileSync("./seed-data.json", "utf-8"));
const parsed = UploadInputSchema.safeParse(data);

if (!parsed.success) {
  console.log("Error:", parsed.error);
} else {
  const { pages, keywords, technicalIssues } = parsed.data;
  const pageRecords = [];
  
  if (pages) {
    for (let i = 0; i < pages.length; i++) {
      const p = pages[i];
      const sourceId = p.id || p.sourceId || `page_${i}`;
      pageRecords.push({ id: `cuid_${i}`, sourceId });
    }
  }

  console.log("Page sourceIds:", pageRecords.map(pr => pr.sourceId).slice(0, 5));

  if (keywords) {
    console.log("Testing Keywords Match...");
    let matchedCount = 0;
    for (const k of keywords) {
      if (k.currentlyRankingPageId) {
        const matched = pageRecords.find(pr => pr.sourceId === k.currentlyRankingPageId || pr.id === k.currentlyRankingPageId);
        if (matched) {
          matchedCount++;
          // console.log(`✅ Keyword matched: ${k.currentlyRankingPageId} -> ${matched.sourceId}`);
        } else {
          console.log(`❌ Keyword match failed: ${k.currentlyRankingPageId}`);
        }
      }
    }
    console.log(`Total matched keywords: ${matchedCount}`);
  }
}

