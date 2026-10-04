// import React from "react";
// import { Nav } from "react-bootstrap";
// import { NavLink } from "react-router-dom";

// const navItems = [
//   { to: "/dashboard", label: "Dashboard", icon: "bi-speedometer2" },
//   { to: "/products", label: "Products", icon: "bi-box-seam" },
//   { to: "/purchase-orders", label: "Purchase Orders", icon: "bi-cart-check" },
//   {
//     to: "/stock-movements",
//     label: "Stock Movements",
//     icon: "bi-arrow-left-right",
//   },
//   { to: "/suppliers", label: "Suppliers", icon: "bi-truck" },
//   { to: "/reports", label: "Reports", icon: "bi-bar-chart" },
//   { to: "/users", label: "Users", icon: "bi-people" },
//   { to: "/settings", label: "Settings", icon: "bi-gear" },
// ];

// export default function Sidebar({ onNavigate }) {
//   return (
//     <div className="d-flex flex-column h-100 bg-white border-end">
//       {/* Brand */}
//       <div className="d-flex align-items-center gap-2 px-3 py-3 border-bottom">
//         <div
//           className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
//           style={{ width: 40, height: 40 }}
//         >
//           FH
//         </div>
//         <div className="lh-sm">
//           <div className="fw-semibold">Famous Heavy Equipment</div>
//           <div className="text-muted small">v1.0</div>
//         </div>
//       </div>

//       {/* Nav links */}
//       <Nav className="flex-column flex-grow-1 py-2 overflow-auto">
//         {navItems.map((item) => (
//           <Nav.Link
//             key={item.to}
//             as={NavLink}
//             to={item.to}
//             onClick={onNavigate}
//             className={({ isActive }) =>
//               `d-flex align-items-center gap-2 px-3 py-2 mx-2 rounded-2 ${
//                 isActive ? "bg-primary text-white" : "text-body"
//               }`
//             }
//             end={item.to === "/dashboard"}
//           >
//             <i className={`bi ${item.icon} fs-5`} />
//             <span>{item.label}</span>
//           </Nav.Link>
//         ))}
//       </Nav>

//       <div className="border-top px-3 py-2 text-muted small">
//         © {new Date().getFullYear()} Famous Heavy Equipment
//       </div>
//     </div>
//   );
// }

// import React from "react";
// import { Nav } from "react-bootstrap";
// import { NavLink } from "react-router-dom";

// const navItems = [
//   {
//     to: "/dashboard",
//     label: "Dashboard",
//     icon: "bi-speedometer2",
//   },
//   {
//     to: "/products",
//     label: "Products",
//     icon: "bi-box-seam",
//     children: [
//       {
//         to: "/products",
//         label: "Product List",
//         icon: "bi-list-ul",
//       },
//       {
//         to: "/products/create",
//         label: "Add Product",
//         icon: "bi-plus-circle",
//       },
//     ],
//   },
//   {
//     to: "/purchase-orders",
//     label: "Purchase Orders",
//     icon: "bi-cart-check",
//   },
//   {
//     to: "/stock-movements",
//     label: "Stock Movements",
//     icon: "bi-arrow-left-right",
//   },
//   {
//     to: "/suppliers",
//     label: "Suppliers",
//     icon: "bi-truck",
//   },
//   {
//     to: "/reports",
//     label: "Reports",
//     icon: "bi-bar-chart",
//   },
//   {
//     to: "/users",
//     label: "Users",
//     icon: "bi-people",
//   },
//   {
//     to: "/settings",
//     label: "Settings",
//     icon: "bi-gear",
//   },
// ];

// export default function Sidebar({ onNavigate }) {
//   return (
//     <div className="d-flex flex-column h-100 bg-white border-end">
//       {/* Brand */}
//       <div className="d-flex align-items-center gap-2 px-3 py-3 border-bottom">
//         <div
//           className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
//           style={{
//             width: 40,
//             height: 40,
//           }}
//         >
//           FH
//         </div>

