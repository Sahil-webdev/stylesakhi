import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { User, Bell, Shield, Globe, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getAdminAuthHeaders } from "@/lib/adminAuth";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://stylesakhi.com/api").replace(/\/+$/, "");

type SettingsPayload = {
  profile: {
    firstName: string;
    lastName: string;
    name: string;
    email: string;
  };
  notifications: {
    emailNotifs: boolean;
    pushNotifs: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
  };
  store: {
    publicStore: boolean;
  };
};

const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
  <button onClick={onChange} className={`relative h-6 w-11 rounded-full transition-colors ${enabled ? "bg-primary" : "bg-muted"}`}>
    <motion.div
      animate={{ x: enabled ? 20 : 2 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="absolute top-1 h-4 w-4 rounded-full bg-primary-foreground shadow-sm"
    />
  </button>
);

const SettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SettingsPayload>({
    profile: {
      firstName: "",
      lastName: "",
      name: "",
      email: "",
    },
    notifications: {
      emailNotifs: true,
      pushNotifs: false,
    },
    security: {
      twoFactorEnabled: false,
    },
    store: {
      publicStore: true,
    },
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/settings`, {
        headers: getAdminAuthHeaders(),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "Failed to load settings");
      }
      const data = payload?.data;
      setSettings({
        profile: {
          firstName: data?.profile?.firstName || "",
          lastName: data?.profile?.lastName || "",
          name: data?.profile?.name || "",
          email: data?.profile?.email || "",
        },
        notifications: {
          emailNotifs: Boolean(data?.notifications?.emailNotifs),
          pushNotifs: Boolean(data?.notifications?.pushNotifs),
        },
        security: {
          twoFactorEnabled: Boolean(data?.security?.twoFactorEnabled),
        },
        store: {
          publicStore: Boolean(data?.store?.publicStore),
        },
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleProfileChange = (field: "firstName" | "lastName" | "name" | "email", value: string) => {
    setSettings((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value,
      },
    }));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const payload: SettingsPayload = {
        ...settings,
        profile: {
          ...settings.profile,
          name: settings.profile.name || `${settings.profile.firstName} ${settings.profile.lastName}`.trim(),
        },
      };

      const response = await fetch(`${API_BASE_URL}/admin/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAdminAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.error || "Failed to save settings");
      }

      toast.success("Settings saved");
      await fetchSettings();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account and preferences</p>
      </div>

      {loading ? (
        <div className="glass-card p-8 text-sm text-muted-foreground">Loading settings...</div>
      ) : (
        <div className="max-w-2xl space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Profile</h3>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">First Name</label>
                <input
                  value={settings.profile.firstName}
                  onChange={(e) => handleProfileChange("firstName", e.target.value)}
                  className="w-full rounded-xl border border-transparent bg-muted/50 px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Last Name</label>
                <input
                  value={settings.profile.lastName}
                  onChange={(e) => handleProfileChange("lastName", e.target.value)}
                  className="w-full rounded-xl border border-transparent bg-muted/50 px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Display Name</label>
                <input
                  value={settings.profile.name}
                  onChange={(e) => handleProfileChange("name", e.target.value)}
                  className="w-full rounded-xl border border-transparent bg-muted/50 px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</label>
                <input
                  type="email"
                  value={settings.profile.email}
                  onChange={(e) => handleProfileChange("email", e.target.value)}
                  className="w-full rounded-xl border border-transparent bg-muted/50 px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive order updates via email</p>
                </div>
                <ToggleSwitch
                  enabled={settings.notifications.emailNotifs}
                  onChange={() =>
                    setSettings((prev) => ({
                      ...prev,
                      notifications: { ...prev.notifications, emailNotifs: !prev.notifications.emailNotifs },
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Push Notifications</p>
                  <p className="text-xs text-muted-foreground">Browser push notifications</p>
                </div>
                <ToggleSwitch
                  enabled={settings.notifications.pushNotifs}
                  onChange={() =>
                    setSettings((prev) => ({
                      ...prev,
                      notifications: { ...prev.notifications, pushNotifs: !prev.notifications.pushNotifs },
                    }))
                  }
                />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Security</h3>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
              </div>
              <ToggleSwitch
                enabled={settings.security.twoFactorEnabled}
                onChange={() =>
                  setSettings((prev) => ({
                    ...prev,
                    security: { twoFactorEnabled: !prev.security.twoFactorEnabled },
                  }))
                }
              />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Store</h3>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Public Store</p>
                <p className="text-xs text-muted-foreground">Make your store visible to everyone</p>
              </div>
              <ToggleSwitch
                enabled={settings.store.publicStore}
                onChange={() =>
                  setSettings((prev) => ({
                    ...prev,
                    store: { publicStore: !prev.store.publicStore },
                  }))
                }
              />
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => void saveSettings()}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Save Changes
          </motion.button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SettingsPage;
