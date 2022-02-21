# Running List of Engine Bugs I found

## Scene Loading / Unloading (in tileset PR)
- Loading the same scene again causes the camera to disappear
    - Need a callback when scene is finished being deleted so that we don't accidentally delete the newly loaded gameobjects