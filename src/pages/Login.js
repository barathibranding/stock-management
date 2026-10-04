// import React, { useState } from "react";
// import { useLocation, useNavigate, Navigate } from "react-router-dom";
// import {
//   Alert,
//   Button,
//   Card,
//   Form,
//   InputGroup,
//   Spinner,
// } from "react-bootstrap";
// import { useAuth } from "../context/AuthContext";
// import { getErrorMessage } from "../utils/Errors";

// export default function Login() {
//   const { user, selectedBranch, login } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [form, setForm] = useState({ username: "", password: "" });
//   const [error, setError] = useState("");
//   const [busy, setBusy] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   // Already logged in? Redirect appropriately.
//   if (user) {
//     if (selectedBranch || !user.requires_branch_selection) {
//       return <Navigate to="/dashboard" replace />;
//     }
//     return <Navigate to="/select-branch" replace />;
//   }

//   const submit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setBusy(true);
//     try {
//       const data = await login(form.username.trim(), form.password);
//       const from = location.state?.from?.pathname;
//       if (data.user.requires_branch_selection) {
//         navigate(from && from !== "/login" ? from : "/select-branch", {
//           replace: true,
//         });
//       } else {
//         navigate(from || "/dashboard", { replace: true });
//       }
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setBusy(false);
//     }
//   };

//   return (
//     <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light px-3 py-4">
//       <Card
//         className="shadow-sm border-0"
//         style={{ maxWidth: 420, width: "100%" }}
//       >
//         <Card.Body className="p-4">
//           {/* Brand */}
//           <div className="d-flex align-items-center gap-3 mb-4">
//             <div
//               className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
//               style={{ width: 48, height: 48 }}
//             >
//               SM
//             </div>
//             <div>
//               <h1 className="h4 mb-0">Stock Management</h1>
//               <p className="text-muted small mb-0">Sign in to continue</p>
//             </div>
//           </div>

//           {error && (
//             <Alert variant="danger" className="py-2 small">
//               {error}
//             </Alert>
//           )}

//           <Form onSubmit={submit} noValidate>
//             <Form.Group className="mb-3" controlId="loginUsername">
//               <Form.Label>Username</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={form.username}
//                 onChange={(e) => setForm({ ...form, username: e.target.value })}
//                 placeholder="Enter your username"
//                 autoComplete="username"
//                 autoFocus
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-3" controlId="loginPassword">
//               <Form.Label>Password</Form.Label>
//               <InputGroup>
//                 <Form.Control
//                   type={showPassword ? "text" : "password"}
//                   value={form.password}
//                   onChange={(e) =>
//                     setForm({ ...form, password: e.target.value })
//                   }
//                   placeholder="Enter your password"
//                   autoComplete="current-password"
//                   required
//                 />
//                 <Button
//                   variant="outline-secondary"
//                   type="button"
//                   onClick={() => setShowPassword((v) => !v)}
//                   tabIndex={-1}
//                 >
//                   {showPassword ? "Hide" : "Show"}
//                 </Button>
//               </InputGroup>
//             </Form.Group>

//             <Button
//               type="submit"
//               variant="primary"
//               className="w-100 d-flex align-items-center justify-content-center"
//               disabled={busy}
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
//                   Signing in…
//                 </>
//               ) : (
//                 "Sign In"
//               )}
//             </Button>
//           </Form>

//           <p className="text-muted small text-center mt-3 mb-0">
//             Contact your administrator if you cannot access your account.
//           </p>
//         </Card.Body>
//       </Card>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  Form,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { listBranches } from "../api/branches";
import { getErrorMessage } from "../utils/Errors";

