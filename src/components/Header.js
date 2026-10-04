import React from "react";
import { Button, Container, Navbar, Spinner } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

export default function Header({
  onToggleSidebar,
  busy,
  onLogout,
  onSwitchBranch,
}) {
  const { user, selectedBranch } = useAuth();
  const initials = (user?.name || user?.username || "?")
    .charAt(0)
    .toUpperCase();

  return (
    <Navbar
      bg="white"
      expand="lg"
      sticky="top"
      className="border-bottom shadow-sm py-2"
    >
      <Container fluid className="px-3 px-lg-4">
        {/* Hamburger — only visible on small screens */}
        <Button
          variant="outline-secondary"
          size="sm"
          className="d-lg-none me-2"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
        >
          <i className="bi bi-list fs-5" />
        </Button>

        {/* Title area (optional, shown on lg+) */}
        <Navbar.Brand className="d-none d-lg-flex align-items-center gap-2 mb-0">
          <span className="fw-semibold">Dashboard</span>
          <span className="text-muted small">
            {selectedBranch?.branch_name
              ? `· ${selectedBranch.branch_name}`
              : ""}
          </span>
        </Navbar.Brand>

        {/* Right side */}
        <div className="d-flex align-items-center gap-2 ms-auto">
          <div className="d-flex align-items-center gap-2 border rounded-pill ps-1 pe-3 py-1 bg-light">
            <div
              className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center fw-semibold flex-shrink-0"
              style={{ width: 32, height: 32 }}
            >
              {initials}
            </div>
            <div className="lh-sm d-none d-sm-block">
              <div className="small fw-semibold">
                {user?.name || user?.username}
              </div>
              <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                {user?.user_type}
              </div>
            </div>
          </div>

          {user?.requires_branch_selection && (
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={onSwitchBranch}
              className="d-none d-md-inline-flex"
            >
              Switch Branch
            </Button>
          )}

          <Button
            variant="outline-secondary"
            size="sm"
            onClick={onLogout}
            disabled={busy}
            className="d-inline-flex align-items-center"
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
                <span className="d-none d-sm-inline">Signing out…</span>
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-right d-sm-none" />
                <span className="d-none d-sm-inline">Sign Out</span>
              </>
            )}
          </Button>
        </div>
      </Container>
    </Navbar>
  );
}
