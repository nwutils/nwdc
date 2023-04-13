# nwdc

Simple script and binary to display Node.js and Chromium console messages in the terminal, when launching NW.js applications
from the Windows command line.

Normally, when running the NW.js SDK in Windows, the `nw` executable immediately forks a new process and quits. This prevents being
able to monitor the terminal for console logs or other messages from Chromium. When launching an NW.js application via `nwdc`,
a wrapper process is kept running that will display output from the main Node.js process and all spawned Chromium windows.


### Usage For Development Environment (With Node.js Installed)

1. Install the NW.js SDK:

    a. Add `nw@0.60.0-sdk` (choose the desired version) to the `package.json` file of the NW.js application being developed.

    b. Download the SDK from https://nwjs.io/downloads/ and extract it to a directory within the `PATH` environment variable.

2. Add `nwdc` to the NW.js application being developed:

    **npm:**
    ```sh
    npm i nwdc
    ```

    **Yarn:**
    ```sh
    yarn add nwdc
    ```

3. Run the NW.js application using `npx nwdc .` instead of `nw .`.

4. Press CTRL+C or close your NW.js application normally, to stop the `nwdc.exe` process.


### Usage For Production Environment (Without Node.js Installed)

1. Download the SDK from https://nwjs.io/downloads/ and extract it to a directory within the `PATH` environment variable.

2. Download a pre-built `nwdc.exe` binary from [Releases](https://github.com/nwutils/nwdc/releases) or build one manually: `npm i && npm run build` or `yarn && yarn build`

    **NOTE:** It is useful to copy the `nwdc.exe` file to the same directory as NW.js, so it can be executed without providing the
    full path.

3. Run your NW.js application using `nwdc` instead of `nw`.

    *Example #1* -- From NW.js application directory when `nwdc.exe` is not in `PATH`:

    ```cmd
    C:\Users\Me\Downloads\nwdc.exe .
    ```

    *Example #2* -- From external directory when `nwdc.exe` *is* in `PATH`:

    ```cmd
    nwdc C:\Users\Me\Documents\Code\MyApp\
    ```

4. Press CTRL+C or close your NW.js application normally, to stop the `nwdc.exe` process.


### Modify `nw.exe` to change the Windows Subsystem Type

As an alternative to `nwdc`, any hex editor can be used to modify byte `0xD4` of the `nw.exe` binary to change the Windows Subsystem type from
`02` (IMAGE_SUBSYSTEM_WINDOWS_GUI) to `03` (IMAGE_SUBSYSTEM_WINDOWS_CUI). A quick Node.js script to accomplish this is the following:

```js
const { openSync, writeSync, closeSync } = require('node:fs');
const fd = openSync('nw.exe', 'r+');
writeSync(fd, '\x03', 0xd4, 'binary');
closeSync(fd);
```