//         <div className="lh-sm">
//           <div className="fw-semibold">Famous Heavy Equipment</div>

//           <div className="text-muted small">Inventory Management</div>
//         </div>
//       </div>

//       {/* Navigation */}
//       <Nav className="flex-column flex-grow-1 py-2 overflow-auto">
//         {navItems.map((item) => {
//           const hasChildren = item.children && item.children.length > 0;

//           return (
//             <React.Fragment key={item.to}>
//               {/* Main navigation item */}
//               <Nav.Link
//                 as={NavLink}
//                 to={item.to}
//                 onClick={onNavigate}
//                 className={({ isActive }) =>
//                   `d-flex align-items-center gap-2 px-3 py-2 mx-2 rounded-2 ${
//                     isActive ? "bg-primary text-white" : "text-body"
//                   }`
//                 }
//                 end={item.to === "/dashboard" || item.to === "/products"}
//               >
//                 <i className={`bi ${item.icon} fs-5`} />

//                 <span className="flex-grow-1">{item.label}</span>

//                 {hasChildren && <i className="bi bi-chevron-right small" />}
//               </Nav.Link>

//               {/* Product submenu */}
//               {hasChildren && (
//                 <div className="ms-4 me-2">
//                   {item.children.map((child) => (
//                     <Nav.Link
//                       key={child.to}
//                       as={NavLink}
//                       to={child.to}
//                       onClick={onNavigate}
//                       className={({ isActive }) =>
//                         `d-flex align-items-center gap-2 px-3 py-2 rounded-2 small ${
//                           isActive
//                             ? "bg-light text-primary fw-semibold"
//                             : "text-secondary"
//                         }`
//                       }
//                       end={child.to === "/products"}
//                     >
//                       <i className={`bi ${child.icon}`} />

//                       <span>{child.label}</span>
//                     </Nav.Link>
//                   ))}
//                 </div>
//               )}
//             </React.Fragment>
//           );
//         })}
//       </Nav>

//       {/* Footer */}
//       <div className="border-top px-3 py-2 text-muted small">
//         © {new Date().getFullYear()} Famous Heavy Equipment
//       </div>
//     </div>
//   );
// }

// import React from "react";
// import { Nav } from "react-bootstrap";
// import { NavLink } from "react-router-dom";

// const navItems = [
//   // Dashboard
//   {
//     to: "/dashboard",
//     label: "Dashboard",
//     icon: "bi-speedometer2",
//   },

//   // Products
//   {
//     to: "/products",
//     label: "Products",
//     icon: "bi-box-seam",
//     children: [
//       {
//         to: "/products",
//         label: "Product List",
//         icon: "bi-list-ul",
//       },
//       {
//         to: "/products/create",
//         label: "Add Product",
//         icon: "bi-plus-circle",
//       },
//     ],
//   },

//   // Suppliers
//   {
//     to: "/suppliers",
//     label: "Suppliers",
//     icon: "bi-truck",
//     children: [
//       {
//         to: "/suppliers",
//         label: "Supplier List",
//         icon: "bi-list-ul",
//       },
//       {
//         to: "/suppliers/create",
//         label: "Add Supplier",
//         icon: "bi-plus-circle",
//       },
//     ],
//   },

//   // Purchase Orders
//   {
//     to: "/purchase-orders",
//     label: "Purchase Orders",
//     icon: "bi-cart-check",
//     children: [
//       {
//         to: "/purchase-orders",
//         label: "Purchase Order List",
//         icon: "bi-list-ul",
//       },
//       {
//         to: "/purchase-orders/create",
//         label: "Create Purchase Order",
//         icon: "bi-plus-circle",
//       },
//     ],
//   },

