// import api from "./client";

// export async function listBranches() {
//   const { data } = await api.get("branches/");
//   return data;
// }

// export async function selectBranch(branchId) {
//   const { data } = await api.post("branches/select/", { branch_id: branchId });
//   return data;
// }

// export async function getBranchDetails(branchId) {
//   const { data } = await api.get("branch-details/", {
//     params: { branch_id: branchId },
//   });
//   return data;
// }

import api from "./client";

export async function listBranches() {
  const { data } = await api.get("branches/");
  return data;
}

export async function selectBranch(branchId) {
  const { data } = await api.post("branches/select/", {
    branch_id: branchId,
  });

  return data;
}

export async function getBranchDetails(branchId) {
  const { data } = await api.get("branch-details/", {
    params: {
      branch_id: branchId,
    },
  });

  return data;
}
