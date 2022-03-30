const express = require("express");
const fse = require("fs-extra");
const app = express();
const fs = require("fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { v4: uuidv4 } = require("uuid");
const path = require("path");
require("dotenv").config();

// parse various different custom JSON types as JSON
app.use(express.json());

const PORT = process.env.PORT | 3000;

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

app.post("/api/component", async (req, res) => {
  const foldername = "minimal-react-app"; //uuidv4();
  console.log("body:", req.body.component);
  readWriteSync(req.body.component, foldername);
  console.log("read and wrote");
  const npmscripts = async () => {
    try {
      const { stdout, stderr } = await exec(
        `cd ${foldername} && ./node_modules/webpack/bin/webpack.js && npx gulp`
      );
      console.log("stdout:", stdout);
      console.log("stderr:", stderr);
    } catch (err) {
      console.error("couldnt run script:", err);
    }
  };
  await npmscripts();
  res.sendFile(path.join(__dirname, `${foldername}/build/index.html`));
  const baseApp = fs.readFileSync(`./${foldername}/src/indexBase.js`, "utf-8");
  fs.writeFileSync(`./${foldername}/src/index.js`, baseApp, "utf-8");
});

const readWriteSync = (component, foldername) => {
  const newAppPath = foldername;
  const data = fs.readFileSync("./minimal-react-app/src/index.js", "utf-8");
  const newValue = data.replace("//component", component);

  fs.writeFileSync(`./${newAppPath}/src/index.js`, newValue, "utf-8");
};

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
