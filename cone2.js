import '@kitware/vtk.js/favicon';

// Load the rendering pieces we want to use (for both WebGL and WebGPU)
import '@kitware/vtk.js/Rendering/Profiles/Geometry';

//import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkOpenGLRenderWindow from '@kitware/vtk.js/Rendering/OpenGL/RenderWindow';
import vtkRenderWindow from '@kitware/vtk.js/Rendering/Core/RenderWindow';
import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer';
import vtkRenderWindowInteractor from '@kitware/vtk.js/Rendering/Core/RenderWindowInteractor';
import vtkInteractorStyleTrackballCamera from '@kitware/vtk.js/Interaction/Style/InteractorStyleTrackballCamera';


import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkConeSource from '@kitware/vtk.js/Filters/Sources/ConeSource';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';

// ----------------------------------------------------------------------------
// Standard rendering code setup
// ----------------------------------------------------------------------------

/*const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
  background: [0, 0, 0],
});
const renderer = fullScreenRenderer.getRenderer();
const renderWindow = fullScreenRenderer.getRenderWindow();*/

// ----------------------------------------------------------------------------
// Standard rendering code setup
// ----------------------------------------------------------------------------

const renderWindow = vtkRenderWindow.newInstance();
const renderer = vtkRenderer.newInstance({ background: [0.2, 0.3, 0.4] });
renderWindow.addRenderer(renderer);

// ----------------------------------------------------------------------------
// Use OpenGL as the backend to view the all this
// ----------------------------------------------------------------------------

const openglRenderWindow = vtkOpenGLRenderWindow.newInstance();
renderWindow.addView(openglRenderWindow);

// ----------------------------------------------------------------------------
// Create a div section to put this into
// ----------------------------------------------------------------------------

const container = document.createElement('div');
container.setAttribute("style","width:500px;height:300px");
document.querySelector('body').appendChild(container);
openglRenderWindow.setContainer(container);

// ----------------------------------------------------------------------------
// Capture size of the container and set it to the renderWindow
// ----------------------------------------------------------------------------

const { width, height } = container.getBoundingClientRect();
openglRenderWindow.setSize(width, height);

// ----------------------------------------------------------------------------
// Setup an interactor to handle mouse events
// ----------------------------------------------------------------------------

const interactor = vtkRenderWindowInteractor.newInstance();
interactor.setView(openglRenderWindow);
interactor.initialize();
interactor.bindEvents(container);

// ----------------------------------------------------------------------------
// Setup interactor style to use
// ----------------------------------------------------------------------------

interactor.setInteractorStyle(vtkInteractorStyleTrackballCamera.newInstance());


// ----------------------------------------------------------------------------
// Example code
// ----------------------------------------------------------------------------

function createConePipeline() {
  const coneSource = vtkConeSource.newInstance();
  const actor = vtkActor.newInstance();
  const mapper = vtkMapper.newInstance();

  actor.setMapper(mapper);
  mapper.setInputConnection(coneSource.getOutputPort());

  renderer.addActor(actor);
  return { coneSource, mapper, actor };
}

const pipelines = [createConePipeline(), createConePipeline()];

// Create red wireframe baseline
pipelines[0].actor.getProperty().setRepresentation(1);
pipelines[0].actor.getProperty().setColor(1, 0, 0);

renderer.resetCamera();
renderWindow.render();

// -----------------------------------------------------------
// UI control handling
// -----------------------------------------------------------

//fullScreenRenderer.addController(controlPanel);

['height', 'radius', 'resolution'].forEach((propertyName) => {
  document.querySelector(`.${propertyName}`).addEventListener('input', (e) => {
    const value = Number(e.target.value);
    pipelines[0].coneSource.set({ [propertyName]: value });
    pipelines[1].coneSource.set({ [propertyName]: value });
    renderWindow.render();
  });
});

document.querySelector('.capping').addEventListener('change', (e) => {
  const capping = !!e.target.checked;
  pipelines[0].coneSource.set({ capping });
  pipelines[1].coneSource.set({ capping });
  renderWindow.render();
});

const centerElems = document.querySelectorAll('.center');
const directionElems = document.querySelectorAll('.direction');

function updateTransformedCone() {
  /*console.log(pipelines[1].actor.getCenter());
  console.log(pipelines[1].actor.getPosition());
  console.log(pipelines[1].actor.getOrigin());*/
  const center = [0, 0, 0];
  const direction = [1, 0, 0];
  for (let i = 0; i < 3; i++) {
    center[Number(centerElems[i].dataset.index)] = Number(centerElems[i].value);
    direction[Number(directionElems[i].dataset.index)] = Number(
      directionElems[i].value
    );
  }
  console.log('updateTransformedCone', center, direction);
  pipelines[1].coneSource.set({ center, direction });
  renderWindow.render();
  /*console.log(pipelines[1].actor.getCenter());
  console.log(pipelines[1].actor.getPosition());
  console.log(pipelines[1].actor.getOrigin());*/
}

for (let i = 0; i < 3; i++) {
  centerElems[i].addEventListener('input', updateTransformedCone);
  directionElems[i].addEventListener('input', updateTransformedCone);
}

// -----------------------------------------------------------
// Make some variables global so that you can inspect and
// modify objects in your browser's developer console:
// -----------------------------------------------------------

global.pipelines = pipelines;
global.renderer = renderer;
global.renderWindow = renderWindow;