//   // Stock
//   {
//     to: "/stock-movements",
//     label: "Stock Movements",
//     icon: "bi-arrow-left-right",
//     children: [
//       {
//         to: "/stock-movements",
//         label: "Stock Movement List",
//         icon: "bi-list-ul",
//       },
//       {
//         to: "/stock-movements/receiving",
//         label: "Stock Receiving",
//         icon: "bi-box-arrow-in-down",
//       },
//     ],
//   },

//   // Reports
//   {
//     to: "/reports",
//     label: "Reports",
//     icon: "bi-bar-chart",
//     children: [
//       {
//         to: "/reports",
//         label: "Report Dashboard",
//         icon: "bi-grid",
//       },
//       {
//         to: "/reports/purchases",
//         label: "Purchase Reports",
//         icon: "bi-cart",
//       },
//       {
//         to: "/reports/receiving",
//         label: "Receiving Reports",
//         icon: "bi-box-arrow-in-down",
//       },
//       {
//         to: "/reports/stock",
//         label: "Stock Reports",
//         icon: "bi-box-seam",
//       },
//     ],
//   },

//   // Users
//   {
//     to: "/users",
//     label: "Users",
//     icon: "bi-people",
//     children: [
//       {
//         to: "/users",
//         label: "User List",
//         icon: "bi-list-ul",
//       },
//       {
//         to: "/users/create",
//         label: "Add User",
//         icon: "bi-person-plus",
//       },
//     ],
//   },

//   // Settings
//   {
//     to: "/settings",
//     label: "Settings",
//     icon: "bi-gear",
//   },
// ];

// export default function Sidebar({ onNavigate }) {
//   return (
//     <div className="d-flex flex-column h-100 bg-white border-end">
//       {/* Brand */}
//       <div className="d-flex align-items-center gap-2 px-3 py-3 border-bottom">
//         <div
//           className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
//           style={{
//             width: 40,
//             height: 40,
//           }}
//         >
//           FH
//         </div>

//         <div className="lh-sm">
//           <div className="fw-semibold">Famous Heavy Equipment</div>

//           <div className="text-muted small">Inventory Management</div>
//         </div>
//       </div>

//       {/* Navigation */}
//       <Nav className="flex-column flex-grow-1 py-2 overflow-auto">
//         {navItems.map((item) => {
//           const hasChildren = item.children && item.children.length > 0;

//           return (
//             <React.Fragment key={item.to}>
//               {/* Main Navigation */}
//               <Nav.Link
//                 as={NavLink}
//                 to={item.to}
//                 onClick={onNavigate}
//                 className={({ isActive }) =>
//                   `d-flex align-items-center gap-2 px-3 py-2 mx-2 rounded-2 ${
//                     isActive ? "bg-primary text-white" : "text-body"
//                   }`
//                 }
//                 end={
//                   item.to === "/dashboard" ||
//                   item.to === "/products" ||
//                   item.to === "/suppliers" ||
//                   item.to === "/purchase-orders" ||
//                   item.to === "/stock-movements" ||
//                   item.to === "/reports" ||
//                   item.to === "/users"
//                 }
//               >
//                 <i className={`bi ${item.icon} fs-5`} />

//                 <span className="flex-grow-1">{item.label}</span>

//                 {hasChildren && <i className="bi bi-chevron-right small" />}
//               </Nav.Link>

//               {/* Sub Navigation */}
//               {hasChildren && (
//                 <div className="ms-4 me-2">
//                   {item.children.map((child) => (
//                     <Nav.Link
//                       key={child.to}
//                       as={NavLink}
//                       to={child.to}
//                       onClick={onNavigate}
//                       className={({ isActive }) =>
//                         `d-flex align-items-center gap-2 px-3 py-2 rounded-2 small ${
//                           isActive
//                             ? "bg-light text-primary fw-semibold"
//                             : "text-secondary"
//                         }`
//                       }
//                       end={
//                         child.to === "/products" ||
//                         child.to === "/suppliers" ||
//                         child.to === "/purchase-orders" ||
//                         child.to === "/stock-movements" ||
//                         child.to === "/reports" ||
//                         child.to === "/users"
//                       }
//                     >
//                       <i className={`bi ${child.icon}`} />

