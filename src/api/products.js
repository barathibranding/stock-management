import api from "./client";

/**
 * Get product list
 *
 * Supports:
 * search
 * location
 * branch_id
 * ordering
 * page
 * page_size
 */
export async function listProducts(params = {}) {
  const { data } = await api.get("products/", {
    params,
  });

  return data;
}

/**
 * Get single product
 */
export async function getProduct(productId) {
  const { data } = await api.get(`products/${productId}/`);

  return data;
}

/**
 * Create product
 */
export async function createProduct(productData) {
  const { data } = await api.post("products/", productData);

  return data;
}

/**
 * Update product
 */
export async function updateProduct(productId, productData) {
  const { data } = await api.put(`products/${productId}/`, productData);

  return data;
}

/**
 * Partial update
 */
export async function patchProduct(productId, productData) {
  const { data } = await api.patch(`products/${productId}/`, productData);

  return data;
}

/**
 * Delete one product
 */
export async function deleteProduct(productId) {
  const { data } = await api.delete(`products/${productId}/`);

  return data;
}

/**
 * Bulk delete
 */
export async function bulkDeleteProducts(ids) {
  const { data } = await api.post("products/bulk-delete/", {
    ids,
  });

  return data;
}

/**
 * Bulk Excel import
 */
export async function importProducts(file) {
  const formData = new FormData();

  formData.append("file", file);

  const { data } = await api.post("products/bulk-import/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}

/**
 * Export products to Excel
 */
export async function exportProducts(params = {}) {
  const response = await api.get("products/export/", {
    params,
    responseType: "blob",
  });

  return response;
}
