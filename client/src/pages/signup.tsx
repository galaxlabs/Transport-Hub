import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ShieldCheck, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { signupCustomer } from "@/lib/tss";

export default function SignupPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
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
      toast({
        title: "Passwords do not match",
        description: "Please re-enter the same password.",
        variant: "destructive",
      });
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

      toast({
        title: "Account created",
        description: result.created_customer
          ? "Your customer account and ERPNext customer profile are ready."
          : "Your customer account is ready.",
      });
      setLocation("/");
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
    <div className="min-h-screen bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_45%,#dbeafe_100%)] px-4 py-10" data-testid="page-signup">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-stretch">
        <div className="flex-1 rounded-3xl border border-white/20 bg-slate-950/35 p-8 text-white shadow-2xl backdrop-blur-md">
          <Link href="/">
            <a className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white" data-testid="link-back-home">
              <ArrowLeft className="h-4 w-4" />
              Back to website
            </a>
          </Link>

          <div className="mt-10 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">
              <ShieldCheck className="h-4 w-4 text-cyan-300" />
              Create your customer account
            </div>
            <div className="space-y-4">
              <h1 className="max-w-xl text-4xl font-bold leading-tight md:text-5xl">
                Sign up once and book your trips directly from the live TSS website.
              </h1>
              <p className="max-w-xl text-lg text-white/80">
                After signup, your customer details can be reused for website bookings, route selection, and future transport operations on the same domain.
              </p>
            </div>
          </div>
        </div>

        <Card className="w-full max-w-xl border-0 bg-white shadow-2xl">
          <CardContent className="p-8 md:p-10">
            <div className="mb-8 space-y-2 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <UserPlus className="h-7 w-7" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Customer Signup</h2>
              <p className="text-muted-foreground">Create your account clearly here, then return to the booking page.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="signup-full-name">Full Name</Label>
                <Input
                  id="signup-full-name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
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

              <div className="grid gap-5 sm:grid-cols-2">
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

              <Button type="submit" className="h-12 w-full text-base font-semibold" disabled={loading} data-testid="button-signup-submit">
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