//                       <span>{child.label}</span>
//                     </Nav.Link>
//                   ))}
//                 </div>
//               )}
//             </React.Fragment>
//           );
//         })}
//       </Nav>

//       {/* Footer */}
//       <div className="border-top px-3 py-2 text-muted small">
//         © {new Date().getFullYear()} Famous Heavy Equipment
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { Accordion, Nav } from "react-bootstrap";
import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: "bi-speedometer2",
  },

  {
    to: "/products",
    label: "Products",
    icon: "bi-box-seam",
    children: [
      {
        to: "/products",
        label: "Product List",
        icon: "bi-list-ul",
      },
      {
        to: "/products/create",
        label: "Add Product",
        icon: "bi-plus-circle",
      },
    ],
  },

  {
    to: "/suppliers",
    label: "Suppliers",
    icon: "bi-truck",
    children: [
      {
        to: "/suppliers",
        label: "Supplier List",
        icon: "bi-list-ul",
      },
      {
        to: "/suppliers/create",
        label: "Add Supplier",
        icon: "bi-plus-circle",
      },
    ],
  },

  {
    to: "/purchase-orders",
    label: "Purchase Orders",
    icon: "bi-cart-check",
    children: [
      {
        to: "/purchase-orders",
        label: "Purchase Order List",
        icon: "bi-list-ul",
      },
      {
        to: "/purchase-orders/create",
        label: "Create Purchase Order",
        icon: "bi-plus-circle",
      },
    ],
  },

  {
    to: "/reports",
    label: "Reports",
    icon: "bi-bar-chart",
    children: [
      {
        to: "/reports",
        label: "Report Dashboard",
        icon: "bi-grid",
      },
      {
        to: "/reports/purchases",
        label: "Purchase Reports",
        icon: "bi-cart",
      },
      {
        to: "/reports/receiving",
        label: "Receiving Reports",
        icon: "bi-box-arrow-in-down",
      },
      {
        to: "/reports/stock",
        label: "Stock Reports",
        icon: "bi-box-seam",
      },
    ],
  },

  {
    to: "/users",
    label: "Users",
    icon: "bi-people",
    children: [
      {
        to: "/users",
        label: "User List",
        icon: "bi-list-ul",
      },
      {
        to: "/users/create",
        label: "Add User",
        icon: "bi-person-plus",
      },
    ],
  },

  {
    to: "/settings",
    label: "Settings",
    icon: "bi-gear",
  },
];

