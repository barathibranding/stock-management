import React, { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { Link } from "react-router-dom";

import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";

import {
  listProducts,
  deleteProduct,
  bulkDeleteProducts,
  importProducts,
  exportProducts,
} from "../../api/products";

import { listBranches } from "../../api/branches";
import { getErrorMessage } from "../../utils/Errors";

import "./Products.css";

export default function Listproduct() {
  const { user, selectedBranch } = useAuth();

  const isAdmin = user?.user_type === "admin";

  const [products, setProducts] = useState([]);

  const [branches, setBranches] = useState([]);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const [branchId, setBranchId] = useState(selectedBranch?.id || "");

  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);

  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedIds, setSelectedIds] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);

  useEffect(() => {
    loadBranches();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [page, selectedBranch?.id]);

  async function loadBranches() {
    if (!isAdmin) return;

    try {
      const data = await listBranches();
      setBranches(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        page_size: pageSize,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (location.trim()) {
        params.location = location.trim();
      }

      if (isAdmin && branchId) {
        params.branch_id = branchId;
      } else if (!isAdmin && selectedBranch?.id) {
        params.branch_id = selectedBranch.id;
      }

      params.ordering = "barcode";

      const data = await listProducts(params);

      setProducts(data?.results || []);
      setTotal(data?.count || 0);

      setSelectedIds([]);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(event) {
    event.preventDefault();

    setPage(1);
    loadProducts();
  }

  function clearFilters() {
    setSearch("");
    setLocation("");

    if (isAdmin) {
      setBranchId("");
    } else {
      setBranchId(selectedBranch?.id || "");
    }

    setPage(1);

    setTimeout(() => {
      loadProducts();
    }, 0);
  }

  function toggleSelect(id) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function toggleSelectAll() {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(products.map((product) => product.id));
  }

  function openDelete(product) {
    setDeleteTarget(product);
    setShowDeleteModal(true);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    try {
      setActionLoading(true);
      setError("");

      await deleteProduct(deleteTarget.id);

      setSuccess("Product deleted successfully.");

      setShowDeleteModal(false);
      setDeleteTarget(null);

      await loadProducts();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  }

  async function handleBulkDelete() {
    if (!selectedIds.length) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedIds.length} product(s)?`,
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");

      await bulkDeleteProducts(selectedIds);

      setSuccess(`${selectedIds.length} product(s) deleted successfully.`);

      setSelectedIds([]);

      await loadProducts();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  }

  async function handleImport() {
    if (!importFile) {
      setError("Please select an Excel file.");
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      const data = await importProducts(importFile);

      setSuccess(
        data?.detail || data?.message || "Products imported successfully.",
      );

      setShowImportModal(false);
      setImportFile(null);

      await loadProducts();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  }

  async function handleExport() {
    try {
      setActionLoading(true);
      setError("");

      const params = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      if (location.trim()) {
        params.location = location.trim();
      }

      if (isAdmin && branchId) {
        params.branch_id = branchId;
      } else if (!isAdmin && selectedBranch?.id) {
        params.branch_id = selectedBranch.id;
      }

      const response = await exportProducts(params);

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `products-${new Date().toISOString().slice(0, 10)}.xlsx`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      setSuccess("Excel file exported successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  }

  const totalPages = Math.ceil(total / pageSize);

  return (
    <Layout>
      <div className="products-page">
        {/* Header */}
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
          <div>
            <h1 className="h3 mb-1">Products</h1>

            <p className="text-muted mb-0">
              Manage products, stock quantities and inventory.
            </p>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <Button
              variant="outline-secondary"
              onClick={() => setShowImportModal(true)}
            >
              <i className="bi bi-upload me-2"></i>
              Import Excel
            </Button>

            <Button
              variant="outline-success"
              onClick={handleExport}
              disabled={actionLoading}
            >
              <i className="bi bi-file-earmark-excel me-2"></i>
              Export
            </Button>

            <Link to="/products/create" className="btn btn-primary">
              <i className="bi bi-plus-lg me-2"></i>
              Add Product
            </Link>
          </div>
        </div>

        {/* Alerts */}
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

        {/* Filters */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body>
            <Form onSubmit={handleSearch}>
              <Row className="g-3 align-items-end">
                <Col lg={4}>
                  <Form.Label>Search Product</Form.Label>

                  <Form.Control
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Barcode or description..."
                  />
                </Col>

                <Col lg={3}>
                  <Form.Label>Location</Form.Label>

                  <Form.Control
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Example: A1-01"
                  />
                </Col>

                {isAdmin && (
                  <Col lg={3}>
                    <Form.Label>Branch</Form.Label>

                    <Form.Select
                      value={branchId}
                      onChange={(e) => {
                        setBranchId(e.target.value);
                        setPage(1);
                      }}
                    >
                      <option value="">All Branches</option>

                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.branch_name}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                )}

                <Col lg={2}>
                  <div className="d-flex gap-2">
                    <Button
                      type="submit"
                      variant="primary"
                      className="flex-grow-1"
                    >
                      Search
                    </Button>

                    <Button
                      type="button"
                      variant="light"
                      onClick={clearFilters}
                      title="Clear filters"
                    >
                      <i className="bi bi-x-lg"></i>
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {/* Bulk actions */}
        {selectedIds.length > 0 && (
          <Card className="border-0 shadow-sm mb-3 bg-light">
            <Card.Body className="py-2">
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-semibold">
                  {selectedIds.length} product(s) selected
                </span>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={actionLoading}
                >
                  <i className="bi bi-trash me-2"></i>
                  Delete Selected
                </Button>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Product table */}
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" />
                <div className="text-muted mt-2">Loading products...</div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-5 px-3">
                <div className="empty-icon mb-3">
                  <i className="bi bi-box-seam"></i>
                </div>

                <h5>No products found</h5>

                <p className="text-muted">
                  Try changing your search filters or add a new product.
                </p>

                <Link to="/products/create" className="btn btn-primary">
                  Add Product
                </Link>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <Table hover className="align-middle mb-0 product-table">
                    <thead>
                      <tr>
                        <th>
                          <Form.Check
                            type="checkbox"
                            checked={
                              products.length > 0 &&
                              selectedIds.length === products.length
                            }
                            onChange={toggleSelectAll}
                          />
                        </th>

                        <th>S.R</th>
                        <th>Barcode</th>
                        <th>Description</th>
                        <th>Location</th>
                        <th>Cost</th>
                        <th>Selling</th>
                        <th>Stock</th>
                        <th>Physical</th>
                        <th>Variance</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {products.map((product, index) => {
                        const variance = Number(product.variance || 0);

                        return (
                          <tr key={product.id}>
                            <td>
                              <Form.Check
                                type="checkbox"
                                checked={selectedIds.includes(product.id)}
                                onChange={() => toggleSelect(product.id)}
                              />
                            </td>

                            <td>{(page - 1) * pageSize + index + 1}</td>

                            <td>
                              <Link
                                to={`/products/${product.id}`}
                                className="fw-semibold text-decoration-none"
                              >
                                {product.barcode}
                              </Link>
                            </td>

                            <td>
                              <div className="product-description">
                                {product.short_description || "—"}
                              </div>
                            </td>

                            <td>
                              <Badge bg="light" text="dark">
                                {product.location || "—"}
                              </Badge>
                            </td>

                            <td>
                              AED {Number(product.cost_price || 0).toFixed(2)}
                            </td>

                            <td>
                              AED{" "}
                              {Number(product.selling_price || 0).toFixed(2)}
                            </td>

                            <td className="fw-semibold">
                              {product.stk_on_hand}
                            </td>

                            <td className="fw-semibold">
                              {product.physical_qty}
                            </td>

                            <td>
                              <Badge
                                bg={
                                  variance === 0
                                    ? "success"
                                    : variance < 0
                                      ? "danger"
                                      : "warning"
                                }
                              >
                                {variance > 0 ? `+${variance}` : variance}
                              </Badge>
                            </td>

                            <td>
                              <div className="d-flex justify-content-end gap-1">
                                <Link
                                  to={`/products/${product.id}`}
                                  className="btn btn-sm btn-light"
                                  title="View"
                                >
                                  <i className="bi bi-eye"></i>
                                </Link>

                                <Link
                                  to={`/products/${product.id}/edit`}
                                  className="btn btn-sm btn-light"
                                  title="Edit"
                                >
                                  <i className="bi bi-pencil"></i>
                                </Link>

                                <Button
                                  size="sm"
                                  variant="light"
                                  className="text-danger"
                                  onClick={() => openDelete(product)}
                                  title="Delete"
                                >
                                  <i className="bi bi-trash"></i>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 p-3 border-top">
                  <small className="text-muted">
                    Showing {(page - 1) * pageSize + 1}–
                    {Math.min(page * pageSize, total)} of {total} products
                  </small>

                  <div className="d-flex gap-2">
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      Previous
                    </Button>

                    <Button
                      size="sm"
                      variant="outline-secondary"
                      disabled={page >= totalPages || totalPages === 0}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      </div>

      {/* Delete Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Product</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delete{" "}
          <strong>{deleteTarget?.barcode}</strong>?
          <div className="text-muted small mt-2">
            This action cannot be undone.
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="light" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={confirmDelete}
            disabled={actionLoading}
          >
            {actionLoading ? <Spinner size="sm" /> : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Import Modal */}
      <Modal
        show={showImportModal}
        onHide={() => setShowImportModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Import Products</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p className="text-muted">
            Upload your Excel file containing product inventory.
          </p>

          <Form.Group>
            <Form.Label>Excel File</Form.Label>

            <Form.Control
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
            />
          </Form.Group>

          <div className="small text-muted mt-3">
            Required columns:
            <br />
            BarCode, Short Description, Location, Cost Price, Selling Price, Stk
            On Hand, Physical Qty
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="light" onClick={() => setShowImportModal(false)}>
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={handleImport}
            disabled={!importFile || actionLoading}
          >
            {actionLoading ? <Spinner size="sm" /> : "Import Products"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
}
