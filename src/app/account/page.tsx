"use client";

import { useEffect, useState } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User, Package, LogOut, Loader2 } from "lucide-react";

interface Order {
  id: number;
  userId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function AccountPage() {
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=/account");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    async function fetchOrders() {
      if (!session?.user?.id) return;

      try {
        const response = await fetch(`/api/orders?user_id=${session.user.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("bearer_token") || ""}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoadingOrders(false);
      }
    }

    if (session?.user) {
      fetchOrders();
    }
  }, [session]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const { error } = await authClient.signOut();
      if (error?.code) {
        toast.error(error.code);
      } else {
        localStorage.removeItem("bearer_token");
        await refetch();
        router.push("/");
        toast.success("Signed out successfully");
      }
    } catch (error) {
      toast.error("Failed to sign out");
    } finally {
      setIsSigningOut(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-5 md:px-10 lg:px-15 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-secondary-text mb-6">
          <a href="/" className="hover:text-primary">Home</a>
          <span className="mx-2">/</span>
          <span className="text-primary-text">Account</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-primary-text">
              My Account
            </h1>
            <p className="text-secondary-text mt-1">
              Manage your profile and orders
            </p>
          </div>
          <Button
            onClick={handleSignOut}
            disabled={isSigningOut}
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive hover:text-white"
          >
            {isSigningOut ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing out...
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-semibold">
                  {session.user.name ? session.user.name.charAt(0).toUpperCase() : <User size={32} />}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-primary-text">
                    {session.user.name || "User"}
                  </h2>
                  <p className="text-sm text-secondary-text">{session.user.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-secondary-text">Full Name</label>
                  <p className="text-base text-primary-text mt-1">
                    {session.user.name || "Not set"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary-text">Email</label>
                  <p className="text-base text-primary-text mt-1">{session.user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary-text">Member Since</label>
                  <p className="text-base text-primary-text mt-1">
                    {new Date(session.user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Section */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Package className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-semibold text-primary-text">Order History</h2>
              </div>

              {isLoadingOrders ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-secondary-text text-lg mb-4">No orders yet</p>
                  <Button asChild className="bg-primary text-primary-foreground">
                    <a href="/">Start Shopping</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                          <p className="text-sm text-secondary-text">Order #{order.id}</p>
                          <p className="text-lg font-semibold text-primary-text mt-1">
                            Rs. {order.totalAmount.toFixed(2)}
                          </p>
                          <p className="text-sm text-secondary-text mt-1">
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </p>
                        </div>
                        <div className="flex flex-col justify-center items-start sm:items-end">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
