import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Shield, ShieldCheck, ShieldAlert, Eye, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { getDefaultPermissions, type AppRole } from "@/hooks/useRBAC";
import { getAdminToken } from "@/lib/adminAuth";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://stylesakhi.com/api").replace(/\/+$/, "");

const roleOptions: { role: AppRole; label: string; description: string; icon: typeof Shield }[] = [
  { role: "super_admin", label: "Super Admin", description: "Full unrestricted access to everything", icon: ShieldAlert },
  { role: "admin", label: "Admin", description: "Manage products, orders, and customers", icon: ShieldCheck },
  { role: "manager", label: "Manager", description: "Limited control over orders & customers", icon: Shield },
  { role: "staff", label: "Staff", description: "View-only or restricted actions", icon: Eye },
];

interface AddAdminModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddAdminModal = ({ open, onOpenChange }: AddAdminModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<AppRole>("staff");
  const [permissions, setPermissions] = useState(getDefaultPermissions("staff"));
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();

  const handleRoleSelect = (role: AppRole) => {
    setSelectedRole(role);
    setPermissions(getDefaultPermissions(role));
  };

  const togglePermission = (module: string, field: "can_view" | "can_create" | "can_edit" | "can_delete") => {
    setPermissions((prev) => prev.map((p) => (p.module === module ? { ...p, [field]: !p[field] } : p)));
  };

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast({ title: "Missing fields", description: "Name, email and password are required.", variant: "destructive" });
      return;
    }
    if (password.trim().length < 6) {
      toast({ title: "Weak password", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const token = getAdminToken();
      const res = await fetch(`${API_BASE_URL}/admin/team`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: name.trim(),
          email: email.trim().toLowerCase(),
          password: password.trim(),
          role: selectedRole,
          permissions,
        }),
      });
      const payload = await res.json();
      if (!res.ok || !payload?.success) {
        throw new Error(payload?.error || "Failed to create team member");
      }

      toast({ title: "Admin added!", description: `${name} has been added as ${selectedRole.replace("_", " ")}.` });
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
      onOpenChange(false);
      setName("");
      setEmail("");
      setPassword("");
      setSelectedRole("staff");
      setPermissions(getDefaultPermissions("staff"));
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-border/50 bg-card/95 backdrop-blur-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Admin</DialogTitle>
          <DialogDescription>Create a new team member and assign role, password & permissions.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2 sm:col-span-1">
              <Label>Full Name</Label>
              <Input placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-1">
              <Label>Email Address</Label>
              <Input type="email" placeholder="john@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-1">
              <Label>Password</Label>
              <Input type="password" placeholder="******" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Select Role</Label>
            <div className="grid grid-cols-2 gap-3">
              {roleOptions.map((r) => {
                const isSelected = selectedRole === r.role;
                return (
                  <motion.button
                    key={r.role}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRoleSelect(r.role)}
                    className={`rounded-xl border p-4 text-left transition-all duration-200 ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                        : "border-border/50 bg-background/50 hover:border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isSelected ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                        <r.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{r.label}</p>
                        <p className="text-xs text-muted-foreground">{r.description}</p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Custom Permissions</Label>
            <div className="overflow-hidden rounded-xl border border-border/50">
              <div className="grid grid-cols-5 gap-0 border-b border-border/50 bg-muted/30 px-4 py-2.5 text-xs font-medium text-muted-foreground">
                <span className="col-span-1">Module</span>
                <span className="text-center">View</span>
                <span className="text-center">Create</span>
                <span className="text-center">Edit</span>
                <span className="text-center">Delete</span>
              </div>
              {permissions.map((perm) => (
                <div key={perm.module} className="grid grid-cols-5 gap-0 border-b border-border/30 px-4 py-3 transition-colors last:border-0 hover:bg-muted/20">
                  <span className="col-span-1 text-sm font-medium capitalize text-foreground">{perm.module}</span>
                  {(["can_view", "can_create", "can_edit", "can_delete"] as const).map((field) => (
                    <div key={field} className="flex justify-center">
                      <Switch checked={perm[field]} onCheckedChange={() => togglePermission(perm.module, field)} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={saving} className="gap-2 shadow-lg shadow-primary/25">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Add Admin
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

