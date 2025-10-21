20251022
版本更新注意事项 环境 跟firebase不搭  要重新安装
安装命令如下 

1 
Remove-Item -Recurse -Force node_modules, package-lock.json

2
npm cache clean --force
npm install @angular/cli@9 @angular/core@9 @angular/compiler-cli@9 --save-dev
npm install typescript@3.8.3 --save-dev
npm install firebase@7.24.0 angularfire2@5.4.2
npm install
npx ng serve
