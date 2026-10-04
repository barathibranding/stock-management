import React, { useEffect, useState } from "react";
import { Alert, Badge, Button, Card, Col, Row, Spinner } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";

import Layout from "../../components/Layout";

import { getProduct, deleteProduct } from "../../api/products";

import { getErrorMessage } from "../../utils/Errors";

import "./Products.css";

export default function Deatilprodct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    loadProduct();
  }, [id]);

  async function loadProduct() {
    try {
      setLoading(true);
      setError("");

      const data = await getProduct(id);

      setProduct(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${product?.barcode}?`,
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await deleteProduct(id);

      navigate("/products");
    } catch (err) {
      setError(getErrorMessage(err));
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-5">
          <Spinner animation="border" />

          <div className="text-muted mt-2">Loading product...</div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <Alert variant="danger">Product not found.</Alert>
      </Layout>
    );
  }

  const variance = Number(product.variance || 0);

  return (
    <Layout>
      <div className="products-page">
        <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
          <div>
            <Link to="/products" className="text-decoration-none small">
              <i className="bi bi-arrow-left me-2"></i>
              Back to Products
            </Link>

            <h1 className="h3 mt-2 mb-1">Product Details</h1>

            <p className="text-muted mb-0">
              View complete product and stock information.
            </p>
          </div>

          <div className="d-flex gap-2">
            <Link to={`/products/${id}/edit`} className="btn btn-primary">
              <i className="bi bi-pencil me-2"></i>
              Edit
            </Link>

            <Button
              variant="outline-danger"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <i className="bi bi-trash me-2"></i>
                  Delete
                </>
              )}
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <Row className="g-3">
          <Col lg={8}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <div className="text-muted small mb-1">Barcode</div>

                    <h4 className="mb-1">{product.barcode}</h4>

                    <div className="text-muted">
                      {product.short_description || "No description"}
                    </div>
                  </div>

                  <Badge
                    bg={
                      variance === 0
                        ? "success"
                        : variance < 0
                          ? "danger"
                          : "warning"
                    }
                  >
                    Variance: {variance > 0 ? `+${variance}` : variance}
                  </Badge>
                </div>

                <Row className="g-4">
                  <Info label="Branch" value={product.branch_name || "—"} />

                  <Info label="Location" value={product.location || "—"} />

                  <Info
                    label="Cost Price"
                    value={`AED ${Number(product.cost_price || 0).toFixed(2)}`}
                  />

                  <Info
                    label="Selling Price"
                    value={`AED ${Number(product.selling_price || 0).toFixed(
                      2,
                    )}`}
                  />
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <h5 className="mb-4">Stock Information</h5>

                <StockValue label="Stock On Hand" value={product.stk_on_hand} />

                <StockValue
                  label="Physical Quantity"
                  value={product.physical_qty}
                />

                <StockValue
                  label="Variance"
                  value={variance > 0 ? `+${variance}` : variance}
                  danger={variance < 0}
                  success={variance === 0}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  );
}

function Info({ label, value }) {
  return (
    <Col sm={6}>
      <div className="text-muted small mb-1">{label}</div>

      <div className="fw-semibold">{value}</div>
    </Col>
  );
}

function StockValue({ label, value, danger = false, success = false }) {
  return (
    <div className="d-flex justify-content-between align-items-center border-bottom py-3">
      <span className="text-muted">{label}</span>

      <span
        className={`fs-5 fw-bold ${
          danger ? "text-danger" : success ? "text-success" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}
