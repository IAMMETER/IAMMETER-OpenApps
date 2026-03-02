import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import fg from "fast-glob";

const MAX_SIZE = 1024 * 1024; // 1MB
const MIN_WIDTH = 800;
const REQUIRED_RATIO = 16 / 9;

const RECOMMENDED_WIDTH = 1280;
const RECOMMENDED_HEIGHT = 720;

const ALLOWED_EXT = ["png", "jpg", "jpeg"];

const ROOT = process.cwd();

async function main() {
  const manifestFiles = await fg(["apps/*/manifest.json"]);
  let hasError = false;

  for (const manifestPath of manifestFiles) {
    const full = path.join(ROOT, manifestPath);
    const manifest = JSON.parse(fs.readFileSync(full, "utf8"));

    if (manifest.runtime !== "static") continue;

    const appDir = path.dirname(full);

    const screenshots = fs.readdirSync(appDir).filter(f =>
      /^screenshot\.(png|jpg|jpeg)$/i.test(f)
    );

    // Optional
    if (screenshots.length === 0) {
      console.log(`ℹ️  ${manifest.id}: No screenshot (optional)`);
      continue;
    }

    if (screenshots.length > 1) {
      console.error(`❌ ${manifest.id}: Multiple screenshot files found`);
      hasError = true;
      continue;
    }

    const screenshotFile = screenshots[0];
    const screenshotPath = path.join(appDir, screenshotFile);

    const ext = screenshotFile.split(".").pop().toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) {
      console.error(`❌ ${manifest.id}: Invalid screenshot format`);
      hasError = true;
      continue;
    }

    const stat = fs.statSync(screenshotPath);

    if (stat.size > MAX_SIZE) {
      console.error(`❌ ${manifest.id}: Screenshot exceeds 1MB`);
      hasError = true;
    }

    const image = sharp(screenshotPath);
    const meta = await image.metadata();

    if (!meta.width || !meta.height) {
      console.error(`❌ ${manifest.id}: Unable to read image dimensions`);
      hasError = true;
      continue;
    }

    // Hard requirements
    if (meta.width < MIN_WIDTH) {
      console.error(`❌ ${manifest.id}: Width must be >= ${MIN_WIDTH}px`);
      hasError = true;
    }

    const ratio = meta.width / meta.height;
    const diff = Math.abs(ratio - REQUIRED_RATIO);

    if (diff > 0.02) {
      console.error(`❌ ${manifest.id}: Screenshot must be 16:9 ratio`);
      hasError = true;
    }

    // Recommended size warning
    if (
      meta.width !== RECOMMENDED_WIDTH ||
      meta.height !== RECOMMENDED_HEIGHT
    ) {
      console.warn(
        `⚠️  ${manifest.id}: Recommended size is ${RECOMMENDED_WIDTH}x${RECOMMENDED_HEIGHT}px (current: ${meta.width}x${meta.height})`
      );
    }

    console.log(`✅ ${manifest.id}: Screenshot validated`);
  }

  if (hasError) {
    console.error("\nScreenshot validation failed.");
    process.exit(1);
  }

  console.log("\nScreenshot validation completed successfully.");
}

main();