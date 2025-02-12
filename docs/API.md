# Canvas API Documentation

## API Versions

The Canvas API currently has two versions:

- V2 (Current) - Recommended for all new integrations
- V1 (Deprecated) - Will be removed in the future, please migrate to V2

> [!NOTE]
> To ensure backwards compatibility, route `/api` automatically redirects to the `/api/v1` endpoint.

## V2 API Endpoints

### Get All Builds

`GET /api/v2/builds`

Returns a list of all Canvas builds.

**Query Parameters:**

- `minecraft_version` (optional): Filter builds by Minecraft version
- `experimental` (optional): Set to "true" to include experimental builds

**Example Response:**

```json
[
  {
    "buildNumber": 105,
    "url": "https://jenkins.canvasmc.io/job/Canvas/105/",
    "downloadUrl": "https://jenkins.canvasmc.io/job/Canvas/105/artifact/canvas-server/build/libs/canvas-build.105.jar",
    "minecraftVersion": "1.21.4",
    "timestamp": 1738480994680,
    "isExperimental": true,
    // DEPRECATED: This field will be removed in the future
    // "commit": {
    //   "message": "Fix virtual threads with async scheduler",
    //   "hash": "992e20e655924f3c8d180567a307da78c9d4633f"
    // }
    "commits": [
      {
        "message": "Fix virtual threads with async scheduler",
        "hash": "992e20e655924f3c8d180567a307da78c9d4633f"
      }
    ]
  },
  ...
]
```

### Get Latest Build

`GET /api/v2/builds/latest`

Returns information about the latest Canvas build.

**Query Parameters:**

- `experimental` (optional): Set to "true" to get the latest experimental build

**Example Response:**

```json
{
  "buildNumber": 105,
  "url": "https://jenkins.canvasmc.io/job/Canvas/105/",
  "downloadUrl": "https://jenkins.canvasmc.io/job/Canvas/105/artifact/canvas-server/build/libs/canvas-build.105.jar",
  "minecraftVersion": "1.21.4",
  "timestamp": 1738480994680,
  "isExperimental": true,
  // DEPRECATED: This field will be removed in the future
  // "commit": {
  //   "message": "Fix virtual threads with async scheduler",
  //   "hash": "992e20e655924f3c8d180567a307da78c9d4633f"
  // }
  "commits": [
    {
      "message": "Fix virtual threads with async scheduler",
      "hash": "992e20e655924f3c8d180567a307da78c9d4633f"
    }
  ]
}
```

## V1 API Endpoints

As of today, the V1 API is still available, but it is deprecated and will be removed in the future.
[Here](https://github.com/CraftCanvasMC/Website/blob/bd804056306e713da89ebe56132e58702119ba4a/api/DOCUMENTATION.md) is the documentation for the V1 API.
