import type { EdgeImpulseModule } from "src/edge-impulse";

// Initialize the WebAssembly module
declare const Module: EdgeImpulseModule;

let classifierInitialized = false;

Module.onRuntimeInitialized = function () {
  classifierInitialized = true;
};

export class EdgeImpulseClassifier {
  _initialized = false;

  async init() {
    if (classifierInitialized) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      Module.onRuntimeInitialized = () => {
        classifierInitialized = true;
        Module.init();
        resolve();
      };
    });
  }

  classify(rawData: Float32Array, debug = false) {
    if (!classifierInitialized) {
      throw new Error("Module is not initialized");
    }

    const obj = this._arrayToHeap(rawData);
    const ret = Module.run_classifier(
      obj.buffer.byteOffset,
      rawData.length,
      debug
    );
    Module._free(obj.ptr);

    if (ret.result !== 0) {
      throw new Error(`Classification failed (err code: ${ret.result})`);
    }

    const jsResult = {
      anomaly: ret.anomaly,
      results: [],
    };

    for (let cx = 0; cx < ret.size(); cx++) {
      const c = ret.get(cx);
      jsResult.results.push({
        label: c.label,
        value: c.value,
        x: c.x,
        y: c.y,
        width: c.width,
        height: c.height,
      });
      c.delete();
    }

    ret.delete();

    return jsResult;
  }

  getProperties() {
    if (!classifierInitialized) {
      throw new Error("Module is not initialized");
    }
    return Module.get_properties();
  }

  _arrayToHeap(data: Float32Array) {
    const typedArray = new Float32Array(data);
    const numBytes = typedArray.length * typedArray.BYTES_PER_ELEMENT;
    const ptr = Module._malloc(numBytes);
    const heapBytes = new Uint8Array(Module.HEAPU8.buffer, ptr, numBytes);
    heapBytes.set(new Uint8Array(typedArray.buffer));
    return { ptr, buffer: heapBytes };
  }
}
