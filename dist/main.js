(()=>{var m={id:"com.degrace.projectlauncher",name:"Launcher",main:"dist/main.js",version:"1.0.0",readme:"readme.md",icon:"icon.png",changelogs:"CHANGELOG.md",repository:"https://github.com/Degrace15/launcher.git",minVersionCode:290,price:0,license:"MIT",keywords:["project","launcher","preview","web","developer","workspace"],author:{name:"Hacker 2.0",github:"Degrace15"},files:["dist/main.js","readme.md","CHANGELOG.md","icon.png"]};var s=null,p=null,u=null;function y(e,t,a){let n=acode.require("commands");u=acode.require("fsOperation"),n.addCommand({name:"launcher",description:"Open Launcher",exec:async()=>{if(p=addedFolder?.[0],!p){acode.alert("Launcher","Please open a project folder in Acode first.");return}await w()}})}async function h(){if(!p)throw new Error("No project folder is open.");return await u(p.url)}async function x(){let t=await(await h()).lsDir(),a=[],n=[];for(let c of t){let g=c.name||"";c.isDirectory?n.push(g):a.push(g)}let o=a.map(c=>c.toLowerCase()),i="Unknown",r="\u{1F4E6}",d="No known project configuration detected.";return o.includes("package.json")&&(i="Node.js",r="\u{1F7E8}",d="JavaScript or Node.js project."),(o.includes("vite.config.js")||o.includes("vite.config.ts")||o.includes("vite.config.mjs"))&&(i="Vite",r="\u26A1",d="Vite-based web project."),o.includes("index.html")&&i==="Unknown"&&(i="HTML / CSS / JavaScript",r="\u{1F310}",d="Web project with an HTML entry point."),(o.includes("index.php")||o.some(c=>c.endsWith(".php")))&&(i="PHP",r="\u{1F418}",d="PHP project."),(o.includes("main.py")||o.some(c=>c.endsWith(".py")))&&(i="Python",r="\u{1F40D}",d="Python project."),o.includes("tsconfig.json")&&(i="TypeScript",r="\u{1F537}",d="TypeScript project."),{name:$(p.url),path:p.url,type:i,icon:r,description:d,files:a,directories:n}}async function w(){f();let e=await x();s=document.createElement("div"),s.id="project-launcher",s.innerHTML=`

    <div class="pl-wrapper">

      <header class="pl-header">

        <div>

          <div class="pl-title">
           \u{1F680} Launcher
          </div>

          <div class="pl-subtitle">
            ${l(e.name)}
          </div>

        </div>

        <button
          class="pl-close"
          id="pl-close"
        >
          \xD7
        </button>

      </header>


      <section class="pl-project">

        <div class="pl-project-icon">
          ${e.icon}
        </div>

        <div class="pl-project-main">

          <strong>
            ${l(e.name)}
          </strong>

          <span>
            ${l(e.type)}
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
          <b>\u{1F310}</b>
          <span>Preview</span>
        </button>

        <button
          data-action="files"
          class="pl-action"
        >
          <b>\u{1F4C1}</b>
          <span>Files</span>
        </button>

        <button
          data-action="refresh"
          class="pl-action"
        >
          <b>\u{1F504}</b>
          <span>Refresh</span>
        </button>

        <button
          data-action="info"
          class="pl-action"
        >
          <b>\u2139\uFE0F</b>
          <span>Info</span>
        </button>

      </section>


      <section class="pl-section">

        <h3>
          PROJECT
        </h3>

        <div class="pl-card">

          <span class="pl-card-icon">
            \u{1F9E9}
          </span>

          <div>

            <strong>
              ${l(e.type)}
            </strong>

            <small>
              ${l(e.description)}
            </small>

          </div>

        </div>

      </section>


      <section class="pl-section">

        <h3>
          DIRECTORIES
        </h3>

        <div class="pl-list">

          ${e.directories.length?e.directories.map(t=>`

                    <div class="pl-list-item">

                      <span>\u{1F4C1}</span>

                      <span>
                        ${l(t)}
                      </span>

                    </div>

                  `).join(""):`
                <div class="pl-empty">
                  No directories found.
                </div>
              `}

        </div>

      </section>


      <section class="pl-section">

        <h3>
          FILES
        </h3>

        <div class="pl-list">

          ${e.files.length?e.files.map(t=>`

                    <div class="pl-list-item">

                      <span>
                        ${b(t)}
                      </span>

                      <span>
                        ${l(t)}
                      </span>

                    </div>

                  `).join(""):`
                <div class="pl-empty">
                  No files found.
                </div>
              `}

        </div>

      </section>


      <section class="pl-section">

        <h3>
          PROJECT PATH
        </h3>

        <div class="pl-path">
          ${l(e.path)}
        </div>

      </section>

    </div>

  `,S(),document.body.appendChild(s),s.querySelector("#pl-close").onclick=f,s.querySelectorAll("[data-action]").forEach(t=>{t.onclick=async()=>{await j(t.dataset.action)}})}async function j(e){if(e==="preview"){await k();return}if(e==="files"){await P();return}if(e==="refresh"){p.reload(),window.toast("Project refreshed \u{1F504}"),await w();return}if(e==="info"){let t=await x();acode.alert("Project Information",[`Name: ${t.name}`,`Type: ${t.type}`,`Files: ${t.files.length}`,`Directories: ${t.directories.length}`,"",`Path: ${t.path}`].join(`
`))}}async function k(){let a=(await(await h()).lsDir()).find(n=>!n.isDirectory&&String(n.name).toLowerCase()==="index.html");if(!a){acode.alert("Preview","This project does not contain index.html.");return}try{let o=await(await u(a.url)).readFile("utf-8"),i=document.createElement("div");i.id="pl-preview",i.innerHTML=`

      <div class="pl-preview-header">

        <strong>
          \u{1F310} Preview
        </strong>

        <div>

          <button id="pl-preview-reload">
            \u{1F504}
          </button>

          <button id="pl-preview-close">
            \u2715
          </button>

        </div>

      </div>


      <iframe
        id="pl-preview-frame"
        sandbox="allow-scripts allow-forms allow-modals"
      ></iframe>

    `,document.body.appendChild(i);let r=i.querySelector("#pl-preview-frame");r.srcdoc=o,i.querySelector("#pl-preview-close").onclick=()=>{i.remove()},i.querySelector("#pl-preview-reload").onclick=()=>{r.srcdoc=o}}catch(n){acode.alert("Preview Error",n.message)}}async function P(){try{let a=(await(await h()).lsDir()).map(n=>`${n.isDirectory?"\u{1F4C1}":b(n.name)} ${n.name}`).join(`
`);acode.alert("Project Files",a||"Project is empty.")}catch(e){acode.alert("Files Error",e.message)}}function b(e){let t=String(e).split(".").pop().toLowerCase();return{html:"\u{1F310}",htm:"\u{1F310}",css:"\u{1F3A8}",js:"\u{1F7E8}",mjs:"\u{1F7E8}",cjs:"\u{1F7E8}",ts:"\u{1F537}",tsx:"\u269B\uFE0F",php:"\u{1F418}",py:"\u{1F40D}",json:"\u{1F4CB}",md:"\u{1F4DD}",c:"\u2699\uFE0F",cpp:"\u2699\uFE0F",h:"\u2699\uFE0F",java:"\u2615"}[t]||"\u{1F4C4}"}function $(e){let t=String(e).split("/").filter(Boolean);return t[t.length-1]||"Project"}function l(e){return String(e).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function S(){if(document.getElementById("launcher-styles"))return;let e=document.createElement("style");e.id="launcher-styles",e.textContent=`

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

      height: 34px;                                                                                       border-radius: 8px;

      margin-left: 5px;

    }
                                                  
    #pl-preview-frame {

      width: 100%;

      height:
        calc(100% - 50px);

      border: 0;

      background: white;

    }

  `,document.head.appendChild(e)}function f(){s&&(s.remove(),s=null);let e=document.getElementById("pl-preview");e&&e.remove()}function z(){acode.require("commands").removeCommand("launcher"),f(),p=null,u=null}acode.setPluginInit(m.id,y);acode.setPluginUnmount(m.id,z);})();