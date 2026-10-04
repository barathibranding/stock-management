import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import Layout from "../../components/Layout";
import {
  getPurchaseOrder,
  receivePurchaseOrder,
} from "../../api/purchaseOrders";
import { getErrorMessage } from "../../utils/Errors";

export default function ReceivePurchaseOrder() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [po, setPo] = useState(null);
  const [receiptDate, setReceiptDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [remarks, setRemarks] = useState("");

  const [quantities, setQuantities] = useState({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadPO() {
    try {
      setLoading(true);

      const data = await getPurchaseOrder(id);

      setPo(data);

      const initial = {};

      (data.items || []).forEach((item) => {
        initial[item.id] = 0;
      });

      setQuantities(initial);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPO();
  }, [id]);

  function updateQuantity(itemId, value) {
    setQuantities((previous) => ({
      ...previous,
      [itemId]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const receivingItems = (po.items || [])
      .map((item) => ({
        purchase_order_item: item.id,
        quantity: Number(quantities[item.id] || 0),
      }))
      .filter((item) => item.quantity > 0);

    if (receivingItems.length === 0) {
      setError("Enter quantity for at least one product.");
      return;
    }

    for (const received of receivingItems) {
      const originalItem = po.items.find(
        (item) => item.id === received.purchase_order_item,
      );

      if (received.quantity > Number(originalItem.pending_quantity)) {
        setError(
          `Received quantity cannot exceed pending quantity for ${originalItem.barcode}.`,
        );
        return;
      }
    }

    try {
      setSaving(true);
      setError("");

      await receivePurchaseOrder(id, {
        receipt_date: receiptDate,
        remarks,
        items: receivingItems,
      });

      navigate(`/purchase-orders/${id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
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
      <div className="mb-4">
        <h1 className="h3 mb-1">Receive Shipment</h1>

        <p className="text-muted mb-0">
          PO: <strong>{po.po_number}</strong>
        </p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body>
            <Row className="g-3">
              <Col md={4}>
                <Form.Label>Receipt Date</Form.Label>

                <Form.Control
                  type="date"
                  value={receiptDate}
                  onChange={(e) => setReceiptDate(e.target.value)}
                  required
                />
              </Col>

              <Col md={8}>
                <Form.Label>Remarks</Form.Label>

                <Form.Control
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="First shipment received"
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="border-0 shadow-sm">
          <Card.Body>
            <h5 className="mb-3">Products to Receive</h5>

            <div className="table-responsive">
              <Table bordered hover className="align-middle">
                <thead>
                  <tr>
                    <th>Barcode</th>
                    <th>Description</th>
                    <th>Ordered</th>
                    <th>Already Received</th>
                    <th>Pending</th>
                    <th>Receive Now</th>
                  </tr>
                </thead>

                <tbody>
                  {(po.items || []).map((item) => (
                    <tr key={item.id}>
                      <td>{item.barcode}</td>

                      <td>{item.short_description}</td>

                      <td>{item.quantity}</td>

                      <td>{item.received_quantity}</td>

                      <td>
                        <strong>{item.pending_quantity}</strong>
                      </td>

                      <td style={{ width: 160 }}>
                        <Form.Control
                          type="number"
                          min="0"
                          max={item.pending_quantity}
                          value={quantities[item.id] ?? 0}
                          onChange={(e) =>
                            updateQuantity(item.id, e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => navigate(`/purchase-orders/${id}`)}
              >
                Cancel
              </Button>

              <Button type="submit" variant="success" disabled={saving}>
                {saving ? "Saving Receipt..." : "Save Receipt"}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Form>
    </Layout>
  );
}
