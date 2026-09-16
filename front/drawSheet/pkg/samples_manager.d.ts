/* tslint:disable */
/* eslint-disable */

export class GestureWrapper {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static new(wrapped_points: PointWrapper[], name: string): GestureWrapper;
}

export class GesturesManager {
    free(): void;
    [Symbol.dispose](): void;
    add_gesture(name: string): void;
    add_stroke_point(x: number, y: number): void;
    end_gesture(): void;
    end_stroke(): void;
    match_shape(shape: GestureWrapper): string | undefined;
    constructor(buffer_size: number);
    start_gesture(): void;
    start_stroke(x: number, y: number): void;
    take_gesture(name: string): GestureWrapper;
}

export class PointWrapper {
    free(): void;
    [Symbol.dispose](): void;
    constructor(x: number, y: number, stroke_id: number);
    readonly strokeId: number;
    readonly x: number;
    readonly y: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_gesturesmanager_free: (a: number, b: number) => void;
    readonly __wbg_gesturewrapper_free: (a: number, b: number) => void;
    readonly __wbg_pointwrapper_free: (a: number, b: number) => void;
    readonly gesturesmanager_add_gesture: (a: number, b: number, c: number) => void;
    readonly gesturesmanager_add_stroke_point: (a: number, b: number, c: number) => void;
    readonly gesturesmanager_end_gesture: (a: number) => void;
    readonly gesturesmanager_end_stroke: (a: number) => void;
    readonly gesturesmanager_match_shape: (a: number, b: number) => [number, number];
    readonly gesturesmanager_new: (a: number) => number;
    readonly gesturesmanager_start_gesture: (a: number) => void;
    readonly gesturesmanager_start_stroke: (a: number, b: number, c: number) => void;
    readonly gesturesmanager_take_gesture: (a: number, b: number, c: number) => number;
    readonly gesturewrapper_new: (a: number, b: number, c: number, d: number) => number;
    readonly pointwrapper_new: (a: number, b: number, c: number) => number;
    readonly pointwrapper_strokeId: (a: number) => number;
    readonly pointwrapper_x: (a: number) => number;
    readonly pointwrapper_y: (a: number) => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
