import { useState } from "react";
import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { signupCustomer } from "@/lib/tss";

export function CustomerSignupDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    mobile_no: "",
    password: "",
    confirm_password: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      toast({ title: "Passwords do not match", description: "Please re-enter the same password." });
      return;
    }

    setLoading(true);
    try {
      const result = await signupCustomer({
        full_name: formData.full_name,
        email: formData.email,
        mobile_no: formData.mobile_no,
        password: formData.password,
      });
      toast({
        title: "Account created",
        description: result.created_customer
          ? "Your website account and ERPNext customer record are ready."
          : "Your website account is ready.",
      });
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "transport_hub_customer",
          JSON.stringify({
            full_name: formData.full_name,
            email: formData.email,
            mobile_no: formData.mobile_no,
            user: result.user,
            customer: result.customer,
          }),
        );
        window.dispatchEvent(new CustomEvent("transport-hub-customer-updated"));
      }
      setFormData({ full_name: "", email: "", mobile_no: "", password: "", confirm_password: "" });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Could not create your account.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2" data-testid="button-signup-open">
          <UserPlus className="w-4 h-4" />
          Sign Up
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Customer Account</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="signup-full-name">Full Name</Label>
            <Input
              id="signup-full-name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-mobile">Mobile</Label>
              <Input
                id="signup-mobile"
                value={formData.mobile_no}
                onChange={(e) => setFormData({ ...formData, mobile_no: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-confirm-password">Confirm Password</Label>
              <Input
                id="signup-confirm-password"
                type="password"
                value={formData.confirm_password}
                onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading} data-testid="button-signup-submit">
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
