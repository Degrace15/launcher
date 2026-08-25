import plugin from "../plugin.json";

let launcherPage = null;
let currentFolder = null;
let fsOperation = null;

function init(baseUrl, $page, cache) {

  const commands = acode.require("commands");

  fsOperation = acode.require("fsOperation");

  commands.addCommand({

    name: "launcher",

    description: "Open Launcher",

    exec: async () => {

      currentFolder = addedFolder?.[0];

      if (!currentFolder) {

        acode.alert(
          "Launcher",
          "Please open a project folder in Acode first."
        );

        return;
      }

      await showLauncher();

    }

  });

}


async function getFileSystem() {

  if (!currentFolder) {
    throw new Error("No project folder is open.");
  }

  return await fsOperation(
    currentFolder.url
  );

}


async function scanProject() {

  const fs = await getFileSystem();

  const entries = await fs.lsDir();

  const files = [];
  const directories = [];

  for (const entry of entries) {

    const name =
      entry.name || "";

    if (entry.isDirectory) {

      directories.push(name);

    } else {

      files.push(name);

    }

  }

  const lower =
    files.map(file =>
      file.toLowerCase()
    );

  let type = "Unknown";
  let icon = "📦";
  let description =
    "No known project configuration detected.";

  if (
    lower.includes("package.json")
  ) {

    type = "Node.js";
    icon = "🟨";

    description =
      "JavaScript or Node.js project.";

  }

  if (
    lower.includes("vite.config.js") ||
    lower.includes("vite.config.ts") ||
    lower.includes("vite.config.mjs")
  ) {

    type = "Vite";
    icon = "⚡";

    description =
      "Vite-based web project.";

  }

  if (
    lower.includes("index.html")
  ) {

    if (type === "Unknown") {

      type =
        "HTML / CSS / JavaScript";

      icon = "🌐";

      description =
        "Web project with an HTML entry point.";

    }

  }

  if (
    lower.includes("index.php") ||
    lower.some(file =>
      file.endsWith(".php")
    )
  ) {

    type = "PHP";
    icon = "🐘";

    description =
      "PHP project.";

  }

  if (
    lower.includes("main.py") ||
    lower.some(file =>
      file.endsWith(".py")
    )
  ) {

    type = "Python";
    icon = "🐍";

    description =
      "Python project.";

  }

  if (
    lower.includes("tsconfig.json")
  ) {

    type = "TypeScript";
    icon = "🔷";

    description =
      "TypeScript project.";

  }

  return {

    name:
      getFolderName(
        currentFolder.url
      ),

    path:
      currentFolder.url,

    type,

    icon,

    description,

    files,

    directories

  };

}


async function showLauncher() {

  closeLauncher();

  const project =
    await scanProject();

  launcherPage =
    document.createElement("div");

  launcherPage.id =
    "project-launcher";

  launcherPage.innerHTML = `

    <div class="pl-wrapper">

      <header class="pl-header">

        <div>

          <div class="pl-title">
           🚀 Launcher
          </div>

          <div class="pl-subtitle">
            ${escapeHtml(project.name)}
          </div>

        </div>

        <button
          class="pl-close"
          id="pl-close"
        >
          ×
        </button>

      </header>


      <section class="pl-project">

        <div class="pl-project-icon">
          ${project.icon}
        </div>

        <div class="pl-project-main">

          <strong>
            ${escapeHtml(project.name)}
          </strong>

          <span>
            ${escapeHtml(project.type)}
          </span>

        </div>

        <div class="pl-badge">
          READY
        </div>

      </section>


      <section class="pl-actions">

        <button
          data-action="preview"
          class="pl-action primary"
        >
          <b>🌐</b>
          <span>Preview</span>
        </button>

        <button
          data-action="files"
          class="pl-action"
        >
          <b>📁</b>
          <span>Files</span>
        </button>

        <button
          data-action="refresh"
          class="pl-action"
        >
          <b>🔄</b>
          <span>Refresh</span>
        </button>

        <button
          data-action="info"
          class="pl-action"
        >
          <b>ℹ️</b>
          <span>Info</span>
        </button>

      </section>


      <section class="pl-section">

        <h3>
          PROJECT
        </h3>

        <div class="pl-card">

          <span class="pl-card-icon">
            🧩
          </span>

          <div>

            <strong>
              ${escapeHtml(project.type)}
            </strong>

            <small>
              ${escapeHtml(project.description)}
            </small>

          </div>

        </div>

      </section>


      <section class="pl-section">

        <h3>
          DIRECTORIES
        </h3>

        <div class="pl-list">

          ${
            project.directories.length

              ? project.directories
                  .map(directory => `

                    <div class="pl-list-item">

                      <span>📁</span>

                      <span>
                        ${escapeHtml(directory)}
                      </span>

                    </div>

                  `)
                  .join("")

              : `
                <div class="pl-empty">
                  No directories found.
                </div>
              `
          }

        </div>

      </section>


      <section class="pl-section">

        <h3>
          FILES
        </h3>

        <div class="pl-list">

          ${
            project.files.length

              ? project.files
                  .map(file => `

                    <div class="pl-list-item">

                      <span>
                        ${getFileIcon(file)}
                      </span>

                      <span>
                        ${escapeHtml(file)}
                      </span>

                    </div>

                  `)
                  .join("")

              : `
                <div class="pl-empty">
                  No files found.
                </div>
              `
          }

        </div>

      </section>


      <section class="pl-section">

        <h3>
          PROJECT PATH
        </h3>

        <div class="pl-path">
          ${escapeHtml(project.path)}
        </div>

      </section>

    </div>

  `;


  addStyles();

  document.body.appendChild(
    launcherPage
  );


  launcherPage
    .querySelector("#pl-close")
    .onclick = closeLauncher;


  launcherPage
    .querySelectorAll(
      "[data-action]"
    )
    .forEach(button => {

      button.onclick = async () => {

        await handleAction(
          button.dataset.action
        );

      };

    });

}


