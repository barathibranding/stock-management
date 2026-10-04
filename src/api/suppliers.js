import api from "./client";

/**
 * List suppliers
 *
 * params:
 * search
 * status
 */
export async function listSuppliers(params = {}) {
  const { data } = await api.get("suppliers/", {
    params,
  });

  return data;
}

/**
 * Get single supplier
 */
export async function getSupplier(supplierId) {
  const { data } = await api.get(`suppliers/${supplierId}/`);

  return data;
}

/**
 * Create supplier
 */
export async function createSupplier(supplierData) {
  const { data } = await api.post("suppliers/", supplierData);

  return data;
}

/**
 * Update supplier
 */
export async function updateSupplier(supplierId, supplierData) {
  const { data } = await api.patch(`suppliers/${supplierId}/`, supplierData);

  return data;
}

/**
 * Activate / Deactivate supplier
 */
export async function updateSupplierStatus(supplierId, status) {
  const { data } = await api.patch(`suppliers/${supplierId}/status/`, {
    status,
  });

  return data;
}

/**
 * Delete supplier
 *
 * Use only if your backend supports DELETE.
 */
export async function deleteSupplier(supplierId) {
  const { data } = await api.delete(`suppliers/${supplierId}/`);

  return data;
}
