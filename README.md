```shell
C:\sources\dcp-cu>uv init src-py
Initialized project `src-py` at `C:\sources\dcp-cu\src-py`

C:\sources\dcp-cu>rmdir /S /Q src-py\.git
C:\sources\dcp-cu>cd src-py
C:\sources\dcp-cu\src-py>uv sync
```

## rustrover python setting
- select main.py
- Configure python interpreter
- Add Python interpreter : uv (src-py)
- .ida/dcp-cu.iml  : `<sourceFolder url="file://$MODULE_DIR$/src-py" isTestSource="false" />`
```xml
<?xml version="1.0" encoding="UTF-8"?>
<module type="EMPTY_MODULE" version="4">
  <component name="FacetManager">
    <facet type="Python" name="Python facet">
      <configuration sdkName="uv (src-py) (4)" />
    </facet>
  </component>
  <component name="NewModuleRootManager">
    <content url="file://$MODULE_DIR$">
      <excludeFolder url="file://$MODULE_DIR$/src-py/.venv" />
      <sourceFolder url="file://$MODULE_DIR$/src-py" isTestSource="false" />
    </content>
    <orderEntry type="inheritedJdk" />
    <orderEntry type="sourceFolder" forTests="false" />
    <orderEntry type="library" name="uv (src-py) (4) interpreter library" level="application" />
  </component>
</module>
```


```shell
C:\sources\dcp-cu>pnpm create vite src-react
.../19aba096be4-35a0                     |   +1 +
.../19aba096be4-35a0                     | Progress: resolved 1, reused 0, downloaded 1, added 1, done
|
o  Select a framework:
|  React
|
o  Select a variant:
|  TypeScript + React Compiler
|
o  Use rolldown-vite (Experimental)?:
|  No
|
o  Install with pnpm and start now?
|  No
|
o  Scaffolding project in C:\sources\dcp-cu\src-react...
|
—  Done. Now run:

  cd src-react
  pnpm install
  pnpm dev
```

```shell
C:\sources\dcp-cu> git init
C:\sources\dcp-cu> git add .
C:\sources\dcp-cu> git commit -m "first commit"
C:\sources\dcp-cu> git branch -M main
C:\sources\dcp-cu> git remote add origin https://github.com/kangtae49/dcp-cu.git
C:\sources\dcp-cu> git push -u origin main 
```

## sqlite3 build (use venv)
```shell
(src-py) PS C:\sources\dcp-cu\src-react\node_modules\sqlite3>npm install --build-from-source
```