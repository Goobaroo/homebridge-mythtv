# MythTV Plugin for Homebridge

Use the status of your Myth Frontend as a sensor in Hombridge.  Use to enable lighting while watching a video and then resume normal lighting when stopped.

The plugin uses the MythTV API - [API documentation](https://www.mythtv.org/wiki/Services_API)

## Installation

Requires Homebridge, see the [project documetation](https://github.com/nfarina/homebridge) for more information.

```bash
npm install -g homebridge-mythtv
```

## Configuration

The plugin supports the following config:

Required | Variable | Description
-------- | -------- | -----------
* | `accessory` | Must be MythTV
* | `name` | Description of the frontend.
* | `frontend` | The IP Address of your frontend, will default to localhost if excluded
  | `port` | The port that your frontend API is listening on, defaults to 6547 - Unless you changed the port you shouldn't need it.

Config example:
```json
{
   "accessories":[
      {
        "accessory": "MythTV",
        "name": "Theatre",
        "frontend": "192.168.1.1"
      }
   ]
}
```

