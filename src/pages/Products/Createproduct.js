import React, { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";

import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";

import { createProduct, getProduct, updateProduct } from "../../api/products";

import { listBranches } from "../../api/branches";
import { getErrorMessage } from "../../utils/Errors";

import "./Products.css";

const initialForm = {
  branch: "",
  barcode: "",
  short_description: "",
  location: "",
  cost_price: "",
  selling_price: "",
  stk_on_hand: "",
  physical_qty: "",
};

export default function Createproduct() {
  const { user, selectedBranch } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);
  const isAdmin = user?.user_type === "admin";

  const [form, setForm] = useState(initialForm);
  const [branches, setBranches] = useState([]);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isAdmin) {
      loadBranches();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isEdit) {
      loadProduct();
    } else if (selectedBranch?.id) {
      setForm((current) => ({
        ...current,
        branch: selectedBranch.id,
      }));
    }
  }, [id, selectedBranch?.id]);

  async function loadBranches() {
    try {
      const data = await listBranches();

      setBranches(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function loadProduct() {
    try {
      setLoading(true);
      setError("");

      const data = await getProduct(id);

      setForm({
        branch: data.branch || "",
        barcode: data.barcode || "",
        short_description: data.short_description || "",
        location: data.location || "",
        cost_price: data.cost_price || "",
        selling_price: data.selling_price || "",
        stk_on_hand: data.stk_on_hand ?? "",
        physical_qty: data.physical_qty ?? "",
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.barcode.trim()) {
      setError("Barcode is required.");
      return;
    }

    if (!form.short_description.trim()) {
      setError("Product description is required.");
      return;
    }

    if (isAdmin && !form.branch) {
      setError("Please select a branch.");
      return;
    }

    const payload = {
      barcode: form.barcode.trim(),
      short_description: form.short_description.trim(),
      location: form.location.trim(),
      cost_price: form.cost_price || "0",
      selling_price: form.selling_price || "0",
      stk_on_hand: Number(form.stk_on_hand || 0),
      physical_qty: Number(form.physical_qty || 0),
    };

    // Branch is needed when creating.
    // Do not change branch during editing.
    if (!isEdit && isAdmin && form.branch) {
      payload.branch = Number(form.branch);
    }

    try {
      setSaving(true);

      let data;

      if (isEdit) {
        data = await updateProduct(id, payload);
        setSuccess("Product updated successfully.");
      } else {
        data = await createProduct(payload);
        setSuccess("Product created successfully.");
      }

      if (!isEdit && data?.id) {
        navigate(`/products/${data.id}`);
      }
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
          <div className="text-muted mt-2">Loading product...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="products-page">
        <div className="mb-4">
          <Link to="/products" className="text-decoration-none small">
            <i className="bi bi-arrow-left me-2"></i>
            Back to Products
          </Link>

          <h1 className="h3 mt-2 mb-1">
            {isEdit ? "Edit Product" : "Add Product"}
          </h1>

          <p className="text-muted mb-0">
            {isEdit
              ? "Update product information and stock."
              : "Add a new product to your inventory."}
          </p>
        </div>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" dismissible onClose={() => setSuccess("")}>
            {success}
          </Alert>
        )}

        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4">
            <Form onSubmit={handleSubmit}>
              <h5 className="mb-3">Product Information</h5>

              <Row className="g-3">
                {isAdmin && (
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Branch</Form.Label>

                      <Form.Select
                        name="branch"
                        value={form.branch}
                        onChange={handleChange}
                        disabled={isEdit}
                      >
                        <option value="">Select Branch</option>

                        {branches.map((branch) => (
                          <option key={branch.id} value={branch.id}>
                            {branch.branch_name}
                          </option>
                        ))}
                      </Form.Select>

                      {isEdit && (
                        <Form.Text className="text-muted">
                          Branch cannot be changed after product creation.
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                )}

                <Col md={isAdmin ? 6 : 12}>
                  <Form.Group>
                    <Form.Label>
                      Barcode <span className="text-danger">*</span>
                    </Form.Label>

                    <Form.Control
                      name="barcode"
                      value={form.barcode}
                      onChange={handleChange}
                      placeholder="Example: FH123456"
                    />
                  </Form.Group>
                </Col>

                <Col md={8}>
                  <Form.Group>
                    <Form.Label>
                      Short Description <span className="text-danger">*</span>
                    </Form.Label>

                    <Form.Control
                      name="short_description"
                      value={form.short_description}
                      onChange={handleChange}
                      placeholder="Example: Hydraulic Filter"
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Location</Form.Label>

                    <Form.Control
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="Example: A1-01"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <hr className="my-4" />

              <h5 className="mb-3">Price & Stock</h5>

              <Row className="g-3">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Cost Price</Form.Label>

                    <Form.Control
                      type="number"
                      min="0"
                      step="0.01"
                      name="cost_price"
                      value={form.cost_price}
                      onChange={handleChange}
                      placeholder="0.00"
                    />
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Selling Price</Form.Label>

                    <Form.Control
                      type="number"
                      min="0"
                      step="0.01"
                      name="selling_price"
                      value={form.selling_price}
                      onChange={handleChange}
                      placeholder="0.00"
                    />
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Stock On Hand</Form.Label>

                    <Form.Control
                      type="number"
                      min="0"
                      name="stk_on_hand"
                      value={form.stk_on_hand}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Physical Qty</Form.Label>

                    <Form.Control
                      type="number"
                      min="0"
                      name="physical_qty"
                      value={form.physical_qty}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="form-info-box mt-4">
                <i className="bi bi-info-circle me-2"></i>
                Variance is calculated automatically by the backend as Physical
                Qty − Stock On Hand.
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <Link to="/products" className="btn btn-light">
                  Cancel
                </Link>

                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-lg me-2"></i>
                      {isEdit ? "Update Product" : "Save Product"}
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Layout>
  );
}