export default function Sidebar({ onNavigate }) {
  const location = useLocation();

  // Find which menu should be open based on current URL
  const getActiveParent = () => {
    const activeItem = navItems.find((item) => {
      if (!item.children) return false;

      return (
        location.pathname === item.to ||
        location.pathname.startsWith(`${item.to}/`)
      );
    });

    return activeItem?.to || null;
  };

  const [openMenu, setOpenMenu] = useState(getActiveParent());

  // Automatically open the correct menu when URL changes
  useEffect(() => {
    const activeParent = getActiveParent();

    if (activeParent) {
      setOpenMenu(activeParent);
    }
  }, [location.pathname]);

  const handleParentClick = (item) => {
    if (!item.children) {
      onNavigate?.();
      return;
    }

    setOpenMenu((current) => (current === item.to ? null : item.to));
  };

  const handleChildClick = () => {
    onNavigate?.();
  };

  return (
    <div className="d-flex flex-column h-100 bg-white border-end">
      {/* =====================================================
          BRAND
      ====================================================== */}
      <div className="px-3 py-3 border-bottom">
        <div className="d-flex align-items-center gap-3">
          {/* Logo */}
          <div
            className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
            style={{
              width: "42px",
              height: "42px",
            }}
          >
            FH
          </div>

          {/* Brand Text */}
          <div className="lh-sm overflow-hidden">
            <div className="fw-bold text-dark text-truncate">
              Famous Heavy Equipment
            </div>

            <div className="text-muted small text-truncate">
              Inventory Management
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          NAVIGATION
      ====================================================== */}
      <div className="flex-grow-1 overflow-auto">
        <Nav className="flex-column p-2 gap-1">
          {navItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;

            const isParentActive =
              location.pathname === item.to ||
              location.pathname.startsWith(`${item.to}/`);

            /* ===============================================
               SIMPLE MENU ITEM
            ================================================ */
            if (!hasChildren) {
              return (
                <Nav.Link
                  key={item.to}
                  as={NavLink}
                  to={item.to}
                  onClick={() => handleParentClick(item)}
                  className={({ isActive }) =>
                    [
                      "d-flex",
                      "align-items-center",
                      "gap-3",
                      "px-3",
                      "py-2",
                      "rounded-3",
                      "fw-medium",
                      "text-decoration-none",
                      isActive
                        ? "bg-primary text-white shadow-sm"
                        : "text-dark",
                    ].join(" ")
                  }
                >
                  <i className={`bi ${item.icon} fs-5`} />

                  <span className="flex-grow-1">{item.label}</span>
                </Nav.Link>
              );
            }

            /* ===============================================
               PARENT + CHILD MENU
            ================================================ */
            return (
              <React.Fragment key={item.to}>
                {/* Parent */}
                <Nav.Link
                  as="button"
                  type="button"
                  onClick={() => handleParentClick(item)}
                  className={[
                    "d-flex",
                    "align-items-center",
                    "gap-3",
                    "px-3",
                    "py-2",
                    "rounded-3",
                    "border-0",
                    "w-100",
                    "text-start",
                    "fw-medium",
                    isParentActive ? "bg-primary text-white" : "text-dark",
                  ].join(" ")}
                >
                  <i className={`bi ${item.icon} fs-5`} />

                  <span className="flex-grow-1">{item.label}</span>

                  <i
                    className={`bi ${
                      openMenu === item.to
                        ? "bi-chevron-down"
                        : "bi-chevron-right"
                    } small`}
                  />
                </Nav.Link>

                {/* Children */}
                {openMenu === item.to && (
                  <div className="ms-3 border-start ps-2">
                    <Nav className="flex-column gap-1">
                      {item.children.map((child) => (
                        <Nav.Link
                          key={child.to}
                          as={NavLink}
                          to={child.to}
                          onClick={handleChildClick}
                          end={child.to === item.to}
                          className={({ isActive }) =>
                            [
                              "d-flex",
                              "align-items-center",
                              "gap-3",
                              "px-3",
                              "py-2",
                              "rounded-2",
                              "small",
                              "text-decoration-none",
                              isActive
                                ? "bg-primary-subtle text-primary fw-semibold"
                                : "text-secondary",
                            ].join(" ")
                          }
                        >
                          <i className={`bi ${child.icon}`} />

                          <span className="text-truncate">{child.label}</span>
                        </Nav.Link>
                      ))}
                    </Nav>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </Nav>
      </div>

      {/* =====================================================
          USER / FOOTER
      ====================================================== */}
      <div className="border-top p-3">
        <div className="d-flex align-items-center gap-2 mb-2">
          <div
            className="bg-light rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: "34px",
              height: "34px",
            }}
          >
            <i className="bi bi-person text-secondary" />
          </div>

          <div className="lh-sm">
            <div className="small fw-semibold">Inventory User</div>

            <div
              className="text-muted"
              style={{
                fontSize: "11px",
              }}
            >
              Staff Account
            </div>
          </div>
        </div>

        <div
          className="text-muted text-center border-top pt-2"
          style={{
            fontSize: "11px",
          }}
        >
          © {new Date().getFullYear()} Famous Heavy Equipment
        </div>
      </div>
    </div>
  );
}
