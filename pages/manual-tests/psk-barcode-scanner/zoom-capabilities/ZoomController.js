import { setVideoStream } from "./psk-barcode-scanner.utils.clone.js";

const { Controller } = WebCardinal.controllers;

class ZoomController extends Controller {
  constructor(...props) {
    super(...props);

    this.refs = {};
    this.activeDeviceId = undefined;

    console.log("ZoomController [ctor]", this.refs);

    setTimeout(this.executeFlow);
  }

  executeFlow = async () => {
    this.isLoading = true;

    let stream,
      track,
      devices = [];

    try {
      devices = await this.getVideoDevices();
    } catch (error) {
      console.log("ZoomController [list devices]", error);
    }

    if (devices.length === 0) {
      return;
    }

    try {
      [stream, track] = await this.getVideoStream(this.activeDeviceId);
      await this.attachToVideo(stream, track);
      this.activeDeviceId = track.getSettings().deviceId;
    } catch (error) {
      console.log("ZoomController [video stream]", error);
    }

    try {
      this.attachContainerCheckbox();
    } catch (error) {
      console.log("ZoomController [container options]", error);
    }

    try {
      this.attachVideoSelect(devices);
    } catch (error) {
      console.log("ZoomController [video select]", error);
    }

    try {
      this.attachVideoControls(track)
    } catch (error) {
      console.log("ZoomController [video controls]", error);
    }

    try {
      await Promise.all(
        devices.map(async (device) => {
          await this.attachMetadata(
            device.deviceId,
            JSON.stringify(device.toJSON(), null, 2)
          );
        })
      );
    } catch (error) {
      console.log("ZoomController [devices info]", error);
    }

    try {
      await this.attachMetadata(
        "media-internals",
        [
          `Don't forget to check: "chrome://media-internals"`,
          'Or use the following flag: --use-fake-device-for-media-stream, for Chromium base browsers'
        ].join('\n')
      );
    } catch (error) {
      console.log("ZoomController [media-internals metadata]", error);
    }

    try {
      const supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
      const metadata = [
        "// SupportedConstraints",
        JSON.stringify(supportedConstraints, null, 2),
      ].join("\n");
      await this.attachMetadata("supported-constraints", metadata);
    } catch (error) {
      console.log("ZoomController [supported constraints]", error);
    }

    try {
      const constraints = track.getConstraints();
      const settings = track.getSettings();
      const capabilities = track.getCapabilities();
      const metadata = [
        "// Capabilities",
        JSON.stringify(capabilities, null, 2),
        "// Constraints",
        JSON.stringify(constraints, null, 2),
        "// Settings",
        JSON.stringify(settings, null, 2),
      ].join("\n");
      await this.attachMetadata("track", metadata);
    } catch (error) {
      console.log("ZoomController [track metadata]", error);
    }

    this.isLoading = false;
  };

  /**
   *
   * @returns {Promise<InputDeviceInfo[]>}
   */
  getVideoDevices = async () => {
    this.removeRef("devices");

    if (!window.navigator) {
      throw new Error("Can't enumerate devices, navigator is not present.");
    }

    if (
      !window.navigator.mediaDevices &&
      navigator.mediaDevices.enumerateDevices
    ) {
      throw new Error("Can't enumerate devices, method not supported.");
    }

    const devices = await navigator.mediaDevices.enumerateDevices();

    const videoDevices = devices.filter(({ kind }) => kind === "videoinput");

    this.addRef("devices", videoDevices);

    return videoDevices;
  };

  /**
   *
   * @param [deviceId] {string}
   */
  getVideoStream = async (deviceId) => {
    const constraints = {
      audio: false,
      video: {
        facingMode: "environment",
        pan: true,
        tilt: true,
        zoom: true
      },
    };

    if (deviceId) {
      delete constraints.video.facingMode;
      constraints.video["deviceId"] = { exact: deviceId };
    }

    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    const tracks = stream.getVideoTracks();

    let device;

    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      if (track.readyState === "live") {
        device = track;
        break;
      }
    }

    const capabilities = device.getCapabilities();

    await device.applyConstraints({
      width: capabilities.width.max,
      height: capabilities.height.max,
      advanced: [{
        width: capabilities.width.max,
        height: capabilities.height.max,
      }]
    });

