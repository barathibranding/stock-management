import React from "react";
import { Card } from "react-bootstrap";
import Layout from "../components/Layout";

export default function PagePlaceholder({ title, description, icon }) {
  return (
    <Layout>
      <div className="mb-4">
        <h1 className="h3 mb-1">
          {icon && <i className={`bi ${icon} me-2`} />}
          {title}
        </h1>
        <p className="text-muted mb-0">{description}</p>
      </div>
      <Card className="border-0 shadow-sm">
        <Card.Body className="text-center py-5">
          <i className={`bi ${icon || "bi-tools"} display-4 text-muted`} />
          <p className="text-muted mt-3 mb-0">
            This page is a placeholder. Content coming soon.
          </p>
        </Card.Body>
      </Card>
    </Layout>
  );
}
