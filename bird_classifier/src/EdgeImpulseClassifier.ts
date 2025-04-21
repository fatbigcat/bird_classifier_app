import type { EdgeImpulseModule, EdgeImpulseClassifierResult } from "src/edge-impulse";

// Initialize the WebAssembly module
declare const Module: EdgeImpulseModule;

export class EdgeImpulseClassifier {
  private _initialized = false;
  private readonly REQUIRED_SAMPLES = 48000;

  async init() {
    if (this._initialized) {
      return Promise.resolve();
    }

    // If Module is already loaded, resolve immediately
    if ((Module as any).asm) {
      this._initialized = true;
      Module.init();
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      const existingCallback = Module.onRuntimeInitialized;
      
      Module.onRuntimeInitialized = () => {
        try {
          // Call any existing callback first
          if (existingCallback) {
            existingCallback();
          }
          
          this._initialized = true;
          Module.init();
          resolve();
        } catch (err) {
          reject(err);
        }
      };
    });
  }

  classify(rawData: Float32Array, debug = false): EdgeImpulseClassifierResult {
    if (!this._initialized) {
      throw new Error("Module is not initialized");
    }

    if (!(rawData instanceof Float32Array)) {
      throw new Error("Input must be Float32Array");
    }

    if (rawData.length !== this.REQUIRED_SAMPLES) {
      throw new Error(`Input must be exactly ${this.REQUIRED_SAMPLES} samples, got ${rawData.length}`);
    }

    // Validate data range is within [-1, 1]
    for (let i = 0; i < rawData.length; i++) {
      if (Math.abs(rawData[i]) > 1) {
        throw new Error("Input data must be normalized between -1 and 1");
      }
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

    const jsResult: EdgeImpulseClassifierResult = {
      anomaly: ret.anomaly,
      results: [],
    };

    // Process all classifications and format them as expected
    for (let cx = 0; cx < ret.size(); cx++) {
      const c = ret.get(cx);
      jsResult.results.push({
        label: c.label,
        value: c.value
      });
      c.delete();
    }

    ret.delete();
    return jsResult;
  }

  getProperties() {
    if (!this._initialized) {
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
