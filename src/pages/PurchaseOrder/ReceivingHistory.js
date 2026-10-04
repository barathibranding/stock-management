import React, { useEffect, useState } from "react";
import { Alert, Button, Card, Spinner, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import Layout from "../../components/Layout";
import {
  getPurchaseOrder,
  getReceivingHistory,
} from "../../api/purchaseOrders";
import { getErrorMessage } from "../../utils/Errors";

export default function ReceivingHistory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [po, setPo] = useState(null);
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setLoading(true);

      const [poData, historyData] = await Promise.all([
        getPurchaseOrder(id),
        getReceivingHistory(id),
      ]);

      setPo(poData);

      setHistory(historyData?.results || historyData || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [id]);

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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Receiving History</h1>

          <p className="text-muted mb-0">{po?.po_number}</p>
        </div>

        <Button
          variant="outline-primary"
          onClick={() => navigate(`/purchase-orders/${id}`)}
        >
          ← Back to PO
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="border-0 shadow-sm">
        <Card.Body>
          {history.length === 0 ? (
            <div className="text-center text-muted py-5">
              No receiving history found.
            </div>
          ) : (
            <div className="table-responsive">
              <Table bordered hover className="align-middle">
                <thead>
                  <tr>
                    <th>Receipt Date</th>
                    <th>Product</th>
                    <th>Barcode</th>
                    <th>Quantity</th>
                    <th>Remarks</th>
                  </tr>
                </thead>

                <tbody>
                  {history.map((receipt, index) => {
                    /*
                     * This supports either:
                     *
                     * {
                     *   receipt_date,
                     *   quantity,
                     *   remarks
                     * }
                     *
                     * or a response containing items.
                     */
                    if (Array.isArray(receipt.items)) {
                      return receipt.items.map((item, itemIndex) => (
                        <tr key={`${index}-${itemIndex}`}>
                          <td>{receipt.receipt_date}</td>

                          <td>
                            {item.short_description || item.product_name || "—"}
                          </td>

                          <td>{item.barcode || "—"}</td>

                          <td>{item.quantity}</td>

                          <td>{receipt.remarks || "—"}</td>
                        </tr>
                      ));
                    }

                    return (
                      <tr key={receipt.id || index}>
                        <td>{receipt.receipt_date}</td>

                        <td>{receipt.short_description || "—"}</td>

                        <td>{receipt.barcode || "—"}</td>

                        <td>{receipt.quantity}</td>

                        <td>{receipt.remarks || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Layout>
  );
}
