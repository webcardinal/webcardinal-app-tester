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
      this.attachVideoSelect(devices);
    } catch (error) {
      console.log("ZoomController [video select]", error);
    }

    try {
      this.attachZoomInput(stream, track)
    } catch (error) {
      console.log("ZoomController [video zoom]", error);
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
        `Don't forget to check: "chrome://media-internals"`
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
  attachZoomInput = (stream, track) => {
    const settings = track.getSettings();

    if (!("zoom" in settings)) {
      throw Error(`Zoom is not supported by ${track.label}!`);
    }

    this.removeRef("pan-tilt-zoom");

    const capabilities = track.getCapabilities();

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

    this.element.append(zoomInputRange);

    this.addRef("pan-tilt-zoom", zoomInputRange);
  };

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
