import api from "./client";

/**
 * List purchase orders
 *
 * Supports:
 * status
 * search
 * supplier_id
 * branch_id
 */
export async function listPurchaseOrders(params = {}) {
  const { data } = await api.get("purchase-orders/", {
    params,
  });

  return data;
}

/**
 * Get single purchase order
 */
export async function getPurchaseOrder(poId) {
  const { data } = await api.get(`purchase-orders/${poId}/`);

  return data;
}

/**
 * Search existing products for PO
 *
 * Supports:
 * barcode
 * short_description
 * location
 */
export async function searchProductsForPurchaseOrder(params = {}) {
  const { data } = await api.get("purchase-orders/products/search/", {
    params,
  });

  return data;
}

/**
 * Create Purchase Order
 */
export async function createPurchaseOrder(payload) {
  const { data } = await api.post("purchase-orders/create/", payload);

  return data;
}

/**
 * Confirm / order PO
 */
export async function orderPurchaseOrder(poId) {
  const { data } = await api.post(`purchase-orders/${poId}/order/`);

  return data;
}

/**
 * Receive products
 */
export async function receivePurchaseOrder(poId, payload) {
  const { data } = await api.post(`purchase-orders/${poId}/receive/`, payload);

  return data;
}

/**
 * Receiving history
 */
export async function getReceivingHistory(poId) {
  const { data } = await api.get(`purchase-orders/${poId}/receiving-history/`);

  return data;
}
