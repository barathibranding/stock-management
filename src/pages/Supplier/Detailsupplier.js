import React, { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Row, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import Layout from "../../components/Layout";
import { getSupplier, updateSupplierStatus } from "../../api/suppliers";
import { getErrorMessage } from "../../utils/Errors";

export default function Detailsupplier() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadSupplier() {
    try {
      setLoading(true);

      const data = await getSupplier(id);

      setSupplier(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSupplier();
  }, [id]);

  async function toggleStatus() {
    try {
      const newStatus = supplier.status === "active" ? "inactive" : "active";

      await updateSupplierStatus(supplier.id, newStatus);

      loadSupplier();
    } catch (err) {
      setError(getErrorMessage(err));
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

  if (!supplier) {
    return (
      <Layout>
        <Alert variant="danger">Supplier not found.</Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Supplier Details</h1>

          <p className="text-muted mb-0">View supplier information.</p>
        </div>

        <div className="d-flex gap-2">
          <Button
            variant="outline-primary"
            onClick={() => navigate(`/suppliers/${id}/edit`)}
          >
            Edit
          </Button>

          <Button
            variant={
              supplier.status === "active"
                ? "outline-danger"
                : "outline-success"
            }
            onClick={toggleStatus}
          >
            {supplier.status === "active" ? "Deactivate" : "Activate"}
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="g-3">
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="mb-4">Supplier Information</h5>

              <Row className="g-4">
                <Col md={6}>
                  <div className="text-muted small">Supplier Name</div>

                  <div className="fw-semibold">{supplier.supplier_name}</div>
                </Col>

                <Col md={6}>
                  <div className="text-muted small">Location</div>

                  <div className="fw-semibold">
                    {supplier.supplier_location || "—"}
                  </div>
                </Col>

                <Col md={6}>
                  <div className="text-muted small">Status</div>

                  <span
                    className={`badge ${
                      supplier.status === "active"
                        ? "bg-success"
                        : "bg-secondary"
                    }`}
                  >
                    {supplier.status}
                  </span>
                </Col>

                <Col md={6}>
                  <div className="text-muted small">Supplier ID</div>

                  <div className="fw-semibold">{supplier.id}</div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Button
        className="mt-3"
        variant="outline-secondary"
        onClick={() => navigate("/suppliers")}
      >
        ← Back to Suppliers
      </Button>
    </Layout>
  );
}
