const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');
let changedCount = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('text-[10px]')) {
    const newContent = content.replace(/text-\[10px\]/g, 'text-[12px]');
    fs.writeFileSync(file, newContent, 'utf8');
    changedCount++;
    console.log(`Updated ${file}`);
  }
});

console.log(`Done. Changed ${changedCount} files.`);
