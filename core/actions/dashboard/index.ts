import { withAdminAuth } from "@/core/auth/withAdminAuth";

import { dashboardChangeUserRole as dashboardChangeUserRoleImpl } from "./dashboard-change-user-role";
import { createDashboardNewProblem as createDashboardNewProblemImpl } from "./dashboard-create-new-problem";
import { deleteProblem as deleteProblemImpl } from "./dashboard-delete-problem";
import { dashboardDeleteSingleUser as dashboardDeleteSingleUserImpl } from "./dashboard-delete-single-user";
import { dashboardGetAllUserDetails as dashboardGetAllUserDetailsImpl } from "./dashboard-get-all-user-details";
import { getAdminAllProblems as getAdminAllProblemsImpl } from "./dashboard-get-problems-list";
import { getDashboardData as getDashboardDataImpl } from "./dashboard-get-stats-data";
import { updateDashboardProblem as updateDashboardProblemImpl } from "./dashboard-update-problem";

export const deleteProblem = async (
  ...args: Parameters<typeof deleteProblemImpl>
) => {
  return withAdminAuth(deleteProblemImpl)(...args);
};

export const getDashboardData = async (
  ...args: Parameters<typeof getDashboardDataImpl>
) => {
  return withAdminAuth(getDashboardDataImpl)(...args);
};

export const getAdminAllProblems = async (
  ...args: Parameters<typeof getAdminAllProblemsImpl>
) => {
  return withAdminAuth(getAdminAllProblemsImpl)(...args);
};

export const createDashboardNewProblem = async (
  ...args: Parameters<typeof createDashboardNewProblemImpl>
) => {
  return withAdminAuth(createDashboardNewProblemImpl)(...args);
};

export const updateDashboardProblem = async (
  ...args: Parameters<typeof updateDashboardProblemImpl>
) => {
  return withAdminAuth(updateDashboardProblemImpl)(...args);
};

export const dashboardGetAllUserDetails = async (
  ...args: Parameters<typeof dashboardGetAllUserDetailsImpl>
) => {
  return withAdminAuth(dashboardGetAllUserDetailsImpl)(...args);
};

export const dashboardChangeUserRole = async (
  ...args: Parameters<typeof dashboardChangeUserRoleImpl>
) => {
  return withAdminAuth(dashboardChangeUserRoleImpl)(...args);
};

export const dashboardDeleteSingleUser = async (
  ...args: Parameters<typeof dashboardDeleteSingleUserImpl>
) => {
  return withAdminAuth(dashboardDeleteSingleUserImpl)(...args);
};
