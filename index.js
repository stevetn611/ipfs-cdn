#!/usr/bin/env node

const path = require("path");
const program = require("commander");
const { getFiles } = require("./utils");
const { parse } = require("./ipfs-cdn");

program
  .version("0.0.1")
  .command("decentralize <dir>")
  .option("-o, --output <outDir>", "Output directory", "build")
  .option("-d, --dry-run", "Dry run")
  .option("-i, --in-place", "Change current file", false)
  .option("-r, --recursive", "Decentralize all the things!", true)
  .option("-n, --no-upload", "Do not upload assets to IPFS")
  .action(async (dir, cmdObj) => {
    for await (const inFile of getFiles(dir)) {
      if (path.extname(inFile) === ".html") {
        const outFile = cmdObj.inPlace
          ? inFile
          : path.join(cmdObj.output, inFile.substr(dir.length));
        console.log("[Process]", inFile, "->", outFile);
        try {
          await parse(dir, inFile, outFile, cmdObj.ipfs, cmdObj.dryRun);
        } catch (e) {
          console.error(e.toString());
          process.exit(-1);
        }
      }
    }
  });

program.parse(process.argv);
