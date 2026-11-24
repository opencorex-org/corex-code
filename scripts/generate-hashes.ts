import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";

async function main() {
  const args = process.argv.slice(2);
  const isVerify = args.includes("--verify");
  const filteredArgs = args.filter((arg) => arg !== "--verify");

  if (isVerify) {
    const checksumFile = resolve(filteredArgs[0] ?? "dist/release/SHA256SUMS.txt");
    const baseDir = dirname(checksumFile);
    const content = await readFile(checksumFile, "utf8");
    const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);

    let failed = 0;
    for (const line of lines) {
      const match = line.match(/^([a-fA-F0-9]{64})\s+(.+)$/);
      if (!match) continue;
      const expectedHash = match[1];
      const filename = match[2];
      if (!expectedHash || !filename) continue;

      const filePath = join(baseDir, filename);
      try {
        const fileContent = await readFile(filePath);
        const actualHash = createHash("sha256").update(fileContent).digest("hex");
        if (actualHash.toLowerCase() === expectedHash.toLowerCase()) {
          console.log(`OK: ${filename}`);
        } else {
          console.error(`FAILED: ${filename} (hash mismatch)`);
          failed++;
        }
      } catch (err) {
        console.error(`FAILED: ${filename} (cannot read: ${(err as Error).message})`);
        failed++;
      }
    }

    if (failed > 0) {
      console.error(`\nVerification failed for ${failed} file(s).`);
      process.exit(1);
    }
    console.log(`\nAll checksums verified successfully.`);
    return;
  }

  const targetDir = resolve(filteredArgs[0] ?? "dist/release");
  const outputFile = resolve(filteredArgs[1] ?? join(targetDir, "SHA256SUMS.txt"));

  const files = (await readdir(targetDir))
    .filter((file) => file !== basename(outputFile) && !file.startsWith("."))
    .sort();

  if (files.length === 0) {
    console.warn(`No files found in ${targetDir} to hash.`);
    return;
  }

  const lines: string[] = [];
  for (const file of files) {
    const filePath = join(targetDir, file);
    const fileContent = await readFile(filePath);
    const hash = createHash("sha256").update(fileContent).digest("hex");
    lines.push(`${hash}  ${file}`);
    console.log(`${hash}  ${file}`);
  }

  const outputContent = lines.join("\n") + "\n";
  await writeFile(outputFile, outputContent, "utf8");
  console.log(`\nGenerated ${lines.length} SHA-256 hashes -> ${outputFile}`);
}

main().catch((error) => {
  console.error("Error with hashes:", error);
  process.exit(1);
});
