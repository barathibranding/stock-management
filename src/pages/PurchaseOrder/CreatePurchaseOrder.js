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
import { listSuppliers } from "../../api/suppliers";
import {
  createPurchaseOrder,
  searchProductsForPurchaseOrder,
} from "../../api/purchaseOrders";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../utils/Errors";

export default function CreatePurchaseOrder() {
  const navigate = useNavigate();
  const { selectedBranch } = useAuth();

  const today = new Date().toISOString().split("T")[0];

  const [suppliers, setSuppliers] = useState([]);

  const [form, setForm] = useState({
    supplier: "",
    po_date: today,
    expected_delivery_date: "",
  });

  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);

  const [containers, setContainers] = useState([
    {
      container_number: "",
      container_type: "Carton",
      quantity: 1,
      remarks: "",
    },
  ]);

  const [search, setSearch] = useState({
    barcode: "",
    short_description: "",
    location: "",
  });

  const [loadingSuppliers, setLoadingSuppliers] = useState(true);

  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSuppliers() {
      try {
        const data = await listSuppliers({
          status: "active",
        });

        setSuppliers(data?.results || data || []);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoadingSuppliers(false);
      }
    }

    loadSuppliers();
  }, []);

  function handleFormChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSearchChange(event) {
    const { name, value } = event.target;

    setSearch((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleProductSearch(event) {
    event.preventDefault();

    const params = {};

    if (search.barcode.trim()) {
      params.barcode = search.barcode.trim();
    }

    if (search.short_description.trim()) {
      params.short_description = search.short_description.trim();
    }

    if (search.location.trim()) {
      params.location = search.location.trim();
    }

    if (Object.keys(params).length === 0) {
      setError("Enter barcode, description, or location.");
      return;
    }

    try {
      setSearching(true);
      setError("");

      const data = await searchProductsForPurchaseOrder(params);

      setProducts(data?.results || data || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSearching(false);
    }
  }

  function addProduct(product) {
    const existing = items.find((item) => item.product === product.id);

    if (existing) {
      setError("Product is already added.");
      return;
    }

    setItems((previous) => [
      ...previous,
      {
        product: product.id,
        barcode: product.barcode,
        short_description: product.short_description,
        location: product.location,
        quantity: 1,
        purchase_price: "0.00",
      },
    ]);

    setError("");
  }

  function removeItem(productId) {
    setItems((previous) =>
      previous.filter((item) => item.product !== productId),
    );
  }

  function updateItem(productId, field, value) {
    setItems((previous) =>
      previous.map((item) =>
        item.product === productId
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  }

  function addContainer() {
    setContainers((previous) => [
      ...previous,
      {
        container_number: "",
        container_type: "Carton",
        quantity: 1,
        remarks: "",
      },
    ]);
  }

  function removeContainer(index) {
    setContainers((previous) => previous.filter((_, i) => i !== index));
  }

  function updateContainer(index, field, value) {
    setContainers((previous) =>
      previous.map((container, i) =>
        i === index
          ? {
              ...container,
              [field]: value,
            }
          : container,
      ),
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedBranch?.id) {
      setError("Please select a branch.");
      return;
    }

    if (!form.supplier) {
      setError("Please select a supplier.");
      return;
    }

    if (items.length === 0) {
      setError("Please add at least one product.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        branch_id: selectedBranch.id,
        supplier: Number(form.supplier),
        po_date: form.po_date,
        expected_delivery_date: form.expected_delivery_date || null,

        items: items.map((item) => ({
          product: item.product,
          quantity: Number(item.quantity),
          purchase_price: item.purchase_price,
        })),

        containers: containers
          .filter((container) => container.container_number.trim())
          .map((container) => ({
            container_number: container.container_number,
            container_type: container.container_type,
            quantity: Number(container.quantity),
            remarks: container.remarks,
          })),
      };

      const data = await createPurchaseOrder(payload);

      navigate(`/purchase-orders/${data.id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  const totalQuantity = items.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0,
  );

  const totalAmount = items.reduce(
    (sum, item) =>
      sum + Number(item.quantity || 0) * Number(item.purchase_price || 0),
    0,
  );

  return (
    <Layout>
      <div className="mb-4">
        <h1 className="h3 mb-1">Create Purchase Order</h1>

        <p className="text-muted mb-0">
          Create a draft purchase order using existing products.
        </p>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body>
            <h5 className="mb-3">Purchase Order Information</h5>

            <Row className="g-3">
              <Col md={4}>
                <Form.Label>Branch</Form.Label>

                <Form.Control
                  value={selectedBranch?.branch_name || ""}
                  disabled
                />
              </Col>

              <Col md={4}>
                <Form.Label>Supplier</Form.Label>

                {loadingSuppliers ? (
                  <div>
                    <Spinner size="sm" />
                  </div>
                ) : (
                  <Form.Select
                    name="supplier"
                    value={form.supplier}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select Supplier</option>

                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.supplier_name}
                      </option>
                    ))}
                  </Form.Select>
                )}
              </Col>

              <Col md={2}>
                <Form.Label>PO Date</Form.Label>

                <Form.Control
                  type="date"
                  name="po_date"
                  value={form.po_date}
                  onChange={handleFormChange}
                  required
                />
              </Col>

              <Col md={2}>
                <Form.Label>Expected Delivery</Form.Label>

                <Form.Control
                  type="date"
                  name="expected_delivery_date"
                  value={form.expected_delivery_date}
                  onChange={handleFormChange}
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="border-0 shadow-sm mb-4">
          <Card.Body>
            <h5 className="mb-3">Search Products</h5>

            <Row className="g-2">
              <Col md={3}>
                <Form.Control
                  name="barcode"
                  value={search.barcode}
                  onChange={handleSearchChange}
                  placeholder="Barcode"
                />
              </Col>

              <Col md={4}>
                <Form.Control
                  name="short_description"
                  value={search.short_description}
                  onChange={handleSearchChange}
                  placeholder="Short Description"
                />
              </Col>

              <Col md={3}>
                <Form.Control
                  name="location"
                  value={search.location}
                  onChange={handleSearchChange}
                  placeholder="Location"
                />
              </Col>

              <Col md={2}>
                <Button
                  type="button"
                  variant="primary"
                  className="w-100"
                  onClick={handleProductSearch}
                  disabled={searching}
                >
                  {searching ? "Searching..." : "Search"}
                </Button>
              </Col>
            </Row>

            {products.length > 0 && (
              <div className="table-responsive mt-4">
                <Table bordered hover size="sm" className="align-middle">
                  <thead>
                    <tr>
                      <th>Barcode</th>
                      <th>Description</th>
                      <th>Location</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.barcode}</td>
                        <td>{product.short_description}</td>
                        <td>{product.location}</td>
                        <td>
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => addProduct(product)}
                          >
                            + Add
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

        <Card className="border-0 shadow-sm mb-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Purchase Order Items</h5>

              <span className="text-muted">{items.length} Products</span>
            </div>

            {items.length === 0 ? (
              <div className="text-center text-muted py-4">
                No products added.
              </div>
            ) : (
              <div className="table-responsive">
                <Table bordered hover className="align-middle">
                  <thead>
                    <tr>
                      <th>Barcode</th>
                      <th>Description</th>
                      <th>Location</th>
                      <th style={{ width: 120 }}>Quantity</th>
                      <th style={{ width: 150 }}>Purchase Price</th>
                      <th>Total</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((item) => {
                      const total =
                        Number(item.quantity || 0) *
                        Number(item.purchase_price || 0);

                      return (
                        <tr key={item.product}>
                          <td>{item.barcode}</td>

                          <td>{item.short_description}</td>

                          <td>{item.location}</td>

                          <td>
                            <Form.Control
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateItem(
                                  item.product,
                                  "quantity",
                                  e.target.value,
                                )
                              }
                            />
                          </td>

                          <td>
                            <Form.Control
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.purchase_price}
                              onChange={(e) =>
                                updateItem(
                                  item.product,
                                  "purchase_price",
                                  e.target.value,
                                )
                              }
                            />
                          </td>

                          <td>{total.toFixed(2)}</td>

                          <td>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => removeItem(item.product)}
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            )}

            <div className="text-end mt-3">
              <strong>
                Total Quantity: {totalQuantity}
                {"  "} | {"  "}
                Total Amount: {totalAmount.toFixed(2)}
              </strong>
            </div>
          </Card.Body>
        </Card>

        <Card className="border-0 shadow-sm mb-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Containers / Boxes</h5>

              <Button
                type="button"
                size="sm"
                variant="outline-primary"
                onClick={addContainer}
              >
                + Add Box
              </Button>
            </div>

            {containers.map((container, index) => (
              <Row key={index} className="g-2 mb-2">
                <Col md={3}>
                  <Form.Control
                    placeholder="Box / Container No."
                    value={container.container_number}
                    onChange={(e) =>
                      updateContainer(index, "container_number", e.target.value)
                    }
                  />
                </Col>

                <Col md={2}>
                  <Form.Select
                    value={container.container_type}
                    onChange={(e) =>
                      updateContainer(index, "container_type", e.target.value)
                    }
                  >
                    <option>Carton</option>
                    <option>Box</option>
                    <option>Container</option>
                    <option>Pallet</option>
                  </Form.Select>
                </Col>

                <Col md={2}>
                  <Form.Control
                    type="number"
                    min="1"
                    value={container.quantity}
                    onChange={(e) =>
                      updateContainer(index, "quantity", e.target.value)
                    }
                  />
                </Col>

                <Col md={4}>
                  <Form.Control
                    placeholder="Remarks"
                    value={container.remarks}
                    onChange={(e) =>
                      updateContainer(index, "remarks", e.target.value)
                    }
                  />
                </Col>

                <Col md={1}>
                  <Button
                    type="button"
                    variant="outline-danger"
                    onClick={() => removeContainer(index)}
                  >
                    ×
                  </Button>
                </Col>
              </Row>
            ))}
          </Card.Body>
        </Card>

        <div className="d-flex justify-content-end gap-2 mb-5">
          <Button
            type="button"
            variant="outline-secondary"
            onClick={() => navigate("/purchase-orders")}
          >
            Cancel
          </Button>

          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Creating..." : "Create Draft PO"}
          </Button>
        </div>
      </Form>
    </Layout>
  );
}
