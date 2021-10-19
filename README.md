# learn vtk.js

## Goal

Manipulate locally some vtk.js examples 

https://kitware.github.io/vtk-examples/site/

to better understand its API.

## working with parcel

I used this documentation to make vtk work with parcel2

https://kitware.github.io/vtk-js/docs/intro_vtk_as_es6_dependency.html

It mostly consists of:

* installing @kitware/vtk.js instead vtk.js
* Changing import path like this example:

```
-import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';
+import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer';
```

## Launch

For example for cone1:

```npm run cone1```

browser http://localhost:1234

