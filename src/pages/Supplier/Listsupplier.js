// import React, { useEffect, useState } from "react";
// import {
//   Alert,
//   Button,
//   Card,
//   Col,
//   Form,
//   InputGroup,
//   Row,
//   Spinner,
//   Table,
// } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";

// import Layout from "../../components/Layout";
// import { listSuppliers, updateSupplierStatus } from "../../api/suppliers";
// import { getErrorMessage } from "../../utils/Errors";

// export default function ListSupplier() {
//   const navigate = useNavigate();

//   const [suppliers, setSuppliers] = useState([]);
//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [actionId, setActionId] = useState(null);

//   async function loadSuppliers() {
//     try {
//       setLoading(true);
//       setError("");

//       const params = {};

//       if (search.trim()) {
//         params.search = search.trim();
//       }

//       if (status) {
//         params.status = status;
//       }

//       const data = await listSuppliers(params);

//       /*
//        * Supports both:
//        * []
//        *
//        * and:
//        * {
//        *   results: []
//        * }
//        */
//       setSuppliers(data?.results || data || []);
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadSuppliers();
//   }, [status]);

//   async function handleSearch(event) {
//     event.preventDefault();
//     loadSuppliers();
//   }

//   async function handleStatusChange(supplier) {
//     try {
//       setActionId(supplier.id);
//       setError("");

//       const newStatus = supplier.status === "active" ? "inactive" : "active";

//       await updateSupplierStatus(supplier.id, newStatus);

//       await loadSuppliers();
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setActionId(null);
//     }
//   }

//   return (
//     <Layout>
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <h1 className="h3 mb-1">Supplier Management</h1>
//           <p className="text-muted mb-0">
//             Manage suppliers used for purchase orders.
//           </p>
//         </div>

//         <Button variant="primary" onClick={() => navigate("/suppliers/create")}>
//           + Add Supplier
//         </Button>
//       </div>

//       {error && (
//         <Alert variant="danger" dismissible onClose={() => setError("")}>
//           {error}
//         </Alert>
//       )}

//       <Card className="border-0 shadow-sm mb-4">
//         <Card.Body>
//           <Form onSubmit={handleSearch}>
//             <Row className="g-3">
//               <Col md={7}>
//                 <InputGroup>
//                   <Form.Control
//                     placeholder="Search supplier..."
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                   />

//                   <Button type="submit" variant="primary">
//                     Search
//                   </Button>
//                 </InputGroup>
//               </Col>

//               <Col md={3}>
//                 <Form.Select
//                   value={status}
//                   onChange={(e) => setStatus(e.target.value)}
//                 >
//                   <option value="">All Status</option>
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                 </Form.Select>
//               </Col>

//               <Col md={2}>
//                 <Button
//                   variant="outline-secondary"
//                   className="w-100"
//                   onClick={() => {
//                     setSearch("");
//                     setStatus("");
//                     setTimeout(loadSuppliers, 0);
//                   }}
//                 >
//                   Reset
//                 </Button>
//               </Col>
//             </Row>
//           </Form>
//         </Card.Body>
//       </Card>

//       <Card className="border-0 shadow-sm">
//         <Card.Body>
//           {loading ? (
//             <div className="text-center py-5">
//               <Spinner animation="border" />
//               <div className="mt-2 text-muted">Loading suppliers...</div>
//             </div>
//           ) : suppliers.length === 0 ? (
//             <div className="text-center text-muted py-5">
//               No suppliers found.
//             </div>
//           ) : (
//             <div className="table-responsive">
//               <Table hover responsive className="align-middle mb-0">
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>Supplier Name</th>
//                     <th>Location</th>
//                     <th>Status</th>
//                     <th className="text-end">Actions</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {suppliers.map((supplier, index) => (
//                     <tr key={supplier.id}>
//                       <td>{index + 1}</td>

//                       <td>
//                         <strong>{supplier.supplier_name}</strong>
//                       </td>

//                       <td>{supplier.supplier_location || "—"}</td>

//                       <td>
//                         <span
//                           className={`badge ${
//                             supplier.status === "active"
//                               ? "bg-success"
//                               : "bg-secondary"
//                           }`}
//                         >
//                           {supplier.status}
//                         </span>
//                       </td>

