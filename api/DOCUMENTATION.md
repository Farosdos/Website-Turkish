# API Documentation

The CanvasMC web-based API utilizes php 8.2 to provide ease-of-access to artifacts of the Canvas production system. Bellow is a listing of the current API capabilities

- https://canvasmc.io/api/latest - Fetches and downloads the latest canvas jar avalible on the jenkins page.
- https://canvasmc.io/api/builds - Returns a JSON-formatted version of all builds avalible for Canvas
- https://canvasmc.io/api/specific<args> - Returns all avalible builds applicable to the arguments provided. Such as `ver`(minecraft version) and `experimental`(boolean to toggle experimental builds)