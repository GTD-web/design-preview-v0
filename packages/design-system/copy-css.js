// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");

function copyCSS() {
  const srcDir = "components";
  const distDir = "dist/components";

  // dist/components 디렉토리가 없으면 생성
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // components 디렉토리의 모든 .module.css 파일 찾기
  const files = fs.readdirSync(srcDir);

  files.forEach((file) => {
    if (file.endsWith(".module.css")) {
      const srcPath = path.join(srcDir, file);
      const distPath = path.join(distDir, file);

      fs.copyFileSync(srcPath, distPath);
      console.log(`Copied ${file} to dist/components/`);
    }
  });
}

copyCSS();
