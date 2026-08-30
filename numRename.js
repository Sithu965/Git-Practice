const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Set up the console prompt interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Ask for the folder path
rl.question("Paste the target folder path: ", (targetFolder) => {
  // Ask for the number offset to add
  rl.question("Enter the starting number of the file: ", (offsetInput) => {
    const offset = parseInt(offsetInput, 10);

    if (isNaN(offset)) {
      console.error("Error: Please enter a valid number.");
      rl.close();
      return;
    }

    // Read all files in the target folder
    fs.readdir(targetFolder, (err, files) => {
      if (err) {
        console.error("Error reading the directory:", err.message);
        rl.close();
        return;
      }

      let renamedCount = 0;

      files.forEach((file) => {
        const oldFilePath = path.join(targetFolder, file);

        // Skip directories, only process actual files
        fs.stat(oldFilePath, (err, stats) => {
          if (err || !stats.isFile()) return;

          const ext = path.extname(file); // e.g., ".png"
          const baseName = path.basename(file, ext); // e.g., "1"
          const currentNumber = parseInt(baseName, 10);

          // Only rename files whose names are strictly numbers (like 1.png, 2.png)
          if (!isNaN(currentNumber)) {
            const newNumber = currentNumber + offset;
            const newFileName = `${newNumber}${ext}`;
            const newFilePath = path.join(targetFolder, newFileName);

            // Step 4: Rename the file non-blockingly
            fs.rename(oldFilePath, newFilePath, (err) => {
              if (err) {
                console.error(`Failed to rename ${file}:`, err.message);
              } else {
                console.log(`Renamed: ${file} -> ${newFileName}`);
              }
            });
          }
        });
      });
      // Practicing conflict for feature1
      rl.close();
    });
  });
});