export default function Login() {
  const { user, selectedBranch, login, selectBranch } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Login form state
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Branch picker state
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [branchError, setBranchError] = useState("");
  const [branchBusy, setBranchBusy] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(false);

  // Admin logged in but no branch yet → load branch list
  // ⚠️ This MUST come before any early return, so all hooks always run.
  useEffect(() => {
    if (!user || selectedBranch || !user.requires_branch_selection) return;
    if (branches.length > 0) return;

    let cancelled = false;
    setLoadingBranches(true);
    listBranches()
      .then((list) => {
        if (cancelled) return;
        const arr = Array.isArray(list) ? list : [];
        setBranches(arr);
        if (arr.length > 0) setBranchId(String(arr[0].id));
      })
      .catch((err) => {
        if (!cancelled) setBranchError(getErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoadingBranches(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user, selectedBranch, branches.length]);

  // ===== ALL HOOKS ABOVE THIS LINE =====

  // If already fully logged in → straight to dashboard
  if (user && (selectedBranch || !user.requires_branch_selection)) {
    return <Navigate to="/dashboard" replace />;
  }

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const data = await login(form.username.trim(), form.password);
      const from = location.state?.from?.pathname;
      if (!data.user.requires_branch_selection) {
        navigate(from && from !== "/login" ? from : "/dashboard", {
          replace: true,
        });
      }
      // Admin → effect above loads branches; picker renders below
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const submitBranch = async (e) => {
    e.preventDefault();
    if (!branchId) {
      setBranchError("Please select a branch.");
      return;
    }
    setBranchError("");
    setBranchBusy(true);
    try {
      await selectBranch(Number(branchId));
      const from = location.state?.from?.pathname;
      navigate(from && from !== "/login" ? from : "/dashboard", {
        replace: true,
      });
    } catch (err) {
      setBranchError(getErrorMessage(err));
    } finally {
      setBranchBusy(false);
    }
  };

  const showBranchPicker =
    !!user && user.requires_branch_selection && !selectedBranch;

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light px-3 py-4">
      <Card
        className="shadow-sm border-0"
        style={{ maxWidth: 420, width: "100%" }}
      >
        <Card.Body className="p-4">
          {/* Brand */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <div
              className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
              style={{ width: 48, height: 48 }}
            >
              SM
            </div>
            <div>
              <h1 className="h4 mb-0">Stock Management</h1>
              <p className="text-muted small mb-0">
                {showBranchPicker
                  ? "Select a branch to continue"
                  : "Sign in to continue"}
              </p>
            </div>
          </div>

          {!showBranchPicker ? (
            /* ========== STEP 1: LOGIN FORM ========== */
            <>
              {error && (
                <Alert variant="danger" className="py-2 small">
                  {error}
                </Alert>
              )}

              <Form onSubmit={submit} noValidate>
                <Form.Group className="mb-3" controlId="loginUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                    placeholder="Enter your username"
                    autoComplete="username"
                    autoFocus
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="loginPassword">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                    />
                    <Button
                      variant="outline-secondary"
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputGroup>
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 d-flex align-items-center justify-content-center"
                  disabled={busy}
                >
                  {busy ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Signing in…
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </Form>
            </>
          ) : (
            /* ========== STEP 2: BRANCH PICKER (admin only) ========== */
            <>
              <p className="text-muted small mb-3">
                Welcome, <strong>{user?.name || user?.username}</strong>. You
                have access to multiple branches — pick one to continue.
              </p>

              {branchError && (
                <Alert variant="danger" className="py-2 small">
                  {branchError}
                </Alert>
              )}

              <Form onSubmit={submitBranch} noValidate>
                <Form.Group className="mb-3" controlId="branchSelect">
                  <Form.Label>Branch</Form.Label>

                  {loadingBranches ? (
                    <div className="text-muted small d-flex align-items-center gap-2">
                      <Spinner animation="border" size="sm" />
                      Loading branches…
                    </div>
                  ) : branches.length === 0 ? (
                    <Alert variant="info" className="py-2 small mb-0">
                      No branches available for your account.
                    </Alert>
                  ) : (
                    <Form.Select
                      value={branchId}
                      onChange={(e) => setBranchId(e.target.value)}
                      autoFocus
                    >
                      <option value="">— Select a branch —</option>
                      {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.branch_name}
                        </option>
                      ))}
                    </Form.Select>
                  )}
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 d-flex align-items-center justify-content-center"
                  disabled={
                    branchBusy || loadingBranches || branches.length === 0
                  }
                >
                  {branchBusy ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Continuing…
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </Form>
            </>
          )}

          <p className="text-muted small text-center mt-3 mb-0">
            Contact your administrator if you cannot access your account.
          </p>
        </Card.Body>
      </Card>
    </div>
  );
}
