// D:\freelanceing\product tracking\stock-management\frontend\src\pages\BranchSelection.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Card, Col, Row, Spinner } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { listBranches } from "../api/branches";
import { getErrorMessage } from "../utils/Errors";

export default function BranchSelection() {
  const { user, selectBranch, logout } = useAuth();
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listBranches()
      .then((data) => {
        if (!cancelled) setBranches(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const choose = async (branch) => {
    setError("");
    setSelecting(branch.id);
    try {
      await selectBranch(branch.id);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
      setSelecting(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light px-3 py-4">
      <Card
        className="shadow-sm border-0"
        style={{ maxWidth: 900, width: "100%" }}
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
              <h1 className="h4 mb-0">Select a Branch</h1>
              <p className="text-muted small mb-0">
                Welcome back, {user?.name || user?.username}. Choose which
                branch you want to work in.
              </p>
            </div>
          </div>

          {error && (
            <Alert variant="danger" className="py-2 small">
              {error}
            </Alert>
          )}

          {loading && (
            <div className="text-center text-muted py-5">
              <Spinner
                animation="border"
                size="sm"
                role="status"
                className="me-2"
              />
              Loading branches…
            </div>
          )}

          {!loading && branches.length === 0 && (
            <Alert variant="info" className="py-2 small mb-0">
              No branches are available for your account.
            </Alert>
          )}

          {!loading && branches.length > 0 && (
            <Row xs={1} sm={2} md={3} className="g-3">
              {branches.map((b) => (
                <Col key={b.id}>
                  <Button
                    variant="outline-primary"
                    className="w-100 h-100 py-3 d-flex flex-column align-items-center justify-content-center gap-1"
                    onClick={() => choose(b)}
                    disabled={selecting !== null}
                  >
                    <span className="fs-2 lh-1">🏢</span>
                    <span className="fw-semibold">{b.branch_name}</span>
                    <span className="text-muted small">Branch #{b.id}</span>
                    {selecting === b.id && (
                      <span className="small d-inline-flex align-items-center gap-1">
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        Selecting…
                      </span>
                    )}
                  </Button>
                </Col>
              ))}
            </Row>
          )}

          <div className="text-center border-top mt-4 pt-3">
            <Button
              variant="link"
              size="sm"
              className="text-muted text-decoration-none"
              onClick={handleLogout}
            >
              Sign out
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
