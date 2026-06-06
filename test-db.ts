import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const pages = await prisma.page.findMany({
    include: { keywords: true, technicalIssues: true }
  })
  
  console.log("Total pages in DB:", pages.length)
  
  const pageWithIssues = pages.find(p => p.technicalIssues.length === 8)
  if (pageWithIssues) {
    console.log("Found page with 8 issues:", pageWithIssues.url, "sourceId:", pageWithIssues.sourceId)
    console.log("Issues:", pageWithIssues.technicalIssues.map(i => i.id))
  } else {
    console.log("No page with 8 issues found. Distribution:")
    pages.filter(p => p.technicalIssues.length > 0).forEach(p => {
      console.log(`Page ${p.sourceId} has ${p.technicalIssues.length} issues.`)
    })
  }

  const keywords = await prisma.keyword.findMany()
  console.log("Total keywords in DB:", keywords.length)
  const keywordsWithPage = keywords.filter(k => k.currentlyRankingPageId !== null)
  console.log("Keywords with page assigned:", keywordsWithPage.length)
}

main().finally(() => prisma.$disconnect())
