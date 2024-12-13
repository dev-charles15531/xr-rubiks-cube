import * as BABYLON from "@babylonjs/core";

/**
 * Transforms a vector from the local space of a mesh to world space.
 * If the vector is a normal, it is transformed with TransformNormal.
 * Otherwise, it is transformed with TransformCoordinates.
 * @param vectorLocal The vector to transform.
 * @param mesh The mesh to transform from.
 * @param normal Whether the vector is a normal.
 * @returns The transformed vector.
 */
export function toWorld(vectorLocal: BABYLON.Vector3, mesh: BABYLON.TransformNode, normal: boolean = false) {
    if (normal) return BABYLON.Vector3.TransformNormal(vectorLocal, mesh.getWorldMatrix());
    return BABYLON.Vector3.TransformCoordinates(vectorLocal, mesh.getWorldMatrix());
}

/**
 * Transforms a vector from world space to the local space of a mesh.
 * If the vector is a normal, it is transformed with TransformNormal.
 * Otherwise, it is transformed with TransformCoordinates.
 * @param vectorWorld The vector to transform.
 * @param mesh The mesh to transform to.
 * @param normal Whether the vector is a normal.
 * @param matrix An optional matrix to use for the transformation. If not provided, a new matrix is created.
 * @returns The transformed vector.
 */
export function toLocal(vectorWorld: BABYLON.Vector3, mesh: BABYLON.TransformNode, normal: boolean = false, matrix: BABYLON.Matrix | null = null) {
    if (!matrix) {
        matrix = new BABYLON.Matrix();
    }
    mesh.getWorldMatrix().invertToRef(matrix);
    if (normal) return BABYLON.Vector3.TransformNormal(vectorWorld, matrix);
    return BABYLON.Vector3.TransformCoordinates(vectorWorld, matrix);
}