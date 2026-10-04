// // D:\freelanceing\product tracking\stock-management\frontend\src\pages\Dashboard.js
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Alert,
//   Button,
//   Card,
//   Col,
//   Container,
//   Navbar,
//   Row,
//   Spinner,
// } from "react-bootstrap";
// import { useAuth } from "../context/AuthContext";
// import { getBranchDetails } from "../api/branches";
// import { getErrorMessage } from "../utils/Errors";

// export default function Dashboard() {
//   const { user, selectedBranch, logout, clearBranch } = useAuth();
//   const navigate = useNavigate();
//   const [branchDetails, setBranchDetails] = useState(selectedBranch);
//   const [error, setError] = useState("");
//   const [busy, setBusy] = useState(false);

//   useEffect(() => {
//     if (!selectedBranch?.id) return;
//     let cancelled = false;
//     getBranchDetails(selectedBranch.id)
//       .then((data) => {
//         if (!cancelled) setBranchDetails(data);
//       })
//       .catch((err) => {
//         if (!cancelled) setError(getErrorMessage(err));
//       });
//     return () => {
//       cancelled = true;
//     };
//   }, [selectedBranch?.id]);

//   const handleLogout = async () => {
//     setBusy(true);
//     await logout();
//     navigate("/login", { replace: true });
//   };

//   const handleSwitchBranch = () => {
//     clearBranch();
//     navigate("/select-branch", { replace: true });
//   };

//   const initials = (user?.name || user?.username || "?")
//     .charAt(0)
//     .toUpperCase();

//   return (
//     <>
//       <Navbar
//         bg="white"
//         expand="lg"
//         sticky="top"
//         className="border-bottom shadow-sm py-2"
//       >
//         <Container fluid className="px-3 px-lg-4">
//           {/* Left: brand */}
//           <Navbar.Brand className="d-flex align-items-center gap-2 mb-0">
//             <div
//               className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
//               style={{ width: 40, height: 40 }}
//             >
//               SM
//             </div>
//             <div className="lh-sm">
//               <div className="fw-semibold">Stock Management</div>
//               <div className="text-muted small fw-normal">
//                 {branchDetails?.branch_name || "Branch"}
//               </div>
//             </div>
//           </Navbar.Brand>

//           {/* Right: user chip + actions */}
//           <div className="d-flex align-items-center gap-2 flex-wrap ms-auto">
//             <div className="d-flex align-items-center gap-2 border rounded-pill ps-1 pe-3 py-1 bg-light">
//               <div
//                 className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center fw-semibold flex-shrink-0"
//                 style={{ width: 32, height: 32 }}
//               >
//                 {initials}
//               </div>
//               <div className="lh-sm">
//                 <div className="small fw-semibold">
//                   {user?.name || user?.username}
//                 </div>
//                 <div className="text-muted" style={{ fontSize: "0.75rem" }}>
//                   {user?.user_type}
//                 </div>
//               </div>
//             </div>

//             {user?.requires_branch_selection && (
//               <Button
//                 variant="outline-secondary"
//                 size="sm"
//                 onClick={handleSwitchBranch}
//               >
//                 Switch Branch
//               </Button>
//             )}

//             <Button
//               variant="outline-secondary"
//               size="sm"
//               onClick={handleLogout}
//               disabled={busy}
//               className="d-inline-flex align-items-center"
//             >
//               {busy ? (
//                 <>
//                   <Spinner
//                     as="span"
//                     animation="border"
//                     size="sm"
//                     role="status"
//                     aria-hidden="true"
//                     className="me-2"
//                   />
//                   Signing out…
//                 </>
//               ) : (
//                 "Sign Out"
//               )}
//             </Button>
//           </div>
//         </Container>
//       </Navbar>

//       <main className="bg-light min-vh-100 py-4">
//         <Container fluid className="px-3 px-lg-4">
//           {/* Page head */}
//           <div className="mb-4">
//             <h1 className="h3 mb-1">Dashboard</h1>
//             <p className="text-muted mb-0">
//               Signed in as {user?.name || user?.username}
//               {branchDetails?.branch_name
//                 ? ` · ${branchDetails.branch_name}`
//                 : ""}
//             </p>
//           </div>

//           {error && (
//             <Alert variant="danger" className="py-2 small">
//               {error}
//             </Alert>
//           )}

//           {/* KPI row */}
//           <Row xs={1} sm={2} lg={4} className="g-3 mb-4">
//             <Col>
//               <StatCard
//                 label="Active Branch"
//                 value={branchDetails?.branch_name || "—"}
//               />
//             </Col>
//             <Col>
//               <StatCard label="User Type" value={user?.user_type || "—"} />
//             </Col>
//             <Col>
//               <StatCard label="Branch ID" value={branchDetails?.id ?? "—"} />
//             </Col>
//             <Col>
//               <StatCard label="Session" value="Active" tone="ok" />
//             </Col>
//           </Row>

