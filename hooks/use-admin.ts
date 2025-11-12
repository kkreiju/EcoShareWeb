import { useState, useEffect, useCallback } from "react";
import {
  getAdminId,
  getReports,
  getUsers,
  type BackendReport,
  type BackendUser,
} from "@/lib/services/adminService";

interface UseAdminReturn {
  adminId: string | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Custom hook to get admin ID and handle admin authentication
 */
export function useAdmin(): UseAdminReturn {
  const [adminId, setAdminId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminId = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const id = await getAdminId();
      if (!id) {
        setError("Admin access required. Please log in as an admin.");
      }
      setAdminId(id);
    } catch (err) {
      console.error("Error fetching admin ID:", err);
      setError(err instanceof Error ? err.message : "Failed to verify admin access");
      setAdminId(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminId();
  }, [fetchAdminId]);

  return {
    adminId,
    isLoading,
    error,
    refresh: fetchAdminId,
  };
}

interface UseAdminReportsReturn {
  reports: BackendReport[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Custom hook to fetch admin reports
 */
export function useAdminReports(adminId: string | null): UseAdminReportsReturn {
  const [reports, setReports] = useState<BackendReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    if (!adminId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await getReports(adminId);
      setReports(response.reports || []);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError(err instanceof Error ? err.message : "Failed to load reports");
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  }, [adminId]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return {
    reports,
    isLoading,
    error,
    refresh: fetchReports,
  };
}

interface UseAdminUsersReturn {
  users: BackendUser[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Custom hook to fetch admin users
 */
export function useAdminUsers(adminId: string | null): UseAdminUsersReturn {
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!adminId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await getUsers(adminId);
      setUsers(response.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err instanceof Error ? err.message : "Failed to load users");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [adminId]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    error,
    refresh: fetchUsers,
  };
}