    return [stream, device];
  };

  /**
   * @param stream {MediaStream}
   * @param track {MediaStreamTrack}
   * @returns {Promise<void>}
   */
  attachToVideo = async (stream, track) => {
    this.removeRef("video");

    const settings = track.getSettings();

    const video = this.createElement("video", {
      width: settings.width,
      height: settings.height,
      autoplay: true,
      playsInline: true,
    });
    await setVideoStream(video, stream);

    this.element.append(video);

    this.addRef("video", video);
  };

  /**
   * @param id {string}
   * @param metadata {string}
   */
  attachMetadata = async (id, metadata) => {
    this.removeRef(`metadata.${id}`);

    const code = this.createElement("psk-code", {
      language: "JSON",
    });
    code.innerHTML = metadata;

    this.element.append(code);

    await code.componentOnReady();

    this.addRef(`metadata.${id}`, code);
  };

  /**
   *
   * @param devices {InputDeviceInfo[]}
   */
  attachVideoSelect = (devices) => {
    this.removeRef("select");

    const select = this.createElement("select");
    for (const device of devices) {
      const value = device.deviceId;
      const label = device.label || device.deviceId;
      select.append(this.createElement("option", { value, label }));
    }
    select.value = this.activeDeviceId;

    select.onchange = async (e) => {
      this.activeDeviceId = e.target.value;
      await this.executeFlow();
    };

    this.element.append(select);

    this.addRef("select", select);
  };

  /**
   * @param track {MediaStreamTrack}
   */
  attachVideoControls = (track) => {
    this.removeRef('zoom-pan-tilt');

    const settings = track.getSettings();
    const capabilities = track.getCapabilities();

    const advancedControls = this.createElement('div', {
      className: 'zoom-pan-tilt--container'
    })

    if ("zoom" in settings) {
      const zoomText = this.createElement('span', { innerText: 'Zoom' })
      const zoomInputRange = this.createElement("input", {
        type: "range",
        min: capabilities.zoom.min,
        max: capabilities.zoom.max,
        step: capabilities.zoom.step,
        value: settings.zoom,
      });
      zoomInputRange.oninput = async (e) => {
        try {
          await track.applyConstraints({ advanced: [{ zoom: e.target.value }] });
        } catch (error) {
          console.error("ZoomController [zoom constrains]", error);
        }
      };
      advancedControls.append(zoomText, zoomInputRange);
    }

    if ("pan" in settings) {
      const panText = this.createElement('span', { innerText: 'Pan' })
      const panInputRange = this.createElement("input", {
        type: "range",
        min: capabilities.pan.min,
        max: capabilities.pan.max,
        step: capabilities.pan.step,
        value: settings.pan,
      });
      panInputRange.oninput = async (e) => {
        try {
          await track.applyConstraints({ advanced: [{ pan: e.target.value }] });
        } catch (error) {
          console.error("ZoomController [pan constrains]", error);
        }
      };
      advancedControls.append(panText, panInputRange);
    }

    if ("tilt" in settings) {
      const tiltText = this.createElement('span', { innerText: 'Tilt' })
      const tiltInputRange = this.createElement("input", {
        type: "range",
        min: capabilities.tilt.min,
        max: capabilities.tilt.max,
        step: capabilities.tilt.step,
        value: settings.tilt,
      });
      tiltInputRange.oninput = async (e) => {
        try {
          await track.applyConstraints({ advanced: [{ tilt: e.target.value }] });
        } catch (error) {
          console.error("ZoomController [tilt constrains]", error);
        }
      };
      advancedControls.append(tiltText, tiltInputRange);
    }

    if (advancedControls.children.length > 0) {
      this.element.append(advancedControls);
    }


    this.addRef("zoom-pan-tilt", advancedControls);
  };

  attachContainerCheckbox = () => {
    this.removeRef('container-max-width');

    const container = this.createElement('div', {
      className: 'max-width--container'
    })

    container.innerHTML = `
        <div class="option">
          <input type="checkbox" ${this.element.classList.contains('max-width') ? 'checked' : ''} id="max-width" name="max-width">
          <label for="max-width"><code>max-width</code>of container</label>
        </div>
      `

    const checkbox = container.querySelector('input[type=checkbox]')
    checkbox.addEventListener('change', () => {
      this.element.classList.toggle('max-width');
    })

    this.element.append(container)

    this.addRef("container-max-width", container);
  }

  addRef = (id, htmlElement) => {
    this.refs[id] = htmlElement;
  };

  removeRef = (id) => {
    if (this.refs[id]) {
      if (this.refs[id].isConnected) {
        this.refs[id].remove();
      }
      delete this.refs[id];
    }
  };

  set isLoading(value) {
    this.element.hidden = value;
    this.element.previousElementSibling.hidden = !value;
  }
}

export default ZoomController;