//                       <td className="text-end">
//                         <div className="d-flex justify-content-end gap-2">
//                           <Button
//                             size="sm"
//                             variant="outline-primary"
//                             onClick={() =>
//                               navigate(`/suppliers/${supplier.id}`)
//                             }
//                           >
//                             View
//                           </Button>

//                           <Button
//                             size="sm"
//                             variant="outline-warning"
//                             onClick={() =>
//                               navigate(`/suppliers/${supplier.id}/edit`)
//                             }
//                           >
//                             Edit
//                           </Button>

//                           <Button
//                             size="sm"
//                             variant={
//                               supplier.status === "active"
//                                 ? "outline-danger"
//                                 : "outline-success"
//                             }
//                             disabled={actionId === supplier.id}
//                             onClick={() => handleStatusChange(supplier)}
//                           >
//                             {actionId === supplier.id
//                               ? "..."
//                               : supplier.status === "active"
//                                 ? "Deactivate"
//                                 : "Activate"}
//                           </Button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </div>
//           )}
//         </Card.Body>
//       </Card>
//     </Layout>
//   );
// }
import React, { useCallback, useEffect, useState } from "react";
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
import { listSuppliers, updateSupplierStatus } from "../../api/suppliers";
import { getErrorMessage } from "../../utils/Errors";

export default function ListSupplier() {
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);

  const loadSuppliers = useCallback(async () => {
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

      const data = await listSuppliers(params);

      /*
       * Supports both:
       * []
       *
       * and:
       * {
       *   results: []
       * }
       */
      setSuppliers(data?.results || data || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  async function handleSearch(event) {
    event.preventDefault();
    await loadSuppliers();
  }

  async function handleStatusChange(supplier) {
    try {
      setActionId(supplier.id);
      setError("");

      const newStatus = supplier.status === "active" ? "inactive" : "active";

      await updateSupplierStatus(supplier.id, newStatus);

      await loadSuppliers();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionId(null);
    }
  }

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Supplier Management</h1>

          <p className="text-muted mb-0">
            Manage suppliers used for purchase orders.
          </p>
        </div>

        <Button variant="primary" onClick={() => navigate("/suppliers/create")}>
          + Add Supplier
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row className="g-3">
              <Col md={7}>
                <InputGroup>
                  <Form.Control
                    placeholder="Search supplier..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  <Button type="submit" variant="primary">
                    Search
                  </Button>
                </InputGroup>
              </Col>

              <Col md={3}>
                <Form.Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Form.Select>
              </Col>

              <Col md={2}>
                <Button
                  variant="outline-secondary"
                  className="w-100"
                  onClick={() => {
                    setSearch("");
                    setStatus("");
                  }}
                >
                  Reset
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

              <div className="mt-2 text-muted">Loading suppliers...</div>
            </div>
          ) : suppliers.length === 0 ? (
            <div className="text-center text-muted py-5">
              No suppliers found.
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover responsive className="align-middle mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Supplier Name</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {suppliers.map((supplier, index) => (
                    <tr key={supplier.id}>
                      <td>{index + 1}</td>

                      <td>
                        <strong>{supplier.supplier_name}</strong>
                      </td>

                      <td>{supplier.supplier_location || "—"}</td>

                      <td>
                        <span
                          className={`badge ${
                            supplier.status === "active"
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          {supplier.status}
                        </span>
                      </td>

                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() =>
                              navigate(`/suppliers/${supplier.id}`)
                            }
                          >
                            View
                          </Button>

                          <Button
                            size="sm"
                            variant="outline-warning"
                            onClick={() =>
                              navigate(`/suppliers/${supplier.id}/edit`)
                            }
                          >
                            Edit
                          </Button>

                          <Button
                            size="sm"
                            variant={
                              supplier.status === "active"
                                ? "outline-danger"
                                : "outline-success"
                            }
                            disabled={actionId === supplier.id}
                            onClick={() => handleStatusChange(supplier)}
                          >
                            {actionId === supplier.id
                              ? "..."
                              : supplier.status === "active"
                                ? "Deactivate"
                                : "Activate"}
                          </Button>
                        </div>
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
