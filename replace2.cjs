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
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  // 1. Bump 10px/12px to text-xs (which is 14px globally now)
  content = content.replace(/text-\[12px\]/g, 'text-xs');
  content = content.replace(/text-\[10px\]/g, 'text-xs');
  
  // 2. Reduce tracking to compensate for larger font size
  content = content.replace(/tracking-widest/g, 'tracking-wider');
  content = content.replace(/tracking-\[0\.3em\]/g, 'tracking-widest');

  // 3. Add font-medium to uppercase mono labels/buttons to maintain emphasis
  content = content.replace(/font-mono text-xs uppercase/g, 'font-mono text-xs font-medium uppercase');
  content = content.replace(/font-mono text-xs text-muted-foreground uppercase/g, 'font-mono text-xs font-medium text-muted-foreground uppercase');
  content = content.replace(/font-mono text-xs text-primary uppercase/g, 'font-mono text-xs font-medium text-primary uppercase');
  content = content.replace(/font-mono text-xs text-foreground uppercase/g, 'font-mono text-xs font-medium text-foreground uppercase');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    changedCount++;
    console.log(`Updated ${file}`);
  }
});

console.log(`Done. Changed ${changedCount} files.`);
