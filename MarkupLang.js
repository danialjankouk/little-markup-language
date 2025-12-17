const testInput =  `server {
    host: "localhost"
    port: 8080
    active: true
    
    routes {
        path: "/api"
        method: "GET"
    }
}
config {
    debug: false
    level: "info"
}`;
function parseConfig(text) {
  let lines = text.split("\n");
  let stack = [];
  let result = [];

  stack.push({ type: "root", data: result });

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    if (line == "") continue;

    if (line.startsWith("//")) continue;

    if (line.includes("{")) {
      let name = line.replace("{", "").trim();
      let newBlock = { name: name, items: {} };
      stack.push(newBlock);
      continue;
    }
 
    if (line == "}") {
      let block = stack.pop();
      let parent = stack[stack.length - 1];

      if (parent.type == "root") {
        parent.data.push(block);
      } else {
        if (!parent.items[block.name]) {
          parent.items[block.name] = [];
        }
        parent.items[block.name].push(block.items);
      }
      continue;
    }

    if (line.includes(":")) {
      let parts = line.split(":");
      let key = parts[0].trim();
      let val = parts[1].trim();

      let finalValue = val;

      if (val.startsWith('"') && val.endsWith('"')) {
        finalValue = val.substring(1, val.length - 1);
      }
      else if (!isNaN(val)) {
        finalValue = Number(val);
      }
      else if (val == "true") {
        finalValue = true;
      } else if (val == "false") {
        finalValue = false;
      }

      let current = stack[stack.length - 1];
      current.items[key] = finalValue;
    }
  }

  return result;
}

// Run and show result
console.log("Input:");
console.log(testInput);
console.log("\n-------------------\n");

let parsed = parseConfig(testInput);

console.log("Parsed Result:");
console.log(JSON.stringify(parsed, null, 2));

// Some simple tests
console.log("\n--- Data Access Test ---");
console.log("Server name:", parsed[0].name);
console.log("Host:", parsed[0].items.host);
console.log("Port:", parsed[0].items.port);
console.log("Active?", parsed[0].items.active);