async function handleAction(action) {

  if (action === "preview") {

    await previewProject();

    return;

  }


  if (action === "files") {

    await showFiles();

    return;

  }


  if (action === "refresh") {

    currentFolder.reload();

    window.toast(
      "Project refreshed 🔄"
    );

    await showLauncher();

    return;

  }


  if (action === "info") {

    const project =
      await scanProject();

    acode.alert(
      "Project Information",
      [
        `Name: ${project.name}`,
        `Type: ${project.type}`,
        `Files: ${project.files.length}`,
        `Directories: ${project.directories.length}`,
        "",
        `Path: ${project.path}`
      ].join("\n")
    );

  }

}


async function previewProject() {

  const fs =
    await getFileSystem();

  const entries =
    await fs.lsDir();

  const index =
    entries.find(entry =>
      !entry.isDirectory &&
      String(entry.name)
        .toLowerCase() ===
        "index.html"
    );


  if (!index) {

    acode.alert(
      "Preview",
      "This project does not contain index.html."
    );

    return;

  }


  try {

    const indexFs =
      await fsOperation(
        index.url
      );

    const html =
      await indexFs.readFile(
        "utf-8"
      );


    const preview =
      document.createElement(
        "div"
      );

    preview.id =
      "pl-preview";


    preview.innerHTML = `

      <div class="pl-preview-header">

        <strong>
          🌐 Preview
        </strong>

        <div>

          <button id="pl-preview-reload">
            🔄
          </button>

          <button id="pl-preview-close">
            ✕
          </button>

        </div>

      </div>


      <iframe
        id="pl-preview-frame"
        sandbox="allow-scripts allow-forms allow-modals"
      ></iframe>

    `;


    document.body.appendChild(
      preview
    );


    const frame =
      preview.querySelector(
        "#pl-preview-frame"
      );


    frame.srcdoc = html;


    preview
      .querySelector(
        "#pl-preview-close"
      )
      .onclick = () => {

        preview.remove();

      };


    preview
      .querySelector(
        "#pl-preview-reload"
      )
      .onclick = () => {

        frame.srcdoc = html;

      };


  } catch (error) {

    acode.alert(
      "Preview Error",
      error.message
    );

  }

}


async function showFiles() {

  try {

    const fs =
      await getFileSystem();

    const entries =
      await fs.lsDir();


    const text =
      entries
        .map(entry => {

          const icon =
            entry.isDirectory
              ? "📁"
              : getFileIcon(
                  entry.name
                );

          return `${icon} ${entry.name}`;

        })
        .join("\n");


    acode.alert(
      "Project Files",
      text || "Project is empty."
    );


  } catch (error) {

    acode.alert(
      "Files Error",
      error.message
    );

  }

}


function getFileIcon(file) {

  const extension =
    String(file)
      .split(".")
      .pop()
      .toLowerCase();


  const icons = {

    html: "🌐",
    htm: "🌐",
    css: "🎨",

    js: "🟨",
    mjs: "🟨",
    cjs: "🟨",

    ts: "🔷",
    tsx: "⚛️",

    php: "🐘",
    py: "🐍",

    json: "📋",
    md: "📝",

    c: "⚙️",
    cpp: "⚙️",
    h: "⚙️",
    java: "☕"

  };


  return icons[extension] || "📄";

}


function getFolderName(path) {

  const parts =
    String(path)
      .split("/")
      .filter(Boolean);

  return (
    parts[parts.length - 1] ||
    "Project"
  );

}


function escapeHtml(value) {

  return String(value)

    .replaceAll(
      "&",
      "&amp;"
    )

    .replaceAll(
      "<",
      "&lt;"
    )

    .replaceAll(
      ">",
      "&gt;"
    )

    .replaceAll(
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
    );

}


