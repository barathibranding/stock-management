// import React, { useState } from "react";
// import { Container, Offcanvas } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import Header from "./Header";
// import Sidebar from "./Sidebar";
// import { useAuth } from "../context/AuthContext";

// export default function Layout({ children }) {
//   const { logout, clearBranch } = useAuth();
//   const navigate = useNavigate();
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [busy, setBusy] = useState(false);

//   const handleLogout = async () => {
//     setBusy(true);
//     await logout();
//     navigate("/login", { replace: true });
//   };

//   const handleSwitchBranch = () => {
//     clearBranch();
//     navigate("/select-branch", { replace: true });
//   };

//   return (
//     <div className="d-flex min-vh-100 bg-light">
//       {/* ===== Desktop sidebar (fixed) ===== */}
//       <aside
//         className="d-none d-lg-flex flex-column flex-shrink-0"
//         style={{ width: 260 }}
//       >
//         <Sidebar />
//       </aside>

//       {/* ===== Mobile sidebar (offcanvas drawer) ===== */}
//       <Offcanvas
//         show={showSidebar}
//         onHide={() => setShowSidebar(false)}
//         responsive="lg"
//         style={{ width: 260 }}
//       >
//         <Offcanvas.Header closeButton className="border-bottom">
//           <Offcanvas.Title className="fs-6">Menu</Offcanvas.Title>
//         </Offcanvas.Header>
//         <Offcanvas.Body className="p-0">
//           <Sidebar onNavigate={() => setShowSidebar(false)} />
//         </Offcanvas.Body>
//       </Offcanvas>

//       {/* ===== Main column (header + page content) ===== */}
//       <div className="d-flex flex-column flex-grow-1 min-w-0">
//         <Header
//           onToggleSidebar={() => setShowSidebar((v) => !v)}
//           busy={busy}
//           onLogout={handleLogout}
//           onSwitchBranch={handleSwitchBranch}
//         />

//         <main className="flex-grow-1 py-4">
//           <Container fluid className="px-3 px-lg-4">
//             {children}
//           </Container>
//         </main>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { Container, Offcanvas } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
  const { logout, clearBranch } = useAuth();
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleLogout = async () => {
    setBusy(true);
    await logout();
    navigate("/login", { replace: true });
  };

  const handleSwitchBranch = () => {
    clearBranch();
    navigate("/select-branch", { replace: true });
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* ===== Desktop sidebar (fixed) ===== */}
      <aside
        className="d-none d-lg-flex flex-column flex-shrink-0"
        style={{ width: 260 }}
      >
        <Sidebar />
      </aside>

      {/* ===== Mobile sidebar (offcanvas drawer) ===== */}
      <Offcanvas
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
        placement="start"
        style={{ width: 260 }}
      >
        <Offcanvas.Header closeButton className="border-bottom">
          <Offcanvas.Title className="fs-6">Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <Sidebar onNavigate={() => setShowSidebar(false)} />
        </Offcanvas.Body>
      </Offcanvas>

      {/* ===== Main column (header + page content) ===== */}
      <div className="d-flex flex-column flex-grow-1 min-w-0">
        <Header
          onToggleSidebar={() => setShowSidebar((v) => !v)}
          busy={busy}
          onLogout={handleLogout}
          onSwitchBranch={handleSwitchBranch}
        />

        <main className="flex-grow-1 py-4">
          <Container fluid className="px-3 px-lg-4">
            {children}
          </Container>
        </main>
      </div>
    </div>
  );
}
