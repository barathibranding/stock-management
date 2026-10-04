import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/Layout";
import { listPurchaseOrders } from "../../api/purchaseOrders";
import { getErrorMessage } from "../../utils/Errors";

export default function ListPurchaseOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [branchId, setBranchId] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      if (status) {
        params.status = status;
      }

      if (supplierId) {
        params.supplier_id = supplierId;
      }

      if (branchId) {
        params.branch_id = branchId;
      }

      const data = await listPurchaseOrders(params);

      setOrders(data?.results || data || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, [status, supplierId, branchId]);

  function handleSearch(event) {
    event.preventDefault();
    loadOrders();
  }

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Purchase Orders</h1>

          <p className="text-muted mb-0">
            Manage purchase orders and receiving.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate("/purchase-orders/create")}
        >
          + Create Purchase Order
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row className="g-2">
              <Col lg={6}>
                <InputGroup>
                  <Form.Control
                    placeholder="Search PO number or supplier..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  <Button type="submit">Search</Button>
                </InputGroup>
              </Col>

              <Col lg={3}>
                <Form.Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="ordered">Ordered</option>
                  <option value="partially_received">Partially Received</option>
                  <option value="fully_received">Fully Received</option>
                </Form.Select>
              </Col>

              <Col lg={3}>
                <Button
                  type="button"
                  variant="outline-secondary"
                  className="w-100"
                  onClick={() => {
                    setSearch("");
                    setStatus("");
                    setSupplierId("");
                    setBranchId("");
                    setTimeout(loadOrders, 0);
                  }}
                >
                  Reset Filters
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center text-muted py-5">
              No purchase orders found.
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover responsive className="align-middle">
                <thead>
                  <tr>
                    <th>PO Number</th>
                    <th>Supplier</th>
                    <th>Branch</th>
                    <th>PO Date</th>
                    <th>Products</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((po) => (
                    <tr key={po.id}>
                      <td>
                        <strong>{po.po_number}</strong>
                      </td>

                      <td>{po.supplier_name || "—"}</td>

                      <td>{po.branch_name || "—"}</td>

                      <td>{po.po_date || "—"}</td>

                      <td>{po.total_products ?? "—"}</td>

                      <td>{po.total_quantity ?? "—"}</td>

                      <td>
                        <StatusBadge status={po.status} />
                      </td>

                      <td className="text-end">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => navigate(`/purchase-orders/${po.id}`)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Layout>
  );
}

function StatusBadge({ status }) {
  const config = {
    draft: "secondary",
    ordered: "primary",
    partially_received: "warning",
    fully_received: "success",
  };

  return (
    <span className={`badge bg-${config[status] || "secondary"}`}>
      {String(status || "")
        .replaceAll("_", " ")
        .toUpperCase()}
    </span>
  );
}
