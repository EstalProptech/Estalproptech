import { User, Bell, Lock, CreditCard, Building2, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function SettingsView() {
  return (
    <div className="space-y-6">
      <div>
        <h1>Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and application preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="rounded-xl">
          <TabsTrigger value="profile" className="rounded-lg gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg gap-2">
            <Lock className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="billing" className="rounded-lg gap-2">
            <CreditCard className="w-4 h-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="company" className="rounded-lg gap-2">
            <Building2 className="w-4 h-4" />
            Company
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="rounded-2xl shadow-sm border-border">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and profile picture</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" className="rounded-xl">Upload Photo</Button>
                  <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="Sarah" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Johnson" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="sarah.johnson@estalproptech.com" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" className="rounded-xl" />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" className="rounded-xl">Cancel</Button>
                <Button className="rounded-xl gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="rounded-2xl shadow-sm border-border">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive email updates about your properties</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified about new maintenance requests</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Payment Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts for rent payments</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">Get weekly performance summaries</p>
                </div>
                <Switch />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketing Updates</Label>
                  <p className="text-sm text-muted-foreground">Receive news and feature updates</p>
                </div>
                <Switch />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" className="rounded-xl">Cancel</Button>
                <Button className="rounded-xl gap-2">
                  <Save className="w-4 h-4" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="rounded-2xl shadow-sm border-border">
            <CardHeader>
              <CardTitle>Password & Security</CardTitle>
              <CardDescription>Manage your password and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" className="rounded-xl" />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" className="rounded-xl">Cancel</Button>
                <Button className="rounded-xl gap-2">
                  <Save className="w-4 h-4" />
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card className="rounded-2xl shadow-sm border-border">
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Manage your subscription and payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3>Professional Plan</h3>
                    <p className="text-muted-foreground">Billed monthly</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl text-primary">$99</p>
                    <p className="text-sm text-muted-foreground">/month</p>
                  </div>
                </div>
                <Button variant="outline" className="rounded-xl w-full">Upgrade Plan</Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Payment Method</Label>
                <div className="p-4 rounded-xl border border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg" />
                    <div>
                      <p>•••• •••• •••• 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/26</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-lg">Edit</Button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" className="rounded-xl">View Invoices</Button>
                <Button className="rounded-xl">Update Billing</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company" className="space-y-6">
          <Card className="rounded-2xl shadow-sm border-border">
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Manage your company details and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" defaultValue="Estal PropTech" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input id="industry" defaultValue="Property Management" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companySize">Company Size</Label>
                  <Input id="companySize" defaultValue="50-100 employees" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" defaultValue="www.estalproptech.com" className="rounded-xl" />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue="123 Tech Street" className="rounded-xl" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" defaultValue="San Francisco" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" defaultValue="California" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" defaultValue="94102" className="rounded-xl" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" className="rounded-xl">Cancel</Button>
                <Button className="rounded-xl gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
