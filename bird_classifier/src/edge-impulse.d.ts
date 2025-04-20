declare var Module: EdgeImpulseModule;

interface EdgeImpulseModule {
  onRuntimeInitialized: () => void;
  run_classifier(
    dataPtr: number,
    dataLength: number,
    debug: boolean
  ): EdgeImpulseResult;
  init(): void;
  get_properties(): EdgeImpulseProperties;
  _malloc(size: number): number;
  _free(ptr: number): void;
  HEAPU8: Uint8Array;
  HEAPF32: Float32Array;
}

interface EdgeImpulseResult {
  result: number;
  anomaly: number;
  size(): number;
  get(index: number): EdgeImpulseResultItem;
  delete(): void;
  visual_ad_max?: number;
  visual_ad_mean?: number;
  visual_ad_grid_cells_size?(): number;
  visual_ad_grid_cells_get?(index: number): EdgeImpulseResultGridCell;
  object_tracking_size?(): number;
  object_tracking_get?(index: number): EdgeImpulseResultTrackingItem;
}

interface EdgeImpulseResultItem {
  label: string;
  value: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  delete(): void;
}

interface EdgeImpulseResultGridCell {
  label: string;
  value: number;
  x: number;
  y: number;
  width: number;
  height: number;
  delete(): void;
}

interface EdgeImpulseResultTrackingItem extends EdgeImpulseResultItem {
  object_id: number;
}

interface EdgeImpulseProperties {
  model_type:
    | "classification"
    | "regression"
    | "object_detection"
    | "constrained_object_detection";
  has_visual_anomaly_detection: boolean;
  has_object_tracking: boolean;
  input_features_count: number;
  frequency: number;
  project_id: number;
  project_owner: string;
  project_name: string;
  input_width?: number;
  input_height?: number;
  input_frames?: number;
  dsp_input_frame_size?: number;
  interval_ms?: number;
  label_count?: number;
  labels?: string[];
  model_parameters?: { [key: string]: any };
}

export class EdgeImpulseClassifier {
  _initialized: boolean;
  init(): Promise<void>;
  classify(rawData: Float32Array, debug?: boolean): EdgeImpulseClassifierResult;
  getProperties(): EdgeImpulseProperties;
  _arrayToHeap(data: Float32Array): {
    ptr: number;
    buffer: Uint8Array;
  };
}

interface EdgeImpulseClassifierResult {
  anomaly: number;
  results: {
    label: string;
    value: number;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  }[];
  visual_ad_grid_cells?: {
    label: string;
    value: number;
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
  visual_ad_max?: number;
  visual_ad_mean?: number;
  object_tracking_results?: {
    object_id: number;
    label: string;
    value: number;
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
}
