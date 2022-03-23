// const bodyParser = require("body-parser");
const express = require("express");
const fse = require("fs-extra");
const app = express();
const fs = require("fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { v4: uuidv4 } = require("uuid");
const path = require("path");

// parse various different custom JSON types as JSON
app.use(express.json());

const port = 3000;

app.post("/", async (req, res) => {
  const foldername = uuidv4();
  readWriteSync(req.body.component, foldername);

  const npmscripts = async () => {
    try {
      const { stdout, stderr } = await exec(
        `cd ${foldername} && npm run build && npx gulp`
      );
      console.log("stdout:", stdout);
      console.log("stderr:", stderr);
    } catch (err) {
      console.error("couldnt run script:", err);
    }
  };
  await npmscripts();
  res.sendFile(path.join(__dirname, `${foldername}/build/index.html`));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

function readWriteSync(component, foldername) {
  const newAppPath = foldername;
  try {
    copyFolder("./minimal-react-app", `./${newAppPath}`);
  } catch (e) {
    console.log("couldnt copy folder", e.message);
  }

  const data = fs.readFileSync("./minimal-react-app/src/index.js", "utf-8");
  const newValue = data.replace("//component", component);

  fs.writeFileSync(`./${newAppPath}/src/index.js`, newValue, "utf-8");
}

const copyFolder = (src, dest) => {
  // To copy a folder or file
  fse.copySync(src, dest, { overwrite: true }, (err) => {
    if (err) {
      console.error("couldnt copy", err);
    } else {
      console.log("success!");
    }
  });
};