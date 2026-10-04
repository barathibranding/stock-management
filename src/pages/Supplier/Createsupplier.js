import React, { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import Layout from "../../components/Layout";
import {
  createSupplier,
  getSupplier,
  updateSupplier,
} from "../../api/suppliers";
import { getErrorMessage } from "../../utils/Errors";

export default function CreateSupplier() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    supplier_name: "",
    supplier_location: "",
    status: "active",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;

    async function loadSupplier() {
      try {
        setLoading(true);

        const data = await getSupplier(id);

        setForm({
          supplier_name: data.supplier_name || "",
          supplier_location: data.supplier_location || "",
          status: data.status || "active",
        });
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }

    loadSupplier();
  }, [id, isEdit]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (!form.supplier_name.trim()) {
        setError("Supplier name is required.");
        return;
      }

      if (isEdit) {
        await updateSupplier(id, form);
      } else {
        await createSupplier(form);
      }

      navigate("/suppliers");
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

  return (
    <Layout>
      <div className="mb-4">
        <h1 className="h3 mb-1">
          {isEdit ? "Edit Supplier" : "Create Supplier"}
        </h1>

        <p className="text-muted mb-0">
          {isEdit ? "Update supplier information." : "Add a new supplier."}
        </p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={8}>
                <Form.Group>
                  <Form.Label>Supplier Name</Form.Label>

                  <Form.Control
                    name="supplier_name"
                    value={form.supplier_name}
                    onChange={handleChange}
                    placeholder="Qingdao Top Run International Trading LLC"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={8}>
                <Form.Group>
                  <Form.Label>Supplier Location</Form.Label>

                  <Form.Control
                    name="supplier_location"
                    value={form.supplier_location}
                    onChange={handleChange}
                    placeholder="Qingdao, China"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>

                  <Form.Select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="active">Active</option>

                    <option value="inactive">Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2 mt-4">
              <Button type="submit" variant="primary" disabled={saving}>
                {saving
                  ? "Saving..."
                  : isEdit
                    ? "Update Supplier"
                    : "Create Supplier"}
              </Button>

              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => navigate("/suppliers")}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Layout>
  );
}