//           {/* Welcome panel */}
//           <Card className="border-0 shadow-sm mb-4">
//             <Card.Body>
//               <h2 className="h5">Welcome</h2>
//               <p className="text-muted mb-0">
//                 You are now working inside{" "}
//                 <strong>{branchDetails?.branch_name || "your branch"}</strong>.
//                 Use the navigation on the left (coming soon) to manage products,
//                 purchase orders, and stock movements.
//               </p>
//             </Card.Body>
//           </Card>

//           {/* Details */}
//           <Row xs={1} lg={2} className="g-3">
//             <Col>
//               <Card className="border-0 shadow-sm h-100">
//                 <Card.Body>
//                   <h2 className="h5 mb-3">Account</h2>
//                   <dl className="row mb-0">
//                     <DetailRow label="Username" value={user?.username} />
//                     <DetailRow label="Full name" value={user?.name || "—"} />
//                     <DetailRow label="User type" value={user?.user_type} />
//                     <DetailRow
//                       label="Requires branch selection"
//                       value={String(user?.requires_branch_selection)}
//                       last
//                     />
//                   </dl>
//                 </Card.Body>
//               </Card>
//             </Col>

//             <Col>
//               <Card className="border-0 shadow-sm h-100">
//                 <Card.Body>
//                   <h2 className="h5 mb-3">Branch</h2>
//                   <dl className="row mb-0">
//                     <DetailRow
//                       label="Name"
//                       value={branchDetails?.branch_name || "—"}
//                     />
//                     <DetailRow
//                       label="ID"
//                       value={branchDetails?.id ?? "—"}
//                       last
//                     />
//                   </dl>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>
//         </Container>
//       </main>
//     </>
//   );
// }

// function StatCard({ label, value, tone = "" }) {
//   return (
//     <Card className="border-0 shadow-sm h-100">
//       <Card.Body>
//         <div className="text-muted text-uppercase small fw-semibold mb-1">
//           {label}
//         </div>
//         <div
//           className={`fs-4 fw-bold ${
//             tone === "ok" ? "text-success" : "text-body"
//           }`}
//         >
//           {value}
//         </div>
//       </Card.Body>
//     </Card>
//   );
// }

// function DetailRow({ label, value, last = false }) {
//   return (
//     <>
//       <dt className="col-6 col-sm-7 text-muted fw-normal small">{label}</dt>
//       <dd
//         className={`col-6 col-sm-5 fw-semibold small ${last ? "mb-0" : "mb-2"}`}
//       >
//         {value}
//       </dd>
//     </>
//   );
// }

import React, { useEffect, useState } from "react";
import { Alert, Card, Col, Row } from "react-bootstrap";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { getBranchDetails } from "../api/branches";
import { getErrorMessage } from "../utils/Errors";

export default function Dashboard() {
  const { user, selectedBranch } = useAuth();
  const [branchDetails, setBranchDetails] = useState(selectedBranch);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedBranch?.id) return;
    let cancelled = false;
    getBranchDetails(selectedBranch.id)
      .then((data) => !cancelled && setBranchDetails(data))
      .catch((err) => !cancelled && setError(getErrorMessage(err)));
    return () => {
      cancelled = true;
    };
  }, [selectedBranch?.id]);

  return (
    <Layout>
      <div className="mb-4">
        <h1 className="h3 mb-1">Dashboard</h1>
        <p className="text-muted mb-0">
          Signed in as {user?.name || user?.username}
          {branchDetails?.branch_name ? ` · ${branchDetails.branch_name}` : ""}
        </p>
      </div>

      {error && (
        <Alert variant="danger" className="py-2 small">
          {error}
        </Alert>
      )}

      <Row xs={1} sm={2} lg={4} className="g-3 mb-4">
        <Col>
          <StatCard
            label="Active Branch"
            value={branchDetails?.branch_name || "—"}
          />
        </Col>
        <Col>
          <StatCard label="User Type" value={user?.user_type || "—"} />
        </Col>
        <Col>
          <StatCard label="Branch ID" value={branchDetails?.id ?? "—"} />
        </Col>
        <Col>
          <StatCard label="Session" value="Active" tone="ok" />
        </Col>
      </Row>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <h2 className="h5">Welcome</h2>
          <p className="text-muted mb-0">
            You are now working inside{" "}
            <strong>{branchDetails?.branch_name || "your branch"}</strong>. Use
            the sidebar to manage products, purchase orders, and stock
            movements.
          </p>
        </Card.Body>
      </Card>
    </Layout>
  );
}

function StatCard({ label, value, tone = "" }) {
  return (
    <Card className="border-0 shadow-sm h-100">
      <Card.Body>
        <div className="text-muted text-uppercase small fw-semibold mb-1">
          {label}
        </div>
        <div className={`fs-4 fw-bold ${tone === "ok" ? "text-success" : ""}`}>
          {value}
        </div>
      </Card.Body>
    </Card>
  );
}
