import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, ShieldCheck, ShieldAlert, Eye,
  Plus, Search, Filter, MoreHorizontal,
  Edit2, Trash2, Mail, Clock, Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { AddAdminModal } from "@/components/team/AddAdminModal";
import { EditAdminPanel } from "@/components/team/EditAdminPanel";
import { RoleCards } from "@/components/team/RoleCards";
import { ActivityLog } from "@/components/team/ActivityLog";
import { useTeamMembers, type TeamMember, type AppRole } from "@/hooks/useRBAC";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";

const roleConfig: Record<AppRole, { label: string; color: string; icon: typeof Shield }> = {
  super_admin: { label: "Super Admin", color: "bg-primary/10 text-primary border-primary/20", icon: ShieldAlert },
  admin: { label: "Admin", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: ShieldCheck },
  manager: { label: "Manager", color: "bg-amber-500/10 text-amber-500 border-amber-500/20", icon: Shield },
  staff: { label: "Staff", color: "bg-muted text-muted-foreground border-border", icon: Eye },
};

const Team = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [roleFilter, setRoleFilter] = useState<AppRole | "all">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const { data: members, isLoading } = useTeamMembers();

  const handleSearchInput = (value: string) => {
    setSearchQuery(value);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        const normalized = value.trim();
        if (normalized) next.set("q", value);
        else next.delete("q");
        return next;
      },
      { replace: true },
    );
  };
  const { hasModuleAccess } = useAuth();

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearchQuery((prev) => (prev === q ? prev : q));
  }, [searchParams]);

  const filtered = (members ?? []).filter((m) => {
    const matchesSearch = m.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roleCounts = (members ?? []).reduce<Record<string, number>>((acc, m) => {
    acc[m.role] = (acc[m.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Manage Team & Permissions</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Control access, assign roles, and manage your team members.
        </p>
      </div>

      {/* Role Overview Cards */}
      <RoleCards roleCounts={roleCounts} selectedRole={roleFilter} onSelectRole={setRoleFilter} />

      {/* Team List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 mb-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Team Members</h2>
            <Badge variant="secondary" className="ml-2">{filtered.length}</Badge>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                className="pl-9 bg-background/50"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setRoleFilter("all")}>All Roles</DropdownMenuItem>
                {(Object.keys(roleConfig) as AppRole[]).map((role) => (
                  <DropdownMenuItem key={role} onClick={() => setRoleFilter(role)}>
                    {roleConfig[role].label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {hasModuleAccess("team", "can_create") ? (
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-primary hover:bg-primary/90 gap-2 shadow-lg shadow-primary/25"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Admin</span>
              </Button>
            ) : null}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No team members found</p>
            <p className="text-sm mt-1">Add your first team member to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filtered.map((member, i) => {
                    const config = roleConfig[member.role];
                    const initials = member.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2);

                    return (
                      <motion.tr
                        key={member.user_id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors group"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                              {initials}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{member.full_name}</p>
                              <p className="text-xs text-muted-foreground">{member.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`${config.color} border gap-1.5`}>
                            <config.icon className="w-3 h-3" />
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${member.is_active ? "bg-emerald-500" : "bg-muted-foreground/40"}`} />
                            <span className="text-sm">{member.is_active ? "Active" : "Inactive"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" />
                            {member.last_login
                              ? new Date(member.last_login).toLocaleDateString()
                              : "Never"}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {hasModuleAccess("team", "can_edit") ? (
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setEditingMember(member)}>
                                <Edit2 className="w-4 h-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => window.open(`mailto:${member.email}`, "_blank")}>
                                <Mail className="w-4 h-4 mr-2" /> Send Invite
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" /> Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                          ) : null}
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        )}
      </motion.div>

      {/* Activity Log */}
      <ActivityLog />

      {/* Modals */}
      <AddAdminModal open={showAddModal} onOpenChange={setShowAddModal} />

      <AnimatePresence>
        {editingMember && (
          <EditAdminPanel
            member={editingMember}
            onClose={() => setEditingMember(null)}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default Team;
