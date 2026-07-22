import { chromium } from "playwright";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");
const mockFile = join(__dirname, "mockL5X.L5X");
const outputPath = join(projectRoot, "plc-recording.webm");

async function record() {
  console.log("🎥 Starting PLC recording session...");

  if (!existsSync(mockFile)) {
    console.error("❌ mockL5X.L5X not found at:", mockFile);
    process.exit(1);
  }

  // Launch browser with video recording enabled
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: projectRoot,
      size: { width: 1920, height: 1080 },
    },
  });

  const page = await context.newPage();

  try {
    // Navigate to PLC page
    console.log("📄 Navigating to http://localhost:8081/plc");
    await page.goto("http://localhost:8081/plc", {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    console.log("✅ Page loaded");
    await page.waitForTimeout(2000); // Let page settle

    // Upload the L5X file
    console.log("📤 Uploading mockL5X.L5X...");
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(mockFile);

    await page.waitForTimeout(1000);
    console.log("✅ File uploaded");

    // Click the Parse & Visualize button
    console.log("🔄 Parsing L5X file...");
    const parseButton = page.locator('button:has-text("Parse & Visualize")');
    await parseButton.click();

    // Wait for SVG to render
    console.log("⏳ Waiting for SVG ladder logic to render...");
    await page.waitForSelector("svg", { timeout: 15000 });
    console.log("✅ SVG rendered");

    // Wait for content to stabilize
    await page.waitForTimeout(3000);

    // Scroll to show the SVG visualization
    console.log("📜 Scrolling to ladder logic visualization...");
    await page.evaluate(() => {
      const svg = document.querySelector("svg");
      if (svg) {
        svg.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });

    await page.waitForTimeout(2000);

    // Trigger live-pulse animations by hovering over tags
    console.log("✨ Triggering live-pulse animations on tags...");
    const tags = page.locator("svg .tag");
    const tagCount = await tags.count();

    if (tagCount > 0) {
      // Hover over first few tags to trigger animations
      for (let i = 0; i < Math.min(5, tagCount); i++) {
        await tags.nth(i).hover();
        await page.waitForTimeout(800);
      }
      console.log(`✅ Triggered animations on ${Math.min(5, tagCount)} tags`);
    } else {
      console.log("ℹ️  No .tag elements found, animations may be CSS-only");
    }

    // Let animations play for a bit
    console.log("🎬 Recording animations for 5 seconds...");
    await page.waitForTimeout(5000);

    // Scroll to show metadata and routine details
    console.log("📜 Scrolling to show metadata...");
    await page.evaluate(() => {
      window.scrollTo({ top: 400, behavior: "smooth" });
    });
    await page.waitForTimeout(2000);

    console.log("✅ Recording complete");
  } catch (error) {
    console.error("❌ Error during recording:", error);
    throw error;
  } finally {
    // Close browser and save video
    console.log("💾 Saving video...");
    await context.close();
    await browser.close();

    // Playwright saves as .webm by default
    console.log(`✅ Video saved to: ${outputPath}`);
    console.log("\n🎉 Recording session complete!");
  }
}

// Run the recording
record().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
