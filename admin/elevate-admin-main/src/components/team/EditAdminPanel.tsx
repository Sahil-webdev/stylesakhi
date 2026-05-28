import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2, Shield, ShieldCheck, ShieldAlert, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { getDefaultPermissions, type TeamMember, type Permission, type AppRole } from "@/hooks/useRBAC";
import { getAdminToken } from "@/lib/adminAuth";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://stylesakhi.com/api").replace(/\/+$/, "");

const roleOptions: { role: AppRole; label: string; icon: typeof Shield }[] = [
  { role: "super_admin", label: "Super Admin", icon: ShieldAlert },
  { role: "admin", label: "Admin", icon: ShieldCheck },
  { role: "manager", label: "Manager", icon: Shield },
  { role: "staff", label: "Staff", icon: Eye },
];

interface EditAdminPanelProps {
  member: TeamMember;
  onClose: () => void;
}

export const EditAdminPanel = ({ member, onClose }: EditAdminPanelProps) => {
  const [name, setName] = useState(member.full_name);
  const [email, setEmail] = useState(member.email);
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AppRole>(member.role);
  const [isActive, setIsActive] = useState(Boolean(member.is_active));
  const [permissions, setPermissions] = useState<Permission[]>(
    member.permissions?.length ? member.permissions : getDefaultPermissions(member.role),
  );
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();

  const handleRoleChange = (newRole: AppRole) => {
    setRole(newRole);
    setPermissions(getDefaultPermissions(newRole));
  };

  const togglePermission = (module: string, field: "can_view" | "can_create" | "can_edit" | "can_delete") => {
    setPermissions((prev) => prev.map((p) => (p.module === module ? { ...p, [field]: !p[field] } : p)));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/team/${member.user_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAdminToken()}`,
        },
        body: JSON.stringify({
          fullName: name.trim(),
          email: email.trim().toLowerCase(),
          password: password.trim() ? password.trim() : undefined,
          role,
          isActive,
          permissions,
        }),
      });
      const payload = await res.json();
      if (!res.ok || !payload?.success) {
        throw new Error(payload?.error || "Failed to update team member");
      }

      toast({ title: "Changes saved!", description: `${name}'s role and permissions updated.` });
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
      onClose();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 z-50 h-screen w-full max-w-lg overflow-y-auto border-l border-border/50 bg-card shadow-2xl"
      >
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Edit Member</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Set New Password (optional)</Label>
                <Input type="password" placeholder="Leave blank to keep current password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <div className="grid grid-cols-2 gap-2">
                {roleOptions.map((r) => {
                  const isSelected = role === r.role;
                  return (
                    <motion.button
                      key={r.role}
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleRoleChange(r.role)}
                      className={`rounded-xl border p-3 text-left text-sm font-medium transition-all ${
                        isSelected ? "border-primary bg-primary/5 text-primary" : "border-border/50 text-muted-foreground hover:border-border"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <r.icon className="h-4 w-4" />
                        {r.label}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border/50 px-3 py-2">
              <span className="text-sm text-foreground">Enabled</span>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>

            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="overflow-hidden rounded-xl border border-border/50">
                <div className="grid grid-cols-5 gap-0 border-b border-border/50 bg-muted/30 px-4 py-2 text-xs font-medium text-muted-foreground">
                  <span>Module</span>
                  <span className="text-center">View</span>
                  <span className="text-center">Create</span>
                  <span className="text-center">Edit</span>
                  <span className="text-center">Delete</span>
                </div>
                {permissions.map((perm) => (
                  <div key={perm.module} className="grid grid-cols-5 gap-0 border-b border-border/30 px-4 py-3 transition-colors last:border-0 hover:bg-muted/20">
                    <span className="text-sm font-medium capitalize text-foreground">{perm.module}</span>
                    {(["can_view", "can_create", "can_edit", "can_delete"] as const).map((field) => (
                      <div key={field} className="flex justify-center">
                        <Switch checked={perm[field]} onCheckedChange={() => togglePermission(perm.module, field)} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
              <Button className="flex-1 gap-2 shadow-lg shadow-primary/25" onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

