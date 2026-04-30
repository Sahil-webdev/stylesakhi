import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { User, Bell, Shield, Globe } from "lucide-react";

const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
  <button onClick={onChange} className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? "bg-primary" : "bg-muted"}`}>
    <motion.div
      animate={{ x: enabled ? 20 : 2 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="absolute top-1 w-4 h-4 rounded-full bg-primary-foreground shadow-sm"
    />
  </button>
);

const SettingsPage = () => {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  const [publicStore, setPublicStore] = useState(true);

  const sections = [
    {
      title: "Profile",
      icon: User,
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">JD</span>
            </div>
            <div>
              <p className="font-semibold text-foreground">John Doe</p>
              <p className="text-sm text-muted-foreground">john@StyleSakhi.com</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">First Name</label>
              <input defaultValue="John" className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-transparent text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Last Name</label>
              <input defaultValue="Doe" className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-transparent text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Notifications",
      icon: Bell,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Email Notifications</p>
              <p className="text-xs text-muted-foreground">Receive order updates via email</p>
            </div>
            <ToggleSwitch enabled={emailNotifs} onChange={() => setEmailNotifs(!emailNotifs)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Push Notifications</p>
              <p className="text-xs text-muted-foreground">Browser push notifications</p>
            </div>
            <ToggleSwitch enabled={pushNotifs} onChange={() => setPushNotifs(!pushNotifs)} />
          </div>
        </div>
      ),
    },
    {
      title: "Security",
      icon: Shield,
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
            <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
          </div>
          <ToggleSwitch enabled={twoFactor} onChange={() => setTwoFactor(!twoFactor)} />
        </div>
      ),
    },
    {
      title: "Store",
      icon: Globe,
      content: (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Public Store</p>
            <p className="text-xs text-muted-foreground">Make your store visible to everyone</p>
          </div>
          <ToggleSwitch enabled={publicStore} onChange={() => setPublicStore(!publicStore)} />
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <div className="space-y-4 max-w-2xl">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <section.icon className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
            </div>
            {section.content}
          </motion.div>
        ))}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium shadow-lg shadow-primary/25"
        >
          Save Changes
        </motion.button>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
