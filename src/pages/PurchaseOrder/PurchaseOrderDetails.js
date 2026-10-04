import React, { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Row, Spinner, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import Layout from "../../components/Layout";
import { getPurchaseOrder, orderPurchaseOrder } from "../../api/purchaseOrders";
import { getErrorMessage } from "../../utils/Errors";

export default function PurchaseOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [po, setPo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [error, setError] = useState("");

  async function loadPO() {
    try {
      setLoading(true);

      const data = await getPurchaseOrder(id);

      setPo(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPO();
  }, [id]);

  async function handleOrder() {
    const confirmed = window.confirm(
      "Are you sure you want to confirm this Purchase Order?",
    );

    if (!confirmed) return;

    try {
      setOrdering(true);
      setError("");

      await orderPurchaseOrder(id);

      await loadPO();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setOrdering(false);
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      </Layout>
    );
  }

  if (!po) {
    return (
      <Layout>
        <Alert variant="danger">Purchase order not found.</Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">{po.po_number}</h1>

          <p className="text-muted mb-0">Purchase Order Details</p>
        </div>

        <div className="d-flex gap-2">
          {po.status === "draft" && (
            <Button variant="primary" onClick={handleOrder} disabled={ordering}>
              {ordering ? "Confirming..." : "Confirm / Order PO"}
            </Button>
          )}

          {["ordered", "partially_received"].includes(po.status) && (
            <Button
              variant="success"
              onClick={() => navigate(`/purchase-orders/${po.id}/receive`)}
            >
              Receive Shipment
            </Button>
          )}

          <Button
            variant="outline-primary"
            onClick={() =>
              navigate(`/purchase-orders/${po.id}/receiving-history`)
            }
          >
            Receiving History
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="g-3 mb-4">
        <Col md={3}>
          <InfoCard label="Supplier" value={po.supplier_name} />
        </Col>

        <Col md={3}>
          <InfoCard label="Branch" value={po.branch_name} />
        </Col>

        <Col md={2}>
          <InfoCard label="PO Date" value={po.po_date} />
        </Col>

        <Col md={2}>
          <InfoCard label="Expected" value={po.expected_delivery_date || "—"} />
        </Col>

        <Col md={2}>
          <InfoCard label="Status" value={<StatusBadge status={po.status} />} />
        </Col>
      </Row>

      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <h5 className="mb-3">Purchase Order Items</h5>

          <div className="table-responsive">
            <Table bordered hover className="align-middle">
              <thead>
                <tr>
                  <th>Barcode</th>
                  <th>Description</th>
                  <th>Location</th>
                  <th>Ordered</th>
                  <th>Received</th>
                  <th>Pending</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {(po.items || []).map((item) => (
                  <tr key={item.id}>
                    <td>{item.barcode}</td>

                    <td>{item.short_description}</td>

                    <td>{item.location}</td>

                    <td>{item.quantity}</td>

                    <td>{item.received_quantity}</td>

                    <td>
                      <strong>{item.pending_quantity}</strong>
                    </td>

                    <td>{item.purchase_price}</td>

                    <td>{item.total_amount}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Row>
            <Col md={3}>
              <strong>Total Products</strong>
              <div className="fs-4">{po.total_products}</div>
            </Col>

            <Col md={3}>
              <strong>Total Quantity</strong>
              <div className="fs-4">{po.total_quantity}</div>
            </Col>

            <Col md={3}>
              <strong>Total Received</strong>
              <div className="fs-4 text-success">
                {po.total_received_quantity}
              </div>
            </Col>

            <Col md={3}>
              <strong>Total Amount</strong>
              <div className="fs-4">{po.total_amount}</div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Button
        className="mt-3"
        variant="outline-secondary"
        onClick={() => navigate("/purchase-orders")}
      >
        ← Back to Purchase Orders
      </Button>
    </Layout>
  );
}

function InfoCard({ label, value }) {
  return (
    <Card className="border-0 shadow-sm h-100">
      <Card.Body>
        <div className="text-muted small">{label}</div>

        <div className="fw-semibold mt-1">{value || "—"}</div>
      </Card.Body>
    </Card>
  );
}

function StatusBadge({ status }) {
  const colors = {
    draft: "secondary",
    ordered: "primary",
    partially_received: "warning",
    fully_received: "success",
  };

  return (
    <span className={`badge bg-${colors[status] || "secondary"}`}>
      {String(status || "")
        .replaceAll("_", " ")
        .toUpperCase()}
    </span>
  );
}