function addStyles() {

  if (
    document.getElementById(
      "launcher-styles"
    )
  ) {

    return;

  }


  const style =
    document.createElement(
      "style"
    );


  style.id =
    "launcher-styles";


  style.textContent = `

    #project-launcher {

      position: fixed;
      inset: 0;
      z-index: 999999;

      background: #0B1F3A;
      color: #fff;

      overflow-y: auto;

      font-family:
        Arial,
        sans-serif;

    }


    .pl-wrapper {

      padding: 18px;
      max-width: 700px;
      margin: auto;

    }


    .pl-header {

      display: flex;

      align-items: center;
      justify-content:
        space-between;

      margin-bottom: 20px;

    }


    .pl-title {

      font-size: 22px;
      font-weight: 700;

    }


    .pl-subtitle {

      margin-top: 5px;

      font-size: 12px;

      opacity: .55;

    }


    .pl-close {

      width: 40px;
      height: 40px;

      border: 0;

      border-radius: 10px;

      background:
        rgba(255,255,255,.1);

      color: #fff;

      font-size: 25px;

    }


    .pl-project {

      display: flex;

      align-items: center;

      gap: 14px;

      padding: 18px;

      border-radius: 16px;

      background: #102B4D;

      margin-bottom: 15px;

    }


    .pl-project-icon {

      font-size: 38px;

    }


    .pl-project-main {

      flex: 1;

    }


    .pl-project-main strong {

      display: block;

      font-size: 17px;

    }


    .pl-project-main span {

      display: block;

      margin-top: 5px;

      font-size: 12px;

      opacity: .6;

    }


    .pl-badge {

      color: #00d4ff;

      font-size: 9px;

      font-weight: 700;

    }


    .pl-actions {

      display: grid;

      grid-template-columns:
        repeat(2, 1fr);

      gap: 10px;

    }


    .pl-action {

      min-height: 82px;

      border: 0;

      border-radius: 14px;

      background: #102B4D;

      color: #fff;

      font-size: 14px;

      font-weight: 600;

    }


    .pl-action.primary {

      outline:
        1px solid #00d4ff;

    }


    .pl-action b {

      display: block;

      font-size: 25px;

      margin-bottom: 7px;

    }


    .pl-section {

      margin-top: 23px;

    }


    .pl-section h3 {

      margin: 0 0 9px;

      font-size: 11px;

      opacity: .55;

      letter-spacing: .5px;

    }


    .pl-card {

      display: flex;

      align-items: center;

      gap: 12px;

      padding: 15px;

      border-radius: 12px;

      background: #102B4D;

    }


    .pl-card-icon {

      font-size: 25px;

    }


    .pl-card strong {

      display: block;

      font-size: 14px;

    }


    .pl-card small {

      display: block;

      margin-top: 4px;

      font-size: 11px;

      opacity: .55;

    }


    .pl-list {

      display: flex;

      flex-direction: column;

      gap: 6px;

    }


    .pl-list-item {

      display: flex;

      align-items: center;

      gap: 10px;

      padding: 11px 13px;

      border-radius: 9px;

      background: #102B4D;

      font-size: 13px;

    }


    .pl-empty {

      padding: 14px;

      border-radius: 10px;

      background: #102B4D;

      opacity: .6;

      font-size: 12px;

    }


    .pl-path {

      padding: 13px;

      border-radius: 10px;

      background: #102B4D;

      font-size: 11px;

      opacity: .7;

      word-break: break-all;

    }


    #pl-preview {

      position: fixed;

      inset: 0;

      z-index: 1000000;

      background: #fff;

    }


    .pl-preview-header {

      height: 50px;

      display: flex;

      align-items: center;

      justify-content:
        space-between;

      padding: 0 12px;

      background: #0B1F3A;

      color: white;

    }


    .pl-preview-header button {

      border: 0;

      background:
        rgba(255,255,255,.1);

      color: white;

      width: 34px;

      height: 34px;

      border-radius: 8px;

      margin-left: 5px;

    }


    #pl-preview-frame {

      width: 100%;

      height:
        calc(100% - 50px);

      border: 0;

      background: white;

    }

  `;


  document.head.appendChild(
    style
  );

}


function closeLauncher() {

  if (launcherPage) {

    launcherPage.remove();

    launcherPage = null;

  }


  const preview =
    document.getElementById(
      "pl-preview"
    );

  if (preview) {

    preview.remove();

  }

}


function unmount() {

  const commands =
    acode.require("commands");


  commands.removeCommand(
    "launcher"
  );


  closeLauncher();

  currentFolder = null;

  fsOperation = null;

}


acode.setPluginInit(
  plugin.id,
  init
);


acode.setPluginUnmount(
  plugin.id,
  unmount
);
